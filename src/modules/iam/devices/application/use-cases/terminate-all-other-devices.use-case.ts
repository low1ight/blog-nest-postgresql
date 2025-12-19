import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../infrastructure/devices.repository';

export class TerminateAllOtherDevicesCommand {
  constructor(
    public usersId: number,
    public deviceId: number,
  ) {}
}

@CommandHandler(TerminateAllOtherDevicesCommand)
export class TerminateAllOtherDevices
  implements ICommandHandler<TerminateAllOtherDevicesCommand>
{
  constructor(private readonly devicesRepository: DevicesRepository) {}

  async execute({ usersId, deviceId }: TerminateAllOtherDevicesCommand) {
    await this.devicesRepository.deleteAllOtherDevices(usersId, deviceId);
  }
}
