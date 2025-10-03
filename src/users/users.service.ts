import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}
    async createUser(createUserDto: CreateUserDto): Promise<{message: string}> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword});
        await this.usersRepository.save(user);
        return { message: 'User created successfully' };
    }
    async findAll(): Promise<{message: string, users: User[]}> {
        const users = await this.usersRepository.find();
        return { message: 'Users retrieved successfully', users };
    }
    async findOne(id: number): Promise<{message: string, user: User | null}> {
        const user = await this.usersRepository.findOneBy({ id });
        return { message: 'User retrieved successfully', user };
    }
    async findByEmail(email: string): Promise<{message: string, user: User | null}> {
        const user = await this.usersRepository.findOneBy({ email });
        return { message: 'User retrieved successfully', user };
    }
    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<{message: string}> {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        await this.usersRepository.update(id, updateUserDto);
        return { message: 'User updated successfully' };
    }
    async deleteUser(id: number): Promise<{message: string, user: User | null}> {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            return { message: 'User not found', user: null };
        }
        await this.usersRepository.remove(user);
        return { message: 'User deleted successfully', user };
    }

}
