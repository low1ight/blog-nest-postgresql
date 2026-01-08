import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CoreConfig } from './core/config/core.config';
import { appSetup } from './setup/app.setup';

async function bootstrap() {
  //create app context
  const appContext = await NestFactory.createApplicationContext(AppModule);
  //get core config from context
  const coreConfig = appContext.get<CoreConfig>(CoreConfig);

  //create DynamicAppModule and create app with it
  const DynamicAppModule = AppModule.forRoot(coreConfig);
  const app = await NestFactory.create(DynamicAppModule);

  appSetup(app);

  await app.listen(coreConfig.port);
}
bootstrap();
