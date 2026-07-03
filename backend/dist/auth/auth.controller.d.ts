import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(email: string, res: Response): Promise<{
        message: string;
    }>;
    getProfile(req: Request): any;
}
