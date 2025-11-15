import { Controller, Delete } from '@nestjs/common';
import { TestingRepository } from './testing.repository';

@Controller('testing')
export class TestingController {
  constructor(protected readonly testingRepository: TestingRepository) {}
  @Delete('all-data')
  async allData() {
    await this.testingRepository.deleteAllDbData();
    return;
  }
}
