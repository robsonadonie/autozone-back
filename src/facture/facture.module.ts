import { Module } from '@nestjs/common';
import { FactureService } from './facture.service';
import { FactureController } from './facture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facture } from './entities/facture.entity';
import { Person } from 'src/person/entities/person.entity';
import { Client } from 'src/client/entities/client.entity';
import { Vente } from 'src/ventes/entities/vente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Facture,
      Person,
      Client,
      Vente
    ])
  ],
  controllers: [FactureController],
  providers: [FactureService],
})
export class FactureModule {}
