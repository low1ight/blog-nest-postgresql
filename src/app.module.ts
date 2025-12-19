import { configModule } from './config.module';
import { CoreModule } from './core/core.module';
import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/iam/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreConfig } from './core/config/core.config';
import { TestingModule } from './modules/testing/testing.module';
import { UsersModule } from './modules/iam/users/users.module';
import { DevicesModule } from './modules/iam/devices/devices.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CoreModule, configModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static forRoot(coreConfig: CoreConfig): DynamicModule {
    const modules: any[] = [
      CqrsModule.forRoot(),
      AuthModule,
      UsersModule,
      DevicesModule,
      TypeOrmModule.forRootAsync({
        imports: [CoreModule],
        useFactory: (coreConfig: CoreConfig) => ({
          type: 'postgres',
          host: coreConfig.pgHost,
          port: coreConfig.pgPort,
          username: coreConfig.pgUserName,
          password: coreConfig.pgPassword,
          database: 'blog',
          synchronize: true,
          autoLoadEntities: true,
        }),
        inject: [CoreConfig],
      }),
    ];

    if (coreConfig.includeTestModule) {
      modules.push(TestingModule);
    }

    return { module: AppModule, imports: modules };
  }
}
