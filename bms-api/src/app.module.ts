import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentsController } from './environments/environments.controller';
import { Connection } from 'typeorm';
import { ReadingsController } from './readings/readings.controller';
import { SensorsController } from './sensors/sensors.controller';
import { EnvironmentsService } from './environments/environments.service';
import { EnvironmentsModule } from './environments/environments.module';
import { SensorsModule } from './sensors/sensors.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    EnvironmentsModule,
    SensorsModule
  ]
})
export class AppModule {
  constructor(private connection: Connection) {}
}
