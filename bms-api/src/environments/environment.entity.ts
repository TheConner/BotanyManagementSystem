import { Sensor } from "src/sensors/sensor.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Environment {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(type => Sensor, sensor => sensor.environment)
    sensors: Sensor[];
}