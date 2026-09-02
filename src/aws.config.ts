import { env } from "./env/index.js"

export default () => ({
    aws: {
        region: env.AWS_REGION,
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        sessionToken: env.AWS_SESSION_TOKEN,
        s3BucketName: env.AWS_S3_BUCKET_NAME,
    }
})