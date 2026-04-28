import { Module } from '@nestjs/common';
import { JournauxService } from './journaux.service';
import { JournauxController } from './journaux.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journaux } from './entities/journaux.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Journaux
    ])
  ],
  controllers: [JournauxController],
  providers: [JournauxService],
})
export class JournauxModule {}
