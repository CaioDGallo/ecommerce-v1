import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
})
export class AppModule {}
