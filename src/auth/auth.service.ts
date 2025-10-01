import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { registerDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    ) {}

    async register(registerDto: registerDto): Promise<{message: string}> {
        const { name, email, password, role } = registerDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({ name, email, password: hashedPassword, role });
        await this.usersRepository.save(user);
        return { message: 'User registered successfully' };
    }


    async login(loginDto: loginDto): Promise<{ accessToken: string,meessage:string }> {
        const { email, password } = loginDto;
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            accessToken: this.jwtService.sign(payload),
            meessage:'Login successful'
        };
    }
}
