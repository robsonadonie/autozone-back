import { Module } from '@nestjs/common';
import { OriginesService } from './origines.service';
import { OriginesController } from './origines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Origine } from './entities/origine.entity';
import { Person } from 'src/person/entities/person.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Origine,
      Person
    ])
  ],
  controllers: [OriginesController],
  providers: [OriginesService],
})
export class OriginesModule {}
