import axios, { AxiosResponse } from 'axios';
import { v4 } from 'uuid';
import Amplify from '../utils/amplify';

interface IFile {
  key: string;
}

class File {
  public async upload(url: string): Promise<IFile> {
    // first download the file to be uploaded
    const image = await this.download(url).catch((error) => {
      throw new Error(error.message);
    });

    // Upload streamed file to S3
    return Amplify.Storage.put(v4(), image.data, {
      contentType: 'image/png',
      customPrefix: {
        public: 'cli/',
      },
    });
  }

  private async download(url: string): Promise<AxiosResponse> {
    // download file as data stream
    return axios({
      method: 'GET',
      responseType: 'stream',
      url,
    });
  }
}

export default File;
