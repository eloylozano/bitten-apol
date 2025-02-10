import multiparty from 'multiparty';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from 'fs';
import mime from 'mime-types';
import { NextApiRequest, NextApiResponse } from 'next';

const bucketName = 'bitten-apol';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const form = new multiparty.Form();

    try {
        const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({ fields, files });
            });
        });

        console.log('Files length:', files.file.length);

        const client = new S3Client({
            region: 'eu-north-1',
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY!,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
            },
        });

        const links: string[] = [];

        for (const file of files.file) {
            const ext = file.originalFilename?.split('.').pop() || 'unknown';
            const newFilename = Date.now() + '.' + ext;
            console.log({ ext, file });

            await client.send(new PutObjectCommand({
                Bucket: bucketName,
                Key: newFilename,
                Body: fs.readFileSync(file.path),
                ACL: 'public-read',
                ContentType: mime.lookup(file.path) || 'application/octet-stream', // Mejor usar un tipo por defecto
            }));

            const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
            links.push(link);
        }

        return res.json({ links });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error processing file upload' });
    }
}

export const config = {
    api: { bodyParser: false },
};
