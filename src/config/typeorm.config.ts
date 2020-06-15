import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mongodb',
    url: 'mongodb+srv://caiogallo:forthehorde2401@cluster0-evtam.mongodb.net/ecommerce',
    synchronize: true,
    useUnifiedTopology: true,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
};