import { IsString, IsBoolean } from "class-validator";

export class AuthAccessTokenDto{
    @IsString()
    accessToken: string;

    @IsBoolean()
    success: boolean;
}