import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Environment } from './environment.entity';
import { CreateEnvironmentDto } from './dto/create-environment.dto';

@Injectable()
export class EnvironmentsService {
    constructor(
        @InjectRepository(Environment)
        private readonly environmentsRepository: Repository<Environment>
    ) {}

    create(createEnvironmentDto: CreateEnvironmentDto): Promise<Environment> {
        const env = new Environment();
        env.name = createEnvironmentDto.name;
        env.description = createEnvironmentDto.description;

        return this.environmentsRepository.save(env);
    }

    async findAll(): Promise<Environment[]> {
        return this.environmentsRepository.find();
    }

    findOne(id: string): Promise<Environment> {
        return this.environmentsRepository.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.environmentsRepository.delete(id);
    }
}
