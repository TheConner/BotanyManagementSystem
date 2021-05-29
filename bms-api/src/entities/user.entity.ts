import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    email: string; 

    @Column({unique: true})
    username: string; 

    @Column()
    token: string; 

    @Column()
    passwordHash: string;

    @Column()
    passwordSalt: string;

}