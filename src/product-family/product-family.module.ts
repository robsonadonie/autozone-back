import { Module } from '@nestjs/common';
import { ProductFamilyService } from './product-family.service';
import { ProductFamilyController } from './product-family.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFamily } from './entities/product-family.entity';
import { Origine } from 'src/origines/entities/origine.entity';
import { Person } from 'src/person/entities/person.entity';
import { ProductLevel } from 'src/product-level/entities/product-level.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductFamily,
      Origine,
      ProductLevel,
      Person
    ])
  ],
  controllers: [ProductFamilyController],
  providers: [ProductFamilyService],
})
export class ProductFamilyModule {}
