import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DeleteS3Service {
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

    async delete(key: string) {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        })
        const result = await this.s3Client.send(command)

        if (result.$metadata.httpStatusCode !== 204) {
            console.error(result)
            throw new Error('Error in delete file.')
        }
    }
}
