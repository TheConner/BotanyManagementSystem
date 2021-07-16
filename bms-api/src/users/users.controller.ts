import { Body, Controller, UnauthorizedException, Post, Headers, Get } from '@nestjs/common';
import { AuthenticateUserDto, AuthenticateUserDtoResult } from './dto/authenticate-user.dto';
import { CreateUserDto, CreateUserResultDto } from './dto/create-user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async get(@Headers() headers): Promise<User> {
        if (headers['token'] == null) throw new UnauthorizedException();

        // Get the user by their token
        const user = await this.usersService.findByToken(headers['token']);
        if (user == null) {
            throw new UnauthorizedException();
        } else {
            return user;
        }
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<CreateUserResultDto> {
        return this.usersService.create(createUserDto);
    }

    @Post('authenticate')
    async authenticate(@Body() authUserDto: AuthenticateUserDto): Promise<AuthenticateUserDtoResult> {
        const result = await this.usersService.authenticate(authUserDto);
        if (result.authenticated === true) {
            return result;
        } else {
            throw new UnauthorizedException();
        }
    }
}
