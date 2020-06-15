import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mongodb',
    url: process.env.MONGOURL,
    synchronize: true,
    useUnifiedTopology: true,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
};