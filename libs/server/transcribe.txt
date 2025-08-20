// import { S3 } from "@aws-sdk/client-s3";
// import { GetTranscriptionJobCommand, GetTranscriptionJobCommandOutput, StartTranscriptionJobCommand, TranscribeClient, TranscriptionJob } from "@aws-sdk/client-transcribe";
// import { getReportJson, s3 } from "./s3";
// import streamToString from "stream-to-string";

// // .env에서 aws 정보 읽어오기
// const awsAccessKey = process!.env!.AWS_ACCESS_KEY_ID!;
// const awsSecretKey = process!.env!.AWS_ACCESS_KEY_SECRET!;
// const awsS3Bucket = process.env.AWS_S3_BUCKET;
// const awsS3BucketRegion = process.env.AWS_S3_BUCKET_REGION;

// async function sendTranscribeJob(transcribeClient:TranscribeClient, s3Object:any, reportId:number):Promise<TranscriptionJob | null> {
//   try {
//     const params:any = {
//       TranscriptionJobName: `report-${reportId}`,
//       LanguageCode: 'ko-KR',
//       MediaFormat: 'webm',
//       Media: {
//         MediaFileUri: `https://s3-ap-northeast-2.amazonaws.com/${awsS3Bucket}/${s3Object}`,
//       },
//       OutputBucketName: awsS3Bucket,
//     };
//     const transcribeCommand = new StartTranscriptionJobCommand(params);

//     const transcriptionJobResponse:any = await transcribeClient.send(transcribeCommand);
//     return transcriptionJobResponse.TranscriptionJob;
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// }

// async function getTranscribeResult(transcribeClient: TranscribeClient,transcriptionJobName: string):Promise<TranscriptionJob | undefined | null> {
//   try {
//     const param = {
//       TranscriptionJobName: transcriptionJobName,
//     };
//     const transcribeCommand = new GetTranscriptionJobCommand(param);
//     let i = 0;
//     let job:any;
//     while (i < 60) {
//       job = await transcribeClient.send(transcribeCommand);
//       const job_status:any = job['TranscriptionJob']['TranscriptionJobStatus'];
//       if (['COMPLETED', 'FAILED'].includes(job_status)) {
//         if (job_status === 'COMPLETED') {
//           return job['TranscriptionJob'];
//         }
//       } else {
//         console.log(`Waiting for ${transcriptionJobName}. Current status is ${job_status}`);
//       }
//       i++;
//       await new Promise((resolve) => {
//         setTimeout(resolve, 1000);
//       });
//     }
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// }

// async function getTranscriptFile(keyName:string):Promise<string | null> {
//   try {
//     const transcriptFile:any = await getReportJson(`${keyName}.json`);
//     const bodyContents = await streamToString(transcriptFile.Body);
//     const jsonData = JSON.parse(bodyContents);
    
//     const transcripts = jsonData.results.transcripts[0].transcript;
//     const text: string = transcripts === '' ? 'empty' : transcripts;
//     return text;
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// }

// export async function textExtraction(s3Object:any, reportId:number):Promise<string> {
//   try {
//     const transcribeConfig = {
//       region: awsS3BucketRegion,
//       credentials: {
//         accessKeyId: awsAccessKey,
//         secretAccessKey: awsSecretKey,
//       },
//     };
//     const transcribeClient = new TranscribeClient(transcribeConfig);
//     const transcriptionJobResponse:any = await sendTranscribeJob(
//       transcribeClient,
//       s3Object,
//       reportId,
//     );
//     const successTranscribe:any = await getTranscribeResult(
//       transcribeClient,
//       transcriptionJobResponse.TranscriptionJobName,
//     );
//     const script:any = await getTranscriptFile(successTranscribe.TranscriptionJobName);
//     return script;
//   } catch (e) {
//     console.log(e);
//     return 'Error';
//   }
// }