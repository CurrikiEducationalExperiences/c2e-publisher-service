import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {BindingScope, inject, injectable} from '@loopback/core';
import admzip from 'adm-zip';
import crypto from 'crypto';
import {once} from 'events';
import fs from 'node:fs';
import {AWS_CREDENTIALS_ACCESS_KEY_ID, AWS_CREDENTIALS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET, AWS_S3_BUCKET_URL, MASTER_KEY, TEMP_DIR} from '../keys';

@injectable({scope: BindingScope.TRANSIENT})
export class CeeProtectService {
  constructor(
    @inject(AWS_CREDENTIALS_ACCESS_KEY_ID) private awsCredentialsAccessKeyId: string,
    @inject(AWS_CREDENTIALS_SECRET_ACCESS_KEY) private awsCredentialsSecretAccessKey: string,
    @inject(AWS_REGION) private awsRegion: string,
    @inject(AWS_S3_BUCKET) private awsS3Bucket: string,
    @inject(AWS_S3_BUCKET_URL) private awsS3BucketURL: string,
    @inject(MASTER_KEY) private masterKey: string,
    @inject(TEMP_DIR) private tempDir: string
  ) { }

  async encryptCee(
    filePath: string,
    encryptionKey: string,
    ceeId: string,
    keepLocal?: Boolean
  ): Promise<any> {
    // S3 Init
    const S3 = new S3Client({
      region: this.awsRegion, credentials: {
        accessKeyId: this.awsCredentialsAccessKeyId,
        secretAccessKey: this.awsCredentialsSecretAccessKey
      }
    });
    // Decrypt license key
    const key = this.decryptLicenseKey(encryptionKey);
    // Unzipping C2E package
    const tempFolder = `${this.tempDir}/${crypto.randomUUID()}`;
    const zip = new admzip(filePath);
    zip.extractAllTo(tempFolder, true);
    const subdir = fs.readdirSync(tempFolder)[0];

    // Packaging the content files
    const zip2 = new admzip();
    zip2.addLocalFolder(`${tempFolder}/${subdir}/${subdir}`);
    zip2.writeZip(`${tempFolder}/${subdir}.c2e.temp`);
    fs.rmdirSync(`${tempFolder}/${subdir}/${subdir}`, {recursive: true});

    // Ecnrypt the content file
    const cipher = crypto.createCipher('aes-256-cbc', Buffer.from(key, 'hex'));
    const input = fs.createReadStream(`${tempFolder}/${subdir}.c2e.temp`);
    const output = fs.createWriteStream(`${tempFolder}/${subdir}/${subdir}.c2e`);
    const stream = input.pipe(cipher).pipe(output);
    await once(stream, 'finish');
    fs.unlinkSync(`${tempFolder}/${subdir}.c2e.temp`);

    // Repackaging
    const zip3 = new admzip();
    zip3.addLocalFolder(`${tempFolder}/${subdir}`, subdir);
    zip3.writeZip(`${tempFolder}/${ceeId}.c2e`);

    // Save to AWS
    const content = fs.createReadStream(`${tempFolder}/${ceeId}.c2e`);
    const putCommand = new PutObjectCommand({
      Bucket: this.awsS3Bucket,
      Key: `${ceeId}.c2e`,
      Body: content
    });
    await S3.send(putCommand);
    if (keepLocal) {
      return {
        bucketUrl: `${this.awsS3BucketURL}${ceeId}.c2e`,
        localPath: `${tempFolder}/${ceeId}.c2e`
      };
    }

    fs.unlinkSync(`${tempFolder}/${ceeId}.c2e`);
    return {bucketUrl: `${this.awsS3BucketURL}${ceeId}.c2e`}

  }

  generateLicenseKey(): string {
    const key = crypto.randomBytes(32).toString('hex');
    const cipher = crypto.createCipher('aes-256-cbc', this.masterKey);
    const encryptedKey = cipher.update(key, 'hex', 'hex') + cipher.final('hex');
    return encryptedKey;
  }

  decryptLicenseKey = (key: string): string => {
    const keyBuffer = Buffer.from(key, 'hex');
    const decipher = crypto.createDecipher('aes-256-cbc', this.masterKey);
    const decrypted = decipher.update(keyBuffer, undefined, 'hex') + decipher.final('hex');
    return decrypted;
  }

}
