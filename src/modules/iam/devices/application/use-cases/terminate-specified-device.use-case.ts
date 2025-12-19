import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../infrastructure/devices.repository';
import { Device } from '../../domain/device.entity';
import { Result } from '../../../../../core/helpers/result/result';
import {
  AccessDeniedError,
  ResultNotFoundError,
} from '../../../../../core/helpers/result/result-error';

export class TerminateSpecifiedDeviceCommand {
  constructor(
    public usersId: number,
    public deviceId: number,
  ) {}
}

@CommandHandler(TerminateSpecifiedDeviceCommand)
export class TerminateSpecifiedDevice
  implements ICommandHandler<TerminateSpecifiedDeviceCommand>
{
  constructor(private readonly devicesRepository: DevicesRepository) {}

  async execute({ usersId, deviceId }: TerminateSpecifiedDeviceCommand) {
    const device: Device | null =
      await this.devicesRepository.getDeviceById(deviceId);

    if (!device) return Result.fail(new ResultNotFoundError());

    if (device.userId !== usersId)
      return Result.fail(
        new AccessDeniedError('Can`t terminate another user device'),
      );

    await this.devicesRepository.deleteDeviceById(deviceId);
  }
}
