import { Environment } from "src/environments/environment.entity";

export class CreateSensorDto {
    name: string;
    description: string;
    uiColor: string; 
    environment: number;
}