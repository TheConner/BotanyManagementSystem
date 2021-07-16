import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentsController } from './environments/environments.controller';
import { Connection } from 'typeorm';
import { ReadingsController } from './readings/readings.controller';
import { SensorsController } from './sensors/sensors.controller';
import { EnvironmentsService } from './environments/environments.service';
import { EnvironmentsModule } from './environments/environments.module';
import { SensorsModule } from './sensors/sensors.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { PlantsModule } from './plants/plants.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    EnvironmentsModule,
    SensorsModule,
    UsersModule,
    PlantsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
  constructor(private connection: Connection) {}
}
