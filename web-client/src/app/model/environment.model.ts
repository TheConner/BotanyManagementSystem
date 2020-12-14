import { Sensor } from './sensor.model';

export class Environment {
    public id: Number;
    public name: String;
    public description: String;
    public sensors: Sensor[];
}