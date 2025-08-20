import { ComprehendClient, BatchDetectEntitiesCommand } from "@aws-sdk/client-comprehend";

// .env에서 aws 정보 읽어오기
const awsAccessKey = process!.env!.AWS_ACCESS_KEY_ID!;
const awsSecretKey = process!.env!.AWS_ACCESS_KEY_SECRET!;
const awsS3BucketRegion = process.env.AWS_S3_BUCKET_REGION;

export async function entityExtraction(text:string):Promise<any> {
  try {
    const transcribeConfig = {
      region: awsS3BucketRegion,
      credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
      },
    };
    const client = new ComprehendClient(transcribeConfig);
    const input:any = {
      TextList: [
        text,
      ],
      LanguageCode: "ko"
    };
    const command = new BatchDetectEntitiesCommand(input);
    const response = await client.send(command);
    return response;
  } catch (e) {
    console.log(e);
    return 'Error';
  }
}