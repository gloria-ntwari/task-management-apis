import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('createUser')
    @Roles('admin')
    async createUser(@Body() createUserDto) {
        const user =await this.usersService.createUser(createUserDto);
        return {message: 'User created successfully',user}   
    }

    @Get('getAllUsers')
    @Roles('admin')
    async findAll() {
        const Users = await this.usersService.findAll();
        return { message: 'Users retrieved successfully', Users }
    }

    @Get('getOneUser/:id')
    @Roles('admin')
    async findOne(@Param() id: number) {
        const user = await this.usersService.findOne(id);
        return { message: 'User retrieved successfully', user }
    }

    @Put('updateUser/:id')
    @Roles('admin')
    async updateUser(@Param() id: number, @Body() updateUserDto) {
        const user = await this.usersService.updateUser(id, updateUserDto);
        return { message: 'User updated successfully', user }
    }

    @Delete('removeUser/:id')
    @Roles('admin')
    async deleteUser(@Param() id: number) {
        const user = await this.usersService.deleteUser(id);
        return { message: 'User deleted successfully', user }
    }





}
