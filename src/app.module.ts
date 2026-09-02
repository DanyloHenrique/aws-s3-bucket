import { Module } from '@nestjs/common';
import { S3BucketModule } from './s3-bucket/s3-bucket.module.js';
import { AppController } from './app.controller.js';
import { ConfigModule } from '@nestjs/config';
import awsConfig from './aws.config.js';

@Module({
  imports: [S3BucketModule,
    ConfigModule.forRoot({
      load: [awsConfig],
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}