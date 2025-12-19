import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from '../dto/create-device.dto';
import { randomUUID } from 'crypto';
import { DevicesRepository } from '../infrastructure/devices.repository';

@Injectable()
export class DevicesService {
  constructor(private readonly deviceRepository: DevicesRepository) {}

  async createDevice(ip: string, userAgent: string, userId: number) {
    const dto: CreateDeviceDto = {
      ip,
      title: userAgent,
      sessionId: randomUUID(),
      lastActiveDate: new Date().toISOString(),
      userId,
    };

    return await this.deviceRepository.createDevice(dto);
  }

  async updateDevice(
    deviceId: number,
    sessionId: string,
    lastActiveDate: string,
  ) {
    await this.deviceRepository.updateDevice(
      deviceId,
      sessionId,
      lastActiveDate,
    );
  }

  async terminateAllOtherDevices(userId: number, deviceId: number) {
    return await this.deviceRepository.deleteAllOtherDevices(userId, deviceId);
  }

  async getDeviceById(deviceId: number) {
    return this.deviceRepository.getDeviceById(deviceId);
  }

  async deleteDeviceById(deviceId: number) {
    return this.deviceRepository.deleteDeviceById(deviceId);
  }
}
