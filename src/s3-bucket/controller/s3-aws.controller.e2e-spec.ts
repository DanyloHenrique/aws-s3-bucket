import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { S3BucketModule } from '../s3-bucket.module.js';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import awsConfig from '../../aws.config.js';

describe('S3-Bucket (e2e)', () => {
  let app: INestApplication;
  let createdKeys: string[] = [];


  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [S3BucketModule, ConfigModule.forRoot({
            load: [awsConfig],
            isGlobal: true,
          })
        ],
    }).compile();

    app = moduleRef.createNestApplication()
    await app.init()
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    for (const key of createdKeys) {
      await request(app.getHttpServer()).delete('/s3-aws').query({ key });
    }
    createdKeys = [];
  })


  it('should be able make upload file in service S3 from AWS', async () => {    
    const result = await request(app.getHttpServer()).post('/s3-aws')
    .attach('file', './test/image.jpeg')
    .expect(201)

    createdKeys.push(result.body.payload);
    expect(result.body.payload).toEqual(expect.any(String));
  });

  it('should be able fetch url signed usign key', async ()=> {
    const uploadedFile = await request(app.getHttpServer()).post('/s3-aws')
    .attach('file', './test/image.jpeg')
    createdKeys.push(uploadedFile.body.payload);

    const result = await request(app.getHttpServer()).get('/s3-aws')
    .query({key: uploadedFile.body.payload})
    .expect(200)

    
    expect(result.body.payload).toEqual(expect.any(String));
  })

  it('should be able delete object in bucket using key', async ()=> {
    const uploadedFile = await request(app.getHttpServer()).post('/s3-aws')
    .attach('file', './test/image.jpeg')

    createdKeys.push(uploadedFile.body.payload);

    await request(app.getHttpServer()).delete('/s3-aws')
    .query({key: uploadedFile.body.payload})
    .expect(204)

  })
});
