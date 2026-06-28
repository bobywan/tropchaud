import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT ?? "localhost";
const MINIO_PORT = Number(process.env.MINIO_PORT ?? "9000");
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY ?? "";
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY ?? "";
const MINIO_USE_SSL = process.env.MINIO_USE_SSL === "true";
const MINIO_PUBLIC_URL = process.env.MINIO_PUBLIC_URL;

export const BUCKET = process.env.MINIO_BUCKET ?? "tropchaud";

const clientConfig = {
  region: "us-east-1",
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
} as const;

export const s3 = new S3Client({
  ...clientConfig,
  endpoint: `${MINIO_USE_SSL ? "https" : "http"}://${MINIO_ENDPOINT}:${MINIO_PORT}`,
});

// ponytail: client séparé pour les URLs pré-signées — le hostname doit être
// celui que le navigateur peut résoudre, pas le hostname interne Docker.
const s3Public = MINIO_PUBLIC_URL
  ? new S3Client({ ...clientConfig, endpoint: MINIO_PUBLIC_URL })
  : s3;

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

export async function getUrlSignee(cle: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: cle });
  return getSignedUrl(s3Public, command, { expiresIn });
}

export async function supprimerFichier(cle: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: cle }));
}
