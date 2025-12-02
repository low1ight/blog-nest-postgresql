import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateDeviceDto } from '../dto/create-device.dto';

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
    return await this.dataSource.query(
      `
     INSERT INTO public.devices(ip, title, "sessionId", "lastActiveDate", "userId") 
     VALUES($1, $2, $3, $4, $5)
     RETURNING id,"sessionId"
    
    
    `,
      [ip, title, sessionId, lastActiveDate, userId],
    );
  }
}
