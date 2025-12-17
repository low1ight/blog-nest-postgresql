import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateDeviceDto } from '../dto/create-device.dto';
import { Device } from '../domain/device.entity';

@Injectable()
export class DevicesRepository {
  constructor(private readonly dataSource: DataSource) {}

  async createDevice({
    ip,
    title,
    sessionId,
    lastActiveDate,
    userId,
  }: CreateDeviceDto): Promise<{ id: number; sessionId: string }> {
    const result: { id: number; sessionId: string }[] =
      await this.dataSource.query(
        `
     INSERT INTO public.devices(ip, title, "sessionId", "lastActiveDate", "userId") 
     VALUES($1, $2, $3, $4, $5)
     RETURNING id,"sessionId"
    
    
    `,
        [ip, title, sessionId, lastActiveDate, userId],
      );

    return result[0];
  }

  async getDeviceById(id: number): Promise<Device | null> {
    const device: Device[] = await this.dataSource.query(
      `
    SELECT * FROM public.devices WHERE id = $1`,
      [id],
    );
    return device[0] || null;
  }

  async deleteDeviceById(id: number): Promise<void> {
    await this.dataSource.query(
      `
    DELETE FROM public.devices WHERE id = $1`,
      [id],
    );
  }
}
