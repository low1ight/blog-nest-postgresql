import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtRefreshAuthGuard } from '../../../../core/guards/jwt-refresh-auth.guard';
import { DevicesQueryRepository } from '../infrastructure/devices.query.repository';
import { RtUser } from '../../../../core/decorators/refresh-token-user.param.decorator';
import type { RefreshTokenPayloadModel } from '../../../../core/dto/auth/refresh-token-payload.model';
import { CommandBus } from '@nestjs/cqrs';
import { TerminateAllOtherDevicesCommand } from '../application/use-cases/terminate-all-other-devices.use-case';
import { TerminateSpecifiedDeviceCommand } from '../application/use-cases/terminate-specified-device.use-case';
import { ResultType } from '../../../../core/helpers/result/result';
import { ResultErrUnion } from '../../../../core/helpers/result/result-error';
import { throwExceptionFromCustomErr } from '../../../../core/exception/throw-exception-from-custom-err';

@Controller('/security/devices')
export class DevicesController {
  constructor(
    private readonly deviceQueryRepository: DevicesQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(JwtRefreshAuthGuard)
  @Get()
  async getUserDevices(@RtUser() user: RefreshTokenPayloadModel) {
    return await this.deviceQueryRepository.getUserDevices(user.id);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Delete()
  async terminateAllOtherDevices(@RtUser() user: RefreshTokenPayloadModel) {
    await this.commandBus.execute(
      new TerminateAllOtherDevicesCommand(user.id, user.deviceId),
    );
    return;
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Delete(':id')
  async terminateDevice(
    @RtUser() user: RefreshTokenPayloadModel,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result: ResultType<null, ResultErrUnion> =
      await this.commandBus.execute(
        new TerminateSpecifiedDeviceCommand(user.id, id),
      );

    if (!result.isSuccessful) throwExceptionFromCustomErr(result.error);

    return;
  }
}
