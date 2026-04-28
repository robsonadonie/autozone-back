import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFournisseurDto } from './dto/create-fournisseur.dto';
import { UpdateFournisseurDto } from './dto/update-fournisseur.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Fournisseur } from './entities/fournisseur.entity';
import { Repository } from 'typeorm';
import { Achat } from 'src/achats/entities/achat.entity';
import { Person } from 'src/person/entities/person.entity';

@Injectable()
export class FournisseursService {
  constructor(
    @InjectRepository(Fournisseur)
    private fournissRepo: Repository<Fournisseur>,
    @InjectRepository(Person)
    private persoRepo: Repository<Person>
  ){}

  async create(fournissDto: CreateFournisseurDto) {
    // const null as any = await this.persoRepo.findOneBy({id: +fournissDto.admin})
    // if(!null as any) throw new NotFoundException("person id not found")

    const checkData = await this.fournissRepo.createQueryBuilder("fournisseurs")
    .where("fournisseurs.name=:nom", {nom: fournissDto.name.toLocaleLowerCase().trim()})
    .andWhere("fournisseurs.email=:email", {email: fournissDto.email.toLocaleLowerCase().trim()})
    .orWhere("fournisseurs.name=:nom", {nom: fournissDto.name.toLowerCase().trim()})
    .getOne()

    if(checkData) throw new BadRequestException("exists/fournisseurs")

    const setFourniss = this.fournissRepo.create({
      ...fournissDto,
      admin: null as any
    })
    const saveFourniss = await this.fournissRepo.save(setFourniss)
    return saveFourniss;
  }

  async findAll() {
    try{
      const getAll = await this.fournissRepo.find({relations:[ "achats"]})
      return getAll.reverse()
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: number) {
    try{
      const getOne = await this.fournissRepo.findOne({
        where: {id},
        relations:[ "achats"]
      })
      return getOne
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async update(id: number, updateFournisseurDto: UpdateFournisseurDto) {
    try{
      await this.fournissRepo.update(id, updateFournisseurDto)
      return await this.findOne(id)
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: number) {
    try{
      await this.fournissRepo.delete(id)
      return await this.findOne(id)
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }
}
