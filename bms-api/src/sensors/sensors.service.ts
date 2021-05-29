import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from './sensor.entity';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { Environment } from 'src/environments/environment.entity';
import { EnvironmentsService } from 'src/environments/environments.service';

@Injectable()
export class SensorsService {
    constructor(
        @InjectRepository(Sensor)
        private readonly sensorsRepository: Repository<Sensor>,
        @InjectRepository(Environment)
        private readonly environmentsRepository: Repository<Environment>
    ) {}

    async findAll(): Promise<Sensor[]> {
        return this.sensorsRepository.find();
    }

    findOne(id: string): Promise<Sensor> {
        return this.sensorsRepository.findOne(id);
    }

    async create(createSensorDto: CreateSensorDto): Promise<Sensor> {
        const sens = new Sensor();
        sens.name = createSensorDto.name;
        sens.description = createSensorDto.description;
        sens.environment = await this.environmentsRepository.findOne(createSensorDto.environment);
        sens.uiColor = createSensorDto.uiColor;

        return await this.sensorsRepository.save(sens);
    }
}
