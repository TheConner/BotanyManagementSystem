import { RecordBase } from "src/RecordBase";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class User extends RecordBase {

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        nullable: false,
        unique: true
    })
    email: string;

    @Column({
        nullable: true,
        select: false
    })
    token: string;

    @Column({
        nullable: true
    })
    tokenExpiry: Date;

    // Make it so that these aren't fetched from the DB
    @Column({select: false})
    password: string;

    @Column({select: false})
    salt: string;

    @Column({select: false})
    iterations: number;

}