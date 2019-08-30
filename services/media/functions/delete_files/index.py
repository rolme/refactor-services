import boto3
import re
import os
import logging

logger = logging.getLogger('delete_files')
logger.setLevel(logging.DEBUG)

s3_resource = boto3.resource('s3')

MEDIA_BUCKET = os.environ['MEDIA_BUCKET']

pattern = re.compile("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/original$")

def delete_files(bucket,key):
    # sanity check key to prevent deleting more than we should
    if bucket != MEDIA_BUCKET:
        logger.error("bucket {} does not match media bucket, bailing".format(bucket))
        return
    if not pattern.match(key):
        logger.error("key {} does not match pattern, bailing".format(key))
        return

    # remove 'original' from end of key to get prefix
    prefix = key[:-8]

    # https://stackoverflow.com/a/53836093
    bucket_resource = s3_resource.Bucket(bucket)
    result = bucket_resource.objects.filter(Prefix=prefix).delete()

    logger.debug("delete result: {}".format(result))

def handler(event, context):
    logger.debug('event: {}'.format(event))

    if 'file' not in event:
        logger.error("file missing, bailing")
        return
    if 'bucket' not in event['file']:
        logger.error("bucket missing, bailing")
        return
    if 'key' not in event['file']:
        logger.error("key missing, bailing")
        return

    delete_files(event['file']['bucket'],event['file']['key'])

    logger.debug('handler done')
