import { Module } from '@nestjs/common';
import { StockMouvementService } from './stock_mouvement.service';
import { StockMouvementController } from './stock_mouvement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMouvement } from './entities/stock_mouvement.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Person } from 'src/person/entities/person.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockMouvement,
      Stock,
      Person
    ])
  ],
  controllers: [StockMouvementController],
  providers: [StockMouvementService],
})
export class StockMouvementModule {}
