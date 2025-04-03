import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { config } from 'src/common/config';
import { generateApiResponse } from 'src/common/responses';
import { PrismaService } from 'src/config/database';
import { LoginByCodeDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(dto: LoginByCodeDto) {
    const user = await this.validateUser(dto.code, dto.password, dto.userType);
    const roles =
      dto.userType === 'FACULTY'
        ? (user as any)?.FacultyRole.map((r) => r.role)
        : ['STUDENT'];

    const payload = {
      id: user.id,
      code: dto.code,
      userType: dto.userType,
      roles,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: config.privateKeySecret,
      expiresIn: '5m',
    });

    const refreshToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: config.refreshKeySecret,
        expiresIn: '7d',
      },
    );

    await this.updateRefreshToken(user.id, refreshToken, dto.userType);

    return generateApiResponse('Đăng nhập thành công', {
      accessToken,
      refreshToken,
      accessTokenExpiresIn: 300,
      refreshTokenExpiresIn: 604800,
      user: {
        id: user.id,
        code: dto.code,
        userType: dto.userType,
        roles,
      },
    });
  }

  async refreshToken(
    userId: string,
    refreshToken: string,
    userType: 'FACULTY' | 'STUDENT',
  ) {
    const user =
      userType === 'FACULTY'
        ? await this.prisma.faculty.findUnique({
            where: { id: userId, status: 'ACTIVE' },
            select: {
              id: true,
              email: true,
              refreshToken: true,
              FacultyRole: { select: { role: true } },
            },
          })
        : await this.prisma.student.findUnique({
            where: { id: userId },
            select: {
              id: true,
              email: true,
              refreshToken: true,
            },
          });

    if (
      !user?.refreshToken ||
      !(await bcrypt.compare(refreshToken, user.refreshToken))
    ) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    const roles =
      userType === 'FACULTY'
        ? (user as any)?.FacultyRole?.map((r) => r.role)
        : ['STUDENT'];

    const payload = {
      id: user.id,
      email: user.email,
      userType,
      roles,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: config.privateKeySecret,
      expiresIn: '5m',
    });

    const newRefreshToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: config.refreshKeySecret,
        expiresIn: '7d',
      },
    );

    await this.updateRefreshToken(user.id, newRefreshToken, userType);

    return generateApiResponse('Cập nhật refresh token thành công', {
      accessToken,
      refreshToken: newRefreshToken,
    });
  }

  async logout(userId: string, userType: 'FACULTY' | 'STUDENT') {
    if (userType === 'FACULTY') {
      await this.prisma.faculty.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
    } else {
      await this.prisma.student.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
    }
    return generateApiResponse('Đăng xuất thành công', null);
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
    userType: 'FACULTY' | 'STUDENT',
  ) {
    if (userType === 'FACULTY') {
      await this.prisma.faculty.update({
        where: { id: userId },
        data: { refreshToken: await bcrypt.hash(refreshToken, 10) },
      });
    } else {
      await this.prisma.student.update({
        where: { id: userId },
        data: { refreshToken: await bcrypt.hash(refreshToken, 10) },
      });
    }
  }
  async validateUser(
    code: string,
    password: string,
    userType: 'FACULTY' | 'STUDENT',
  ) {
    const user =
      userType === 'FACULTY'
        ? await this.prisma.faculty.findUnique({
            where: { facultyCode: code, status: 'ACTIVE' },
            select: {
              id: true,
              facultyCode: true,
              fullName: true,
              profilePicture: true,
              email: true,
              password: true,
              refreshToken: true,
              FacultyRole: { select: { role: true } },
            },
          })
        : await this.prisma.student.findUnique({
            where: { studentCode: code },
            select: {
              id: true,
              studentCode: true,
              fullName: true,
              profilePicture: true,
              email: true,
              password: true,
              refreshToken: true,
            },
          });

    if (!user) {
      throw new NotFoundException('Tài khoản không tồn tại hoặc đã bị khóa');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }

    return user;
  }
}
