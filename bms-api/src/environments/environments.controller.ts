import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { Environment } from './environment.entity';
import { EnvironmentsService } from './environments.service';

@Controller('environments')
export class EnvironmentsController {
    constructor(private readonly environmentsService: EnvironmentsService) {}

    @Post()
    create(@Body() createEnvironmentDto: CreateEnvironmentDto): Promise<Environment> {
        return this.environmentsService.create(createEnvironmentDto);
    }

    @Get()
    findAll(): Promise<Environment[]> {
        return this.environmentsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Environment> {
        return this.environmentsService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.environmentsService.remove(id);
    }

}
