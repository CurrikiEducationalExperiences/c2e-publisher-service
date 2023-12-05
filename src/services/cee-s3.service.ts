import {PutObjectCommand, S3Client, S3ClientConfig} from "@aws-sdk/client-s3";
import {BindingScope, injectable} from '@loopback/core';

@injectable({
  scope: BindingScope.TRANSIENT,
  tags: {namespace: 'cee.services', name: 's3'}
})
export class CeeS3Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_CREDENTIALS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_CREDENTIALS_SECRET_ACCESS_KEY
      }
    } as S3ClientConfig);
  }

  async upload(fileName: string, fileData: any): Promise<boolean> {
    let ok: boolean;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: fileData,
    });

    try {
      await this.s3Client.send(command);
      ok = true;
      // console.log(response);
    } catch (err) {
      // console.error(err);
      ok = false;
    }
    return ok;
  }
}
