// s3 접근하기 위해 불러옴
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3";
// presigned url 이용하기 위해 불러옴
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// .env에서 aws 정보 읽어오기
const awsAccessKey = process!.env!.AWS_ACCESS_KEY_ID!;
const awsSecretKey = process!.env!.AWS_ACCESS_KEY_SECRET!;
const awsS3Bucket = process.env.AWS_S3_BUCKET;
const awsS3BucketRegion = process.env.AWS_S3_BUCKET_REGION;

// s3 클라이언트 연결
export const s3 = new S3Client({
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretKey,
  },
  region: awsS3BucketRegion,
});

// file signedUrl 가져오기
export async function getSignedFileUrl(name:string) {
  const params = {
    Bucket: awsS3Bucket,
    Key: name,
  };
  const command = new PutObjectCommand(params);
  const url = await getSignedUrl(s3, command, {
    expiresIn: 3600,
  });
  return url;
}

// 텍스트 변환결과 가져오기
export async function getReportJson(key:string) {
  const data = await s3.send(new GetObjectCommand({
    Bucket: awsS3Bucket,
    Key: key
  }));
  return data;
}