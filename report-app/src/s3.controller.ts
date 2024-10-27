import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as AWS from 'aws-sdk';
import * as PDFDocument from 'pdfkit';
import * as dotenv from 'dotenv';

dotenv.config();

@Controller()
export class S3Controller {
  private s3: AWS.S3;

  constructor() {
    console.log('YOu should see envs below!');
    console.log(process.env.AWS_KEY_ID ?? 'NO ENV SET');
    console.log(process.env.AWS_SECRET_ACCESS_KEY ?? 'NO ENV SET');
    console.log(process.env.AWS_REGION ?? 'NO ENV SET');
    console.log('YOu should see envs above!');
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  @Get('generate-pdf')
  async generatePdf(@Res() res: Response) {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    try {
      const data = await this.s3
        .listObjectsV2({ Bucket: bucketName })
        .promise();

      const files = data.Contents.map((file) => ({
        key: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
      }));

      const doc = new PDFDocument();
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=files_info.pdf',
        );
        res.send(pdfData);
      });

      doc.fontSize(18).text(`File information from S3 bucket: ${bucketName}`);
      doc.moveDown();

      files.forEach((file) => {
        doc.fontSize(12).text(`File: ${file.key}`);
        doc.text(`Size: ${file.size} bytes`);
        doc.text(`Last Modified: ${file.lastModified}`);
        doc.moveDown();
      });

      doc.end();
    } catch (error) {
      console.error('Error retrieving files from S3:', error);
      res.status(500).send('Failed to retrieve files from S3');
    }
  }
}
