import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async mockLogin(email: string) {
    // In a real scenario, we'd hash the incoming password and check against Prisma DB
    if (email !== 'admin@ranique.com') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: 'mock-uuid-123', email, role: 'ADMIN' };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
