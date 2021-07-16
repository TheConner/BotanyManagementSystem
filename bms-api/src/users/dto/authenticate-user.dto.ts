export class AuthenticateUserDto {
    email: string;
    password: string;
}

export class AuthenticateUserDtoResult {
    authenticated: boolean;
    message: string;
    token: string;
}