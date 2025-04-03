import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { LoginByCodeDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RefreshTokenGuard } from './refresh-token.guard';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('/generate-password/:password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'generate password' })
  generatePassword(@Param('password') password: string) {
    return bcrypt.hash(password, 10);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Universal login for students and faculty' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful and returns a token',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid login credentials',
  })
  login(
    @Body(new ZodValidationPipe(LoginByCodeDto.schema)) dto: LoginByCodeDto,
  ) {
    return this.authService.login(dto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  refreshToken(@Req() req) {
    console.log(req.user);
    const { id, refreshToken, userType } = req.user;
    return this.authService.refreshToken(id, refreshToken, userType);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout the user' })
  logout(@Req() req) {
    const { id, userType } = req.user;
    return this.authService.logout(id, userType);
  }
}
