import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Express } from "express";
import { ENV } from "./env";

export function registerStorageProxy(app: Express) {
  app.get("/app-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    try {
      const s3 = new S3Client({
        region: ENV.awsRegion,
        credentials: {
          accessKeyId: ENV.awsAccessKeyId,
          secretAccessKey: ENV.awsSecretAccessKey,
        },
      });

      const command = new GetObjectCommand({
        Bucket: ENV.s3BucketName,
        Key: key,
      });

      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
