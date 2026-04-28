import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { Person } from 'src/person/entities/person.entity';
import { Vente } from 'src/ventes/entities/vente.entity';
import { PersonService } from 'src/person/person.service';

@Injectable()
export class ClientService {
  constructor(
    
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
    @InjectRepository(Person)
    private persoRepo: Repository<Person>,
    @InjectRepository(Vente)
    private venteRepo: Repository<Vente>,
  ){}

  async create(clientDto: CreateClientDto) {
    // const null as any = await this.persoRepo.findOneBy({id: +clientDto.admin})
    // if(!null as any) throw new NotFoundException("person id not found")

    try{
      // delete clientDto.id
      const setClient = this.clientRepo.create({
        ...clientDto,
        admin: null as any
      })
      const saveClient = await this.clientRepo.save(setClient)
      return [`added`,saveClient];
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async findAll() {
    try {
      const getAllSelle = await this.venteRepo.find({ relations: [ "stock", "client"] })
      const getAll = await this.clientRepo.find({ relations: [ "vente"] })
      let AllClient = [] as any
      getAll.map((clt) => {
        const clientSelle = getAllSelle.filter((item: any) => item.client.id as any == clt.id)
        AllClient.push({ ...clt, clientSelle } as any)
      })

      return AllClient.reverse()
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: number) {
    try{
      const getOne = await this.clientRepo.findOne({
        where: {id},
        relations:[ "vente"]
      })
      return getOne
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    try{
      await this.clientRepo.update(id, updateClientDto)
      return "updated"
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: number) {
    try{
      await this.clientRepo.delete(id)
      return "deleted"
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }
}
