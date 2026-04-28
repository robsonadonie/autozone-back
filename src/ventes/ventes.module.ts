import { Module } from '@nestjs/common';
import { VentesService } from './ventes.service';
import { VentesController } from './ventes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vente } from './entities/vente.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Client } from 'src/client/entities/client.entity';
import { Person } from 'src/person/entities/person.entity';
import { StockService } from 'src/stock/stock.service';
import { ProductFamily } from 'src/product-family/entities/product-family.entity';
import { ClientService } from 'src/client/client.service';
import { Facture } from 'src/facture/entities/facture.entity';
import { Origine } from 'src/origines/entities/origine.entity';
import { ProductLevel } from 'src/product-level/entities/product-level.entity';
import { ProductFamilyService } from 'src/product-family/product-family.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vente,
      Stock,
      Client,
      Person,
      Origine,
      Facture,
      ProductLevel,
      ProductFamily
    ])
  ],
  controllers: [VentesController],
  providers: [VentesService, StockService, ClientService, ProductFamilyService],
})
export class VentesModule {}
