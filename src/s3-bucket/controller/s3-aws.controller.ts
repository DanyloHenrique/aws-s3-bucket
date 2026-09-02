import 'multer'
import { Controller, Delete, FileTypeValidator, Get, HttpCode, MaxFileSizeValidator, ParseFilePipe, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UploadS3Service } from '../services/upload-s3.service.js';
import { GetSignedUrlS3Service } from '../services/get-signed-url.service.js';
import { DeleteS3Service } from '../services/delete-s3.service.js';

const MAX_SIZE_FILE_5MB = 5000000

@Controller('s3-aws')
export class S3AWSController {
    constructor (
        private readonly uploadS3Service: UploadS3Service,
        private readonly getSignedUrlS3Service: GetSignedUrlS3Service,
        private readonly deleteS3Service: DeleteS3Service
    ){}


    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: MAX_SIZE_FILE_5MB }),
                new FileTypeValidator({ fileType: /^image\/(png|jpeg)$/ }),
            ] 
        })
    ) file: Express.Multer.File) {

     console.log(file)
     const uploadFileDTO = {
        fileName: file.originalname,
        file: file.buffer
     }
    const key = await this.uploadS3Service.upload(uploadFileDTO)
    return {payload: key}
    }


    @Get()
    async downloadFile(@Query('key') key: string) {
        const url = await this.getSignedUrlS3Service.getSignedUrl(key)
        return { payload: url };
    }

    @Delete()
    @HttpCode(204)
    async deleteFile(@Query('key') key: string){
        await this.deleteS3Service.delete(key)
    }
    
}
