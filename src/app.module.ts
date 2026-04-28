import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './auth/entities/auth.entity';
import { Person } from './person/entities/person.entity';
import { AuthModule } from './auth/auth.module';
import { PersonModule } from './person/person.module';
import { OriginesModule } from './origines/origines.module';
import { StockModule } from './stock/stock.module';
import { ProductFamilyModule } from './product-family/product-family.module';
import { Origine } from './origines/entities/origine.entity';
import { ProductFamily } from './product-family/entities/product-family.entity';
import { ProductLevelModule } from './product-level/product-level.module';
import { ProductLevel } from './product-level/entities/product-level.entity';
import { Stock } from './stock/entities/stock.entity';
import { StockMouvementModule } from './stock_mouvement/stock_mouvement.module';
import { StockMouvement } from './stock_mouvement/entities/stock_mouvement.entity';
import { ClientModule } from './client/client.module';
import { VentesModule } from './ventes/ventes.module';
import { Client } from './client/entities/client.entity';
import { Vente } from './ventes/entities/vente.entity';
import { FournisseursModule } from './fournisseurs/fournisseurs.module';
import { AchatsModule } from './achats/achats.module';
import { Fournisseur } from './fournisseurs/entities/fournisseur.entity';
import { Achat } from './achats/entities/achat.entity';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/entities/role.entity';
import { FactureModule } from './facture/facture.module';
import { Facture } from './facture/entities/facture.entity';
import { JournauxModule } from './journaux/journaux.module';
import { Journaux } from './journaux/entities/journaux.entity';
import { AboutModule } from './about/about.module';
import { About } from './about/entities/about.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
     
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<"mysql">("DB_TYPE"),
        host: configService.get<string>("DB_HOST"),
        port: configService.get<number>("DB_PORT"),
        username: configService.get<string>("DB_USER"),
        password: configService.get<string>("DB_PASS"),
        database: configService.get<string>("DB_NAME"),
        entities: [
          Auth,
          Person,
          Origine,
          ProductFamily,
          Stock,
          StockMouvement,
          Client,
          Vente,
          Fournisseur,
          Achat,
          Role,
          Facture,
          About,
          Journaux,
          ProductLevel,
        ],
        synchronize: true
      })
    }),
    AboutModule,
    AuthModule,
    PersonModule,
    OriginesModule,
    StockModule,
    ProductFamilyModule,
    StockMouvementModule,
    ClientModule,
    VentesModule,
    FournisseursModule,
    AchatsModule,
    FactureModule,
    JournauxModule,
    ProductLevelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
