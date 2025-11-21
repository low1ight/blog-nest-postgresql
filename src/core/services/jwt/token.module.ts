import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { TokenConfig } from './token.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (tokenConfig: TokenConfig) => ({
        secret: tokenConfig.jwtSecret,
      }),
      inject: [TokenConfig],
    }),
  ],
  providers: [TokenConfig, TokenService],
  exports: [TokenService, TokenConfig],
})
export class TokenModule {}
