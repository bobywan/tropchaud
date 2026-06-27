import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT ?? "localhost";
const MINIO_PORT = Number(process.env.MINIO_PORT ?? "9000");
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY ?? "";
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY ?? "";
const MINIO_USE_SSL = process.env.MINIO_USE_SSL === "true";

export const BUCKET = process.env.MINIO_BUCKET ?? "tropchaud";

export const s3 = new S3Client({
  endpoint: `${MINIO_USE_SSL ? "https" : "http"}://${MINIO_ENDPOINT}:${MINIO_PORT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

export async function uploadFichier(params: {
  cle: string;
  body: Buffer | Uint8Array;
  contentType: string;
}): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: params.cle,
      Body: params.body,
      ContentType: params.contentType,
    }),
  );
}

export async function getUrlSignee(
  cle: string,
  expiresIn = 3600,
): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: cle });
  return getSignedUrl(s3, command, { expiresIn });
}

export async function supprimerFichier(cle: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: cle }));
}
