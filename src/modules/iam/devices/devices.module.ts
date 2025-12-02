import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './domain/device.entity';
import { DevicesService } from './application/devices.service';
import { DevicesRepository } from './infrastructure/devices.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [DevicesService, DevicesRepository],
  exports: [DevicesService],
})
export class DevicesModule {}
