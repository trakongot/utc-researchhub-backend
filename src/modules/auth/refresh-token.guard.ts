import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('refresh-token') {
  canActivate(context: ExecutionContext) {
    console.log('RefreshTokenGuard: Checking request...');
    return super.canActivate(context);
  }
}
