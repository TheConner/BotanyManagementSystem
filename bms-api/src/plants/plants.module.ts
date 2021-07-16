import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from './plant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plant])],
  providers: [PlantsService],
  controllers: [PlantsController]
})
export class PlantsModule {}
