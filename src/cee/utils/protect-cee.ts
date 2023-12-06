import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import admzip from 'adm-zip';
import crypto from 'crypto';
import {once} from 'events';
import fs, {ReadStream} from 'node:fs';
import {AWS_CREDENTIALS, AWS_REGION, AWS_S3_BUCKET, AWS_S3_BUCKET_URL, MASTER_KEY, TEMP_DIR} from '../../config';
import {Cee} from '../../models';

export const protectCee = async (
  filePath: ReadStream | Boolean,
  ceeRecord: Cee
): Promise<Boolean> => {return true;}

export const encryptCee = async (
  filePath: string,
  encryptionKey: string,
  ceeId: string,
  keepLocal?: Boolean
): Promise<any> => {
  // S3 Init
  const S3 = new S3Client({region: AWS_REGION, credentials: AWS_CREDENTIALS});
  // Decrypt license key
  const key = decryptLicenseKey(encryptionKey);
  // Unzipping C2E package
  const tempFolder = `${TEMP_DIR}/${crypto.randomUUID()}`;
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
    Bucket: AWS_S3_BUCKET,
    Key: `${ceeId}.c2e`,
    Body: content
  });
  await S3.send(putCommand);
  if (keepLocal) {
    return {
      bucketUrl: `${AWS_S3_BUCKET_URL}${ceeId}.c2e`,
      localPath: `${tempFolder}/${ceeId}.c2e`
    };
  }

  fs.unlinkSync(`${tempFolder}/${ceeId}.c2e`);
  return {bucketUrl: `${AWS_S3_BUCKET_URL}${ceeId}.c2e`}

}

export const generateLicenseKey = (): string => {
  const key = crypto.randomBytes(32).toString('hex');
  const cipher = crypto.createCipher('aes-256-cbc', MASTER_KEY);
  const encryptedKey = cipher.update(key, 'hex', 'hex') + cipher.final('hex');
  return encryptedKey;
}

export const decryptLicenseKey = (key: string): string => {
  const keyBuffer = Buffer.from(key, 'hex');
  const decipher = crypto.createDecipher('aes-256-cbc', MASTER_KEY);
  const decrypted = decipher.update(keyBuffer, undefined, 'hex') + decipher.final('hex');
  return decrypted;
}
