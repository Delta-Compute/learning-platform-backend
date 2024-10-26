import * as admin from "firebase-admin";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

import { ValidationPipe } from "@nestjs/common";

import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from "helmet";

import { setupSwagger } from "./swagger";

async function bootstrap() {
  const configService = new ConfigService();

  const firebaseConfig = {
    projectId: configService.get("FIREBASE_PROJECT_ID"),
    clientEmail: configService.get("FIREBASE_CLIENT_EMAIL"),
    privateKey: configService.get("FIREBASE_PRIVATE_KEY").replace(/\\n/g, '\n'),
    ignoreUndefinedProperties: true,
  } as admin.ServiceAccount;

  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
    storageBucket: `${firebaseConfig.projectId}.appspot.com`,
  });

  const PORT = configService.get('SERVER_PORT') || 4000;

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "http://localhost:5173",
      configService.get("FRONTEND_DOMAIN"),
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  });
  app.setGlobalPrefix("api");
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: 400,
    }),
  );
  app.use(helmet());

  setupSwagger(app);

  await app.listen(PORT);
}

bootstrap();