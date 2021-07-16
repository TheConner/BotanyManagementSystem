import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'email-validator';
import { Repository } from 'typeorm';
import { AuthenticateUserDto, AuthenticateUserDtoResult } from './dto/authenticate-user.dto';
import { CreateUserDto, CreateUserResultDto } from './dto/create-user.dto';
import { generateHashPassword, verifyPassword } from './password';
import { User } from './users.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) {}

    findByToken(token: string): Promise<User> {
        return this.usersRepository.findOne({
            token: token
        });
    }

    findOne(id: string): Promise<User> {
        return this.usersRepository.findOne(id);
    }

    async create(createUserDto: CreateUserDto): Promise<CreateUserResultDto> {
        // Validate email
        if (!validate(createUserDto.email)) { throw "Invalid email" }

        const user = new User();
        user.email = createUserDto.email;
        user.firstName = createUserDto.firstName;
        user.lastName = createUserDto.lastName;

        // Generate hash and salt
        let pass = await generateHashPassword(createUserDto.password);
        user.password = pass.hash;
        user.salt = pass.salt;
        user.iterations = pass.iterations;

        const resultDto = new CreateUserResultDto()

        // Try to create the user
        try {
            const newUser = await this.usersRepository.save(user);
            resultDto.created = true;
            resultDto.message = "User created";
            return resultDto;
        } catch (e) { // TODO: handle different error types
            if (e.detail.includes("already exists")) {
                resultDto.message = "User already exists";
            } else {
                resultDto.message = "Error during user creation";
            }

            resultDto.created = false;
            return resultDto;
        }
    }

    async authenticate(authUserDto: AuthenticateUserDto): Promise<AuthenticateUserDtoResult> {

        // Try to authenticate this user
        const user = await this.usersRepository.findOne({
            where: { email: authUserDto.email },
            select: ["id", "password", "salt", "iterations"]
        });

        if (user != null) {
            // Otherwise try authenticating them
            const passOK = await verifyPassword({
                hash: user.password,
                salt: user.salt,
                iterations: user.iterations
            }, authUserDto.password);

            const authResult = new AuthenticateUserDtoResult();

            if (passOK) {
                // Generate token and repond
                user.token = await this.tokenGenerator();
                user.tokenExpiry = new Date();
                this.usersRepository.update({
                    "id": user.id
                },
                    user
                );
                authResult.token = user.token;
                authResult.authenticated = true;
            } else {
                authResult.authenticated = false;
                authResult.message = "Failed to authenticate user";
            }
            
            return authResult;
        }

        throw new Error("Bad password or user not found");
    }

    private tokenGenerator(): Promise<string> {
        return new Promise((resolve, reject) => {
            randomBytes(128, function(err, buffer) {
                resolve(buffer.toString('hex'));
              });
        });  
    }
}
