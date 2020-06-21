import { Repository, EntityRepository } from "typeorm";
import { Session } from "./session.entity";
import { Logger, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Session)
export class SessionRepository extends Repository<Session>{
    private logger = new Logger('SessionRepository');

    async createSession(userId: string, refreshToken: string): Promise<Session> {
        const session = new Session();
        session.userId = userId;
        session.refreshToken = refreshToken;

        try{
            await session.save();
        }catch(error){
            this.logger.error(`Failed to create session. Data: ${userId}`, error.stack);
            throw new InternalServerErrorException();
        }

        return session;
    }
}