import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { JwtRefreshAuthGuard } from '../../../../core/guards/jwt-refresh-auth.guard';
import { DevicesQueryRepository } from '../infrastructure/devices.query.repository';
import { RtUser } from '../../../../core/decorators/refresh-token-user.param.decorator';
import type { RefreshTokenPayloadModel } from '../../../../core/dto/refresh-token-payload.model';
import { CommandBus } from '@nestjs/cqrs';
import { TerminateAllOtherDevicesCommand } from '../application/use-cases/terminate-all-other-devices.use-case';

@Controller('/security/devices')
export class DevicesController {
  constructor(
    private readonly deviceQueryRepository: DevicesQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(JwtRefreshAuthGuard)
  @Get('/')
  async getUserDevices(@RtUser() user: RefreshTokenPayloadModel) {
    return await this.deviceQueryRepository.getUserDevices(user.id);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Delete('/')
  async terminateAllOtherDevices(@RtUser() user: RefreshTokenPayloadModel) {
    await this.commandBus.execute(
      new TerminateAllOtherDevicesCommand(user.id, user.deviceId),
    );
    return;
  }
}
