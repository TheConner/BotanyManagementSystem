import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('BMS API Server starting...');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  await app.listen(3000);
  console.log(`--- ██████╗ ███╗   ███╗███████╗ ---`);
  console.log(`--- ██╔══██╗████╗ ████║██╔════╝ ---`);
  console.log(`--- ██████╔╝██╔████╔██║███████╗ ---`);
  console.log(`--- ██╔══██╗██║╚██╔╝██║╚════██║ ---`);
  console.log(`--- ██████╔╝██║ ╚═╝ ██║███████║ ---`);
  console.log(`--- ╚═════╝ ╚═╝     ╚═╝╚══════╝ ---`);
  
  
  console.log(`Running on ${await app.getUrl()}`);
}
bootstrap();
