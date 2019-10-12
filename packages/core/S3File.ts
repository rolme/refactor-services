import * as AWS from 'aws-sdk';
import * as types from '../src/types';

/**
 * An S3 file object that provides a set of common operations on s3 files.
 */
export class S3File {
  private file : types.S3ObjectInput; 
  private s3 = new AWS.S3();

  constructor (file: types.S3ObjectInput) {
    this.s3 = new AWS.S3(); // Maybe should pass in...
    this.file = file;
  }

  public async exists() : Promise<boolean> {
    const source = {
      Bucket: this.file.bucket,
      Key: this.file.key,
    };

    try {
      await this.s3.headObject(source).promise();
      return true;
    } catch (err) {
      console.log('file ' + this.file.key + ' not found');
    }
    
    return false;
  }

}
