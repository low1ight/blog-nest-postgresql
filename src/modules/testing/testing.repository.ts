import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TestingRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async deleteAllDbData() {
    await this.dataSource.query(`DELETE FROM users`);
  }
}
