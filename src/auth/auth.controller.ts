import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Body } from '@nestjs/common';
import { registerDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() registerDto: registerDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto) {
        return this.authService.login(loginDto);
    }
}
