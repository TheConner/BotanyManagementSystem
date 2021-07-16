import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class RecordBase {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;
    @UpdateDateColumn({ name: 'updated_at' }) 'updated_at': Date;
}