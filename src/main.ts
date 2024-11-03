import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as https from 'https';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpsOptions = {
    key: readFileSync('certificates/private.key'), // Chemin vers votre clé privée
    cert: readFileSync('certificates/certificate.crt'), // Chemin vers votre certificat
  };
  https
    .createServer(httpsOptions, app.getHttpAdapter().getInstance())
    .listen(3001, () => {
      console.log('HTTPS Server is running on https://localhost:3001');
    });
  app.enableCors({
    origin: (origin, callback) => {
      console.log(`Received origin: ${origin}`);
      const allowedOrigins = [process.env.FRONT_URL];
      console.log(process.env.FRONT_URL);
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
