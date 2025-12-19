import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DeviceViewModel } from '../api/view-dto/device.view.model';

@Injectable()
export class DevicesQueryRepository {
  constructor(private readonly dataSource: DataSource) {}
  async getUserDevices(userId: number): Promise<DeviceViewModel[]> {
    const devices: {
      id: number;
      lastActiveDate: Date;
      title: string;
      ip: string;
    }[] = await this.dataSource.query(
      `
    SELECT "id","lastActiveDate","title","ip" 
    FROM devices 
    WHERE "userId" = $1
    `,
      [userId],
    );
    return devices.map(
      ({ id, lastActiveDate, title, ip }) =>
        new DeviceViewModel(id, ip, title, lastActiveDate),
    );
  }
}
