import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './domain/device.entity';
import { DevicesService } from './application/devices.service';
import { DevicesRepository } from './infrastructure/devices.repository';
import { DevicesController } from './api/devices.controller';
import { DevicesQueryRepository } from './infrastructure/devices.query.repository';

@Module({
  controllers: [DevicesController],
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [DevicesService, DevicesRepository, DevicesQueryRepository],
  exports: [DevicesService],
})
export class DevicesModule {}
