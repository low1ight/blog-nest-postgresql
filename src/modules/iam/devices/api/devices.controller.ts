import { DevicesService } from '../application/devices.service';
import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { JwtRefreshAuthGuard } from '../../../../core/guards/jwt-refresh-auth.guard';
import { DevicesQueryRepository } from '../infrastructure/devices.query.repository';
import { RtUser } from '../../../../core/decorators/refresh-token-user.param.decorator';
import type { RefreshTokenPayloadModel } from '../../../../core/dto/refresh-token-payload.model';

@Controller('/security/devices')
export class DevicesController {
  constructor(
    private readonly devicesService: DevicesService,
    private readonly deviceQueryRepository: DevicesQueryRepository,
  ) {}

  @UseGuards(JwtRefreshAuthGuard)
  @Get('/')
  async getUserDevices(@RtUser() user: RefreshTokenPayloadModel) {
    return await this.deviceQueryRepository.getUserDevices(user.id);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Delete('/')
  async terminateAllOtherDevices(@RtUser() user: RefreshTokenPayloadModel) {
    return await this.devicesService.terminateAllOtherDevices(
      user.id,
      user.deviceId,
    );
  }
}
