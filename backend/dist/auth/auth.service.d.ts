import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    mockLogin(email: string): Promise<{
        access_token: string;
    }>;
}
