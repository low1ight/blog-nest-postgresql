import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './domain/device.entity';
import { DevicesService } from './application/devices.service';
import { DevicesRepository } from './infrastructure/devices.repository';
import { DevicesController } from './api/devices.controller';
import { DevicesQueryRepository } from './infrastructure/devices.query.repository';
import { TerminateAllOtherDevices } from './application/use-cases/terminate-all-other-devices.use-case';
import { TerminateSpecifiedDevice } from './application/use-cases/terminate-specified-device.use-case';

@Module({
  controllers: [DevicesController],
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [
    DevicesService,
    DevicesRepository,
    DevicesQueryRepository,
    TerminateAllOtherDevices,
    TerminateSpecifiedDevice,
  ],
  exports: [DevicesService, DevicesRepository],
})
export class DevicesModule {}
