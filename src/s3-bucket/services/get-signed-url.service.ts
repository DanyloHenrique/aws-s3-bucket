import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const ONE_HOUR_EXPIRE_URL = 3600 

@Injectable()
export class GetSignedUrlS3Service {
    private s3Client: S3Client
    private bucket: string

    constructor(private readonly configService: ConfigService) {
        this.s3Client = new S3Client({
            region: configService.get('aws.region'),
            credentials: {
                accessKeyId: configService.getOrThrow('aws.accessKeyId'),
                secretAccessKey: configService.getOrThrow('aws.secretAccessKey'),
                sessionToken: configService.getOrThrow('aws.sessionToken')
            },
            
        }),
            this.bucket = configService.getOrThrow('aws.s3BucketName');

    }

    async getSignedUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        const url_result = getSignedUrl(this.s3Client, command, {expiresIn: ONE_HOUR_EXPIRE_URL})
        return url_result
  }
}
