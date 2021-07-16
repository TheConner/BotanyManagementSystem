export class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export class CreateUserResultDto {
    created: boolean;
    message: string;
}