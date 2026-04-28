import { Module } from '@nestjs/common';
import { FournisseursService } from './fournisseurs.service';
import { FournisseursController } from './fournisseurs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fournisseur } from './entities/fournisseur.entity';
import { Person } from 'src/person/entities/person.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Fournisseur,
      Person
    ])
  ],
  controllers: [FournisseursController],
  providers: [FournisseursService],
})
export class FournisseursModule {}
