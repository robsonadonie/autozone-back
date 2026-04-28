import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Person } from 'src/person/entities/person.entity';
import { ProductFamily } from 'src/product-family/entities/product-family.entity';
import { Origine } from 'src/origines/entities/origine.entity';
import { ProductLevel } from 'src/product-level/entities/product-level.entity';
import { ProductFamilyService } from 'src/product-family/product-family.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Stock,
      Person,
      Origine,
      ProductLevel,
      ProductFamily
    ])
  ],
  controllers: [StockController],
  providers: [StockService,ProductFamilyService],
})
export class StockModule {}
