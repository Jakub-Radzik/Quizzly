import { Module } from '@nestjs/common';
import { S3Controller } from './s3.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [S3Controller],
  providers: [],
})
export class AppModule {}
