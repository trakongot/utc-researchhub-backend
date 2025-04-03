import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'src/common/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.refreshKeySecret,
    });
  }

  async validate(payload: any) {
    console.log('RefreshTokenStrategy: Validating payload:', payload);
    if (!payload || !payload.id) {
      console.log('RefreshTokenStrategy: Invalid payload');
      throw new UnauthorizedException('Invalid refresh token');
    }
    return { id: payload.id };
  }
}
