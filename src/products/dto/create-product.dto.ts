import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto{
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;
}