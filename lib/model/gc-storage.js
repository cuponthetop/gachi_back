import * as _ from 'lodash';
import Storage from '@google-cloud/storage';

const BUCKET_NAME = "gachi-bucket";

export class GoogleCloudStorageManager {
  constructor() {
    this.storage = Storage({
      projectId: 'gachi-test',
      keyFilename: 'config/firebase-service-config.json'
    });
    this.bucket = this.storage.bucket(BUCKET_NAME);
  }

  async uploadBinaryImage(fileBuffer, filename) {
    return new Promise(function (resolve, reject) {
      const options = {
        entity: 'allUsers',
        role: Storage.acl.READER_ROLE
      };

      const file = this.bucket.file(filename, options);

      const stream = file.createWriteStream();

      stream.on('error', (err) => {
        reject(err);
      });

      stream.on('finish', () => {
        resolve(getPublicUrl(filename));
      });

      stream.end(fileBuffer);
    }.bind(this));
  }
}

function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${BUCKET_NAME}/${filename}`;
};