import { BaseEntity, Entity, Column, ObjectIdColumn } from "typeorm";
import { ProductStatus } from "./product-status.enum";

@Entity()
export class Product extends BaseEntity{
    
    @ObjectIdColumn()
    _id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: ProductStatus;

    @Column()
    price: number;

    @Column()
    imagePath: string;
}