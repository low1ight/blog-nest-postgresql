import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../../devices/infrastructure/devices.repository';

export class LogoutCommand {
  constructor(public deviceId: number) {}
}

@CommandHandler(LogoutCommand)
export class Logout implements ICommandHandler<LogoutCommand> {
  constructor(private readonly devicesRepository: DevicesRepository) {}

  async execute({ deviceId }: LogoutCommand) {
    await this.devicesRepository.deleteDeviceById(deviceId);
  }
}
