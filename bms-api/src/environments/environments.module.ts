import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment } from './environment.entity';
import { EnvironmentsController } from './environments.controller';
import { EnvironmentsService } from './environments.service';

@Module({
    imports: [TypeOrmModule.forFeature([Environment])],
    providers: [EnvironmentsService],
    controllers: [EnvironmentsController]
})
export class EnvironmentsModule {}