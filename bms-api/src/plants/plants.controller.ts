import { BadRequestException, Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePlantDto } from './dto/create-plant.dto';
import { Plant } from './plant.entity';
import { PlantsService } from './plants.service';

@Controller('plants')
export class PlantsController {
    constructor(private readonly plantsService: PlantsService){}

    @Get()
    findAll(): Promise<Plant[]> {
        return this.plantsService.findAll();
    }
    
    @Get('/:id')
    findOne(@Param('id') id: number): Promise<Plant> {
        return this.plantsService.findOne(id);
    }

    @Patch('/:id')
    update(@Param('id') id: number, @Body() plant: Plant) {
        // Update an existing plant
        if (id == null)
            throw new BadRequestException();
        
        // Cannot update the id of the plant
        if (plant.id != null)
            delete plant.id;

        this.plantsService.updateOne(id, plant);
    }
    
    @Post()
    create(@Body() createPlantDto: CreatePlantDto): Promise<Plant> {
        return this.plantsService.create(createPlantDto);
    }
}
