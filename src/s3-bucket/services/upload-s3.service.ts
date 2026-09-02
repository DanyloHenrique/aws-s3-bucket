import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { extname } from 'path';
import { v4 } from 'uuid'

@Injectable()
export class UploadS3Service {
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

    async upload({ fileName, file }: { fileName: string, file: Buffer }) {

        const key = `apis3upload/${v4()}${extname(fileName)}`;
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file,
        })

        const result = await this.s3Client.send(command)

        if(result.$metadata.httpStatusCode !== 200){
            throw new Error('Error external in AWS.')
        }
        
        return key;
    }
}
