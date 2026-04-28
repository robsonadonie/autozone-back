import { Module } from '@nestjs/common';
import { AchatsService } from './achats.service';
import { AchatsController } from './achats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achat } from './entities/achat.entity';
import { Fournisseur } from 'src/fournisseurs/entities/fournisseur.entity';
import { Person } from 'src/person/entities/person.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Vente } from 'src/ventes/entities/vente.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Achat,
      Fournisseur,
      Person,
      Stock,
      Vente
    ])
  ],
  controllers: [AchatsController],
  providers: [AchatsService],
})
export class AchatsModule {}
