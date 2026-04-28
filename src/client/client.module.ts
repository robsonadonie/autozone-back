import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Person } from 'src/person/entities/person.entity';
import { Vente } from 'src/ventes/entities/vente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Client,
      Person,Vente
    ])
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
