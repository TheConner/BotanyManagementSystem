import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment } from 'src/environments/environment.entity';
import { Sensor } from './sensor.entity';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, Environment])],
  providers: [SensorsService],
  controllers: [SensorsController]
})
export class SensorsModule {}
