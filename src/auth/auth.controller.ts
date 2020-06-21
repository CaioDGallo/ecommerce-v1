import { Controller, Post, Body, ValidationPipe, Res, Req } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
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
    async signIn(@Res() res: Response, @Body(ValidationPipe) authCredentialsDto:AuthCredentialsDto): Promise<Response<{ accessToken: string }>>{
        const tokens = await this.authService.signIn(authCredentialsDto);
        res.append('Set-Cookie', `refresh_token=${tokens.refreshToken};expires=${this.getExpiresText()}; HttpOnly`);
        
        return res.json({ accessToken: tokens.accessToken });
    }

    @Post('/refreshToken')
    async refreshToken(@Req() req: Request, @Res() res: Response): Promise<Response<{ accessToken: string }>>{
        //console.log(req.headers.cookie)
        if(req.headers.cookie != null){
            const newTokens = await this.authService.refreshToken(req.headers.cookie.split("refresh_token=").pop());
            res.append('Set-Cookie', `refresh_token=${newTokens.refreshToken};expires=${this.getExpiresText()}; HttpOnly`);
            
            return res.json({ accessToken: newTokens.accessToken });
        }
        return res.json({ error: "Invalid Refresh Token" });
    }

    getExpiresText(): string{
        const now = new Date();
        const minutes = 15;
        now.setTime(now.getTime() + (minutes * 60 * 1000));
        return now.toUTCString();
    }
}
