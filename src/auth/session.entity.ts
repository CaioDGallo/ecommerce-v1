import { BaseEntity, Entity, Column, Unique, ObjectIdColumn } from "typeorm";

@Entity()
@Unique(['refreshToken'])
export class Session extends BaseEntity{
    @ObjectIdColumn()
    _id: string;

    @Column()
    userId: string;

    @Column()
    refreshToken: string;
}