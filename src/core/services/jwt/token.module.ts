import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Module({
  imports: [
    JwtModule.register({
      secret: '1111',
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
