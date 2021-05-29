import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { Sensor } from './sensor.entity';
import { SensorsService } from './sensors.service';

@Controller('sensors')
export class SensorsController {
    constructor(private readonly sensorsService: SensorsService) {}

    @Post()
    create(@Body() createSensorDto: CreateSensorDto): Promise<Sensor> {
        return this.sensorsService.create(createSensorDto);
    }

    @Get()
    findAll(): Promise<Sensor[]> {
        return this.sensorsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Sensor> {
        return this.sensorsService.findOne(id);
    }

}
