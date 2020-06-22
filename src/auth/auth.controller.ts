import { Controller, Post, Body, ValidationPipe, Res, Req } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthAccessTokenDto } from './dto/auth-accesstoken.dto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialsDto:AuthCredentialsDto): Promise<void>{
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    async signIn(@Res() res: Response, @Body(ValidationPipe) authCredentialsDto:AuthCredentialsDto): Promise<Response<AuthAccessTokenDto>>{
        const tokens = await this.authService.signIn(authCredentialsDto);
        if(tokens.accessToken != null && tokens.accessToken != ""){
            res.append('Set-Cookie', `refresh_token=${tokens.refreshToken};expires=${this.getExpiresText()}; HttpOnly`);
            const authObj: AuthAccessTokenDto = { accessToken: tokens.accessToken, success: true }
            
            return res.json(authObj);
        }else{
            const authObj: AuthAccessTokenDto = { accessToken: "", success: false }
            
            return res.json(authObj);
        }
    }

    @Post('/refreshToken')
    async refreshToken(@Req() req: Request, @Res() res: Response): Promise<Response<AuthAccessTokenDto>>{
        //console.log(req.headers.cookie)
        if(req.headers.cookie != null){
            const newTokens = await this.authService.refreshToken(req.headers.cookie.split("refresh_token=").pop());
            if(newTokens.accessToken != null && newTokens.accessToken != ""){
                res.append('Set-Cookie', `refresh_token=${newTokens.refreshToken};expires=${this.getExpiresText()}; HttpOnly`);
                const authObj: AuthAccessTokenDto = { accessToken: newTokens.accessToken, success: true }
                
                return res.json(authObj);
            }else{
                const authObj: AuthAccessTokenDto = { accessToken: "", success: false }
                
                return res.json(authObj);
            }
        }
        return res.json({ error: "Invalid Refresh Token", success: false });
    }

    getExpiresText(): string{
        const now = new Date();
        const minutes = 15;
        now.setTime(now.getTime() + (minutes * 60 * 1000));
        return now.toUTCString();
    }
}
