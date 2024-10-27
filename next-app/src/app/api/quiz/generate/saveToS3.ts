import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export default async function saveToS3(file: File) {
    const accessKeyId = process.env.AWS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!accessKeyId || !secretAccessKey || !region || !bucketName) {
        return {file_id: null, file_name: null, error: "No possibility to connect to cloud" };
    }

    // Generate UUID for file name
    const fileId = uuidv4();

    const client = new S3Client({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
    const fileData = await file.arrayBuffer() as Buffer;
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileId,
        Body: fileData,
        ContentType: file.type,
    });
    
    console.log("Uploading file to S3");
    try {
        await client.send(command);
        return { file_id: fileId, file_name: file.name };
    }
    catch (e) {
        console.error("Error uploading file to S3", e);
        return { file_id: null, file_name: null, error: e };
    }
}
