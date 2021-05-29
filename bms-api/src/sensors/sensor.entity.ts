import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Environment } from "../environments/environment.entity";
import { Reading } from "../readings/reading.entity";

@Entity()
export class Sensor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string; 

    @Column()
    description: string; 

    @Column()
    uiColor: string;

    @ManyToOne(type => Environment)
    environment: Environment;

    @OneToMany(type => Reading, reading => reading.sensor)
    readings
}