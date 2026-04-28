import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Person } from './entities/person.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Auth,
      Person
    ])
  ],
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}
