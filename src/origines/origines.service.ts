import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrigineDto } from './dto/create-origine.dto';
import { UpdateOrigineDto } from './dto/update-origine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Origine } from './entities/origine.entity';
import { Repository } from 'typeorm';
import { Person } from 'src/person/entities/person.entity';

@Injectable()
export class OriginesService {
  constructor(
    @InjectRepository(Origine)
    private originRepo: Repository<Origine>,
    @InjectRepository(Person)
    private persoRepo: Repository<Person>
  ){}

  async create(originDto: CreateOrigineDto) {
    // const null as any = await this.persoRepo.findOneBy({id: +originDto.admin})
    // if(!null as any) throw new NotFoundException("person id not found")

    const setOrigine = this.originRepo.create({
      ...originDto,
      admin: null as any
    })

    return await this.originRepo.save(setOrigine);
  }

  async findAll(id: number) {
    try{
      const getAll = await this.originRepo.find({
        
        relations: ["family", "family.level"]
      })
      return getAll
    }
    catch(error){
      throw new BadRequestException(error)
    }
  }

  async findOne(id: number) {
    try{
      const getOne = await this.originRepo.findOne({
        where: {id},
        relations: [ "family"]
      })
      return getOne
    }
    catch(error){
      throw new BadRequestException(error)
    }
  }

  async update(id: number, updateOrigineDto: UpdateOrigineDto) {
    // const null as any = await this.originRepo.findOneBy({id})
    // if(!null as any) throw new NotFoundException("person id not found")
    await this.originRepo.update(id, updateOrigineDto)
    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.originRepo.delete(id);
  }
}
