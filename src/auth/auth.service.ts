import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { SessionRepository } from './session.repository';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        @InjectRepository(SessionRepository)
        private sessionRepository: SessionRepository,
        private jwtService: JwtService
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, refreshToken: string }> {
        const username = await this.userRepository.validateUserpassword(authCredentialsDto);

        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);
        const hash = username + Math.random();
        const refreshToken = await this.jwtService.sign({ hash });

        const user = await this.userRepository.findOne({ username });
        const session = await this.sessionRepository.createSession(user._id, refreshToken)
        session.save()

        return { accessToken, refreshToken };
    }

    async refreshToken(refreshToken: string) {
        //console.log("aqui " + refreshToken)
        const session = await this.sessionRepository.findOne({ refreshToken });
        const user = await this.userRepository.findOne({ _id: session.userId });
        const username = user.username;

        if (user) {
            const payload: JwtPayload = { username };
            const accessToken = await this.jwtService.sign(payload);
            const hash = username + Math.random();
            const refreshToken = await this.jwtService.sign({ hash });

            const user = await this.userRepository.findOne({ username });
            const session = await this.sessionRepository.createSession(user._id, refreshToken)
            session.save()

            return { accessToken, refreshToken };
        }

        throw new UnauthorizedException('Invalid Refresh Token');
    }
}
