import boto3
import logging
import os
import shutil
import tempfile
import uuid
import urllib
import json
from subprocess import run
from PIL import Image
# numpy and scipy log the following warning
# OpenBLAS WARNING - could not determine the L2 cache size on this system, assuming 256k
import numpy as np
import scipy
import scipy.ndimage.interpolation
from math import pi

s3_resource = boto3.resource('s3')

logger = logging.getLogger('thumbnails')
logger.setLevel(logging.DEBUG)

TMP = tempfile.gettempdir()

MEDIA_BUCKET = os.environ['MEDIA_BUCKET']
MEDIA_BUCKET_REGION = os.environ['MEDIA_BUCKET_REGION']

GRAPHQL_URL = os.environ['GRAPHQL_URL']

def run_query(query,variables,authorization):
    logger.debug('query: {}, variables: {}'.format(query,variables))

    try:
        data = json.dumps({'query': query,'variables': variables}).encode('utf-8')
        req = urllib.request.Request(GRAPHQL_URL)
        req.add_header('Content-Type', 'application/json; charset=utf-8')
        req.add_header('Authorization', authorization)
        req.add_header('Content-Length', len(data))
        response = urllib.request.urlopen(req, data)
    except Exception as e:
        logger.error("Error: " + str(e))
        raise Exception("Error: " + str(e))

    return json.loads(response.read())

''' Extra various exif properties needed to mostly to describe 360 images.
    @param exif ExifTool data passed in JSON format
'''
def update_image_properties(variables, exif):
    if exif == None:
        return None

    imageWidth = 0
    imageHeight = 0

    variables['image'] = {}

    # extra 360 information if ProjectionType exists
    if 'ProjectionType' in exif:
        # only support equirectangular currently
        if exif['ProjectionType'].lower() == "equirectangular":
            variables['image']['projectionType'] = 'EQUIRECT'

        try:
            # if heading assume the rest are available
            if 'PoseHeadingDegrees' in exif:
                heading = exif['PoseHeadingDegrees']
                pitch = exif['PosePitchDegrees']
                roll = exif['PoseRollDegrees']
                posePosition = {
                    'yaw' : heading,
                    'pitch' : pitch,
                    'roll' : roll
                }
                variables['image']['heading'] = posePosition
        except Exception as e:
            logger.debug('update_image_properties posePosition error: {}'.format(repr(e)))

        # Extract a small set of exif parameters that might be interesting.
        # This is mostly useful for debugging.  Interesting fields should be promoteed
        # to real schem vars
        shortExif = {
            "ProjectionType" : exif['ProjectionType']
        }
        if 'Make' in exif:
            shortExif['Make'] = exif['Make']
        if 'Model' in exif:
            shortExif['Model'] = exif['Model']
        if 'MIMEType' in exif:
            shortExif['MIMEType'] = exif['MIMEType']
        if 'FirmwareVersion' in exif:
            shortExif['FirmwareVersion'] = exif['FirmwareVersion']
        if 'RicohPitch' in exif:
            shortExif['RicohPitch'] = exif['RicohPitch']
        if 'RicohRoll' in exif:
            shortExif['RicohRoll'] = exif['RicohRoll']
        if 'FOV' in exif:
            shortExif['FOV'] = exif['FOV']
        if 'DateTimeOriginal' in exif:
            shortExif['DateTimeOriginal'] = exif['DateTimeOriginal']
        if 'CreateDate' in exif:
            shortExif['CreateDate'] = exif['CreateDate']

        variables['image']['exif'] = json.dumps(shortExif)


def update_room(room_id,key,exif,authorization):
    query = 'mutation UpdateRoom($id:ID!,$file:S3ObjectInput, $image: ImageUpdateInput) { updateRoom(id: $id, file: $file, image: $image) { id } }'

    variables = {
        'id': room_id,
        'file' :  {
            'bucket': MEDIA_BUCKET,
            'key': key,
            'region': MEDIA_BUCKET_REGION,
            'mimeType': 'image/jpeg',
        }
    }

    # only update file properties if we have extracted more information
    update_image_properties(variables, exif)

    result = run_query(query,variables,authorization)
    logger.debug('updateRoom result: {}'.format(result))

def update_user(key,authorization,attribute):
    query = f'mutation UpdateUser(${attribute}:S3ObjectInput!) { updateUser({attribute}: ${attribute}) { id } }'

    variables = {}
    variables[attribute] = {
        'bucket': MEDIA_BUCKET,
        'key': key,
        'region': MEDIA_BUCKET_REGION,
        'mimeType': 'image/jpeg'
    }

    result = run_query(query,variables,authorization)
    logger.debug('updateUser result: {}'.format(result))

def update_floor(id,tourId,key,authorization):
    query = 'mutation UpdateFloor($file:S3ObjectInput, $id: ID!, $tourId: ID!) { updateFloor(file: $file, id: $id, tourId: $tourId) { id } }'

    variables = {
      'file': {
        'bucket': MEDIA_BUCKET,
        'key': key,
        'region': MEDIA_BUCKET_REGION,
        'mimeType': 'image/jpeg'
      },
      'id': id,
      'tourId': tourId,
    }

    result = run_query(query,variables,authorization)
    logger.debug('updateFloor result: {}'.format(result))

def get_exif(file_path):
    exif = None
    try:
        result = run(["/opt/bin/perl","-I","/opt/exiftool/lib/perl5","/opt/exiftool/bin/exiftool","-j",file_path],encoding="utf-8",capture_output=True)
        if result.returncode != 0:
            logger.error("exiftool: {}".format(result))
        else:
            exif = json.loads(result.stdout)[0]
            logger.debug('exif: {}'.format(exif))
    except Exception as e:
        logger.error('get_exif unable to load exif data: '+str(e))
    return exif

def is_equirectangular(exif):
    if exif != None and "ProjectionType" in exif:
        if exif["ProjectionType"].lower() == "equirectangular":
            return True
    return False

def thumbnail(im,size,dest,rotate=None):
    logger.debug("Generating {} thumbnail from {}".format(size,im))
    im.thumbnail((size,size))
    if rotate:
        im = im.transpose(rotate)
    dest = os.path.join(dest,"th-"+str(size))
    logger.debug("Saving {} thumbnail to {}".format(size,dest))
    im.save(dest,"JPEG")
    return dest

def eq2cm(file_path,dest):
    size = "1536"
    logger.debug("Generating {} cube map sides from: {}".format(size,file_path))
    prefix = os.path.join(dest,"side-"+size+"-")
    run(["/opt/bin/eq2cm",file_path,size,prefix])
    # Rotate top and bottom, rename, and convert for marzipano
    for key,val in enumerate(["l","r","u","d","b","f"]):
        f = prefix+str(key)+".png"
        im = Image.open(f)
        if key in [2,3]:
            im = im.transpose(Image.ROTATE_180)
        im.save(prefix+str(val),"JPEG")
        os.remove(f)

#
# The following code is inspired by:
#
#   http://stackoverflow.com/questions/29678510/convert-21-equirectangular-panorama-to-cube-map/29681646#29681646
#
# While the above-referenced answer specifically addresses deriving the six
# sides of a cubemap from an equirectangular image, this implementation focuses
# solely on the front face of the cube, but allows it to be sized arbitrarily
#
# Render using an inverse transformation of every output pixels back to the
# nearest input pixels, interpolating between them with a cupic spline as needed
#
def renderFrontView(inputImage, outputImage):
    inputWidth = inputImage.shape[1]
    inputRatio = inputWidth / (2.0 * pi)
    outputWidth = outputImage.shape[1]
    outputHeight = outputImage.shape[0]
    outputRatio = float(outputWidth) / outputHeight

    # Map output image coordinates to x, y and z (x is always 1)
    yo = np.arange(-1.0, 1.0, 2.0 / outputWidth) * outputRatio
    zo = 1.0 - np.arange(0.0, 2.0, 2.0 / outputHeight)

    # Create a mesh from the mapped output coordinates
    hy, hz = scipy.meshgrid(yo, zo)

    # Project mesh of mapped output coordinates back to a matrix of input image coordinates
    xi = inputRatio * (np.arctan(hy) + pi)
    yi = inputRatio * (pi / 2 - np.arctan2(hz, np.sqrt(1 + hy * hy)))
    yixi = np.array([yi, xi])

    # For each color channel (e.g. R, G and B)...
    for channel in [0, 1, 2]:
        # Derive the output image color channel values via cubic spline interpolation
        # of the color channel values from the nearest input image coordinates
        outputImage[:, :, channel] = scipy.ndimage.interpolation.map_coordinates(
            inputImage[:, :, channel],
            yixi,
            order = 3)

def process_img(file):
    # TODO: use client-set id if present
    file_id = str(uuid.uuid4())

    # create tmp workspace since a single lambda could process several images
    base_path = os.path.join(TMP,file_id)
    o_path = os.path.join(base_path,"o")
    th_path = os.path.join(base_path,"th")
    os.makedirs(o_path)
    os.makedirs(th_path)
    orig_path = os.path.join(o_path,os.path.basename(file['key']))

    # Download original from S3 into tmp workspace
    s3_resource.Bucket(file['bucket']).download_file(file['key'], orig_path)

    orig_im = Image.open(orig_path)

    exif = get_exif(orig_path)

    # Thumbnail rotation flag
    rotate = None
    if exif != None and 'Orientation' in exif:
        if exif['Orientation'] == "Rotate 180":
            rotate = Image.ROTATE_180
        elif exif['Orientation'] == "Rotate 90 CW":
            rotate = Image.ROTATE_270
        elif exif['Orientation'] == "Rotate 270 CW":
            rotate = Image.ROTATE_90

    if is_equirectangular(exif):
        logger.debug("{} is equirectangular".format(orig_path))

        # Generate 4096 equirectangular thumbnail
        thumbnail(orig_im,4096,th_path,rotate)

        # Generate 2048 front face preserving original aspect ratio and use as basis for thumbnails
        size = 2048
        logger.debug("Generating {} thumbnail from {}".format(size,orig_path))
        w, h = orig_im.size
        aspectRatio = w / h if h > 0 else 2
        logger.debug("size: {}, w: {}, h: {}, aspectRatio: {}".format(size,w,h,aspectRatio))

        # Read the input image with equirectangular projection
        inputImage = np.asarray(orig_im)

        # Render the front view of the input image into the output image
        outputImage = np.zeros((int(size / aspectRatio), size, 3))
        renderFrontView(inputImage, outputImage)

        # Write the output image to standard output
        dest = os.path.join(th_path,"th-"+str(size))
        logger.debug("Saving {} thumbnail to {}".format(size,dest))
        Image.fromarray(np.uint8(outputImage)).save(dest,"JPEG")

        th_2048_path = dest

        eq2cm(orig_path,th_path)
    else:
        logger.debug("{} is NOT equirectangular".format(orig_path))

        # Generate 2048 thumbnail
        th_2048_path = thumbnail(orig_im,2048,th_path,rotate)

    # Generate 320, 640, 1280 thumbnails from the 2048 thumbnail
    for size in [320, 640, 1280]:
        th_2048_im = Image.open(th_2048_path)
        thumbnail(th_2048_im,size,th_path)

    # Upload thumbnails to media bucket
    for root,dirs,files in os.walk(th_path):
        logger.debug("root: {}, dirs: {}, files: {}".format(root,dirs,files))
        for f in files:
            local_path = os.path.join(root, f)
            relative_path = os.path.relpath(local_path, th_path)
            s3_key = file_id+"/"+relative_path
            mimetype = "image/jpeg"
            logger.debug("file: {}, local_path: {}, relative_path: {}, s3_key: {}, mimetype: {}".
                format(f,local_path,relative_path,s3_key,mimetype))
            s3_resource.Bucket(MEDIA_BUCKET).upload_file(local_path, s3_key,
                ExtraArgs={'ContentType': mimetype})

    # Copy original from upload bucket to media bucket to preserve metadata
    dest_key = file_id + "/original"
    s3_resource.Bucket(MEDIA_BUCKET).copy({
        'Bucket': file['bucket'],
        'Key': file['key']
    }, dest_key)

    # cleanup
    shutil.rmtree(base_path)

    return dest_key,exif

def handler(event, context):
    authorization = event['authorization']
    event['authorization'] = event['authorization'][:10] + '...'
    logger.debug('event: {}'.format(event))

    # update appsync depending in input
    if 'roomId' in event:
        key,exif = process_img(event['file'])
        update_room(event['roomId'],key,exif,authorization)
    elif 'picture' in event:
        key,exif = process_img(event['picture'])
        update_user(key,authorization,'picture')
    elif 'tripodCover' in event:
        key,exif = process_img(event['tripodCover'])
        update_user(key,authorization,'tripodCover')
    elif 'floorId' in event:
        key,exif = process_img(event['file'])
        update_floor(event['floorId'],event['tourId'],key,authorization);
    else:
        raise Exception("not sure what do do")

    logger.debug('handler done')
