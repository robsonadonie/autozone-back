import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from "path"


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(path.join(__dirname,'..','public'))
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('stock gestion project')
    .setDescription('prestatair de services')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('gestion stock')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3100);
}
bootstrap();
