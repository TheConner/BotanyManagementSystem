import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlantDto } from './dto/create-plant.dto';
import { Plant } from './plant.entity';

@Injectable()
export class PlantsService {
    constructor(
        @InjectRepository(Plant)
        private readonly plantsRepository: Repository<Plant>
    ) {}

    findAll(): Promise<Plant[]> {
        return this.plantsRepository.find();
    }

    findOne(id: number): Promise<Plant> {
        return this.plantsRepository.findOne(id);
    }

    async updateOne(id: number, plant: Plant) {
        // Check if exists
        let dbPlant = await this.findOne(id);

        if (dbPlant != null) {
            Object.assign(dbPlant, plant);
            this.plantsRepository.save(dbPlant);
        } else {
            throw new NotFoundException();
        }
    }

    async create(createPlantDto: CreatePlantDto): Promise<Plant> {
        return this.plantsRepository.save(createPlantDto);
    }

}
