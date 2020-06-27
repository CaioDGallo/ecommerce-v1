import { IsString, IsBoolean } from "class-validator";

export class AuthAccessTokenDto{
    @IsString()
    accessToken: string;

    @IsString()
    username: string;

    @IsString()
    _id: string;

    @IsBoolean()
    success: boolean;
}