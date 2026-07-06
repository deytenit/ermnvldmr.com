import { defineCli, env, s3SyncCommand } from '@ermnvldmr/cli';

export default defineCli({
  commands: [
    s3SyncCommand({
      name: 'sync:static',
      description: 'Sync static assets to S3',
      targetPrefix: 'www',
      bucket: env('COM_ERMNVLDMR_STATIC_S3_BUCKET'),
      region: env('COM_ERMNVLDMR_STATIC_S3_REGION'),
      endpoint: env('COM_ERMNVLDMR_STATIC_S3_ENDPOINT_URL'),
      accessKeyId: env('COM_ERMNVLDMR_STATIC_AWS_ACCESS_KEY_ID'),
      secretAccessKey: env('COM_ERMNVLDMR_STATIC_AWS_SECRET_ACCESS_KEY'),
      hooks: {
        beforeSync: 'bash ../../ci/scripts/optimize-images.sh',
      },
    }),
  ],
});
