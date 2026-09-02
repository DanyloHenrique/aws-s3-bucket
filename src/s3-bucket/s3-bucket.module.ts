import { Module } from '@nestjs/common';
import { S3AWSController } from './controller/s3-aws.controller.js';
import { UploadS3Service } from './services/upload-s3.service.js';
import { GetSignedUrlS3Service } from './services/get-signed-url.service.js';
import { DeleteS3Service } from './services/delete-s3.service.js';

@Module({
  controllers: [S3AWSController],
  providers: [UploadS3Service, GetSignedUrlS3Service, DeleteS3Service]
})
export class S3BucketModule {}
