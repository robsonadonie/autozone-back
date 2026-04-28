import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJournauxDto } from './dto/create-journaux.dto';
import { UpdateJournauxDto } from './dto/update-journaux.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Journaux } from './entities/journaux.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JournauxService {
  constructor(
    @InjectRepository(Journaux)
    private journRepo: Repository<Journaux>
  ){}

  async create(createJournauxDto: CreateJournauxDto) {
    try{
      const saveJournaux = await this.journRepo.save(createJournauxDto)
      return createJournauxDto.type;
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async findAll() {
    try{
      const getAll = await this.journRepo.find();
      return getAll.reverse();
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: number) {
    try{
      const getOne = await this.journRepo.findOne({
        where: {id},
      });
      return getOne;
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  
  async update(id: number, updateJournauxDto: UpdateJournauxDto) {
    try{
      await this.journRepo.update(id, updateJournauxDto);
      let type = await this.journRepo.findOne({where :{id}});
      return type?.type
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

 async  remove(id: number) {
    try{
      let type = await this.journRepo.findOne({where :{id}});
      await this.journRepo.delete(id)
      return type?.type
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }
}
