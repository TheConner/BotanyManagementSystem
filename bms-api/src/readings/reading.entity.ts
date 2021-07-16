import { Cipher } from "crypto";
import { RecordBase } from "src/RecordBase";
import { Sensor } from "src/sensors/sensor.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn, ValueTransformer } from "typeorm";

@Entity()
export class Reading extends RecordBase {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @ManyToOne(type => Sensor)
    sensor: Sensor;

    @Column()
    value: string;
}