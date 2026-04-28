import { Module } from '@nestjs/common';
import { ProductLevelService } from './product-level.service';
import { ProductLevelController } from './product-level.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductLevel } from './entities/product-level.entity';
import { Person } from 'src/person/entities/person.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductLevel,
      Person
    ])
  ],
  controllers: [ProductLevelController],
  providers: [ProductLevelService],
})
export class ProductLevelModule {}
