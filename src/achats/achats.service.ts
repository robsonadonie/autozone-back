import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAchatDto } from './dto/create-achat.dto';
import { UpdateAchatDto } from './dto/update-achat.dto';
import { PrimaryGeneratedColumn, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Fournisseur } from 'src/fournisseurs/entities/fournisseur.entity';
import { Person } from 'src/person/entities/person.entity';
import { Achat } from './entities/achat.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Vente } from 'src/ventes/entities/vente.entity';

@Injectable()
export class AchatsService {
  constructor(
    @InjectRepository(Achat)
    private achatRepo: Repository<Achat>,
    @InjectRepository(Fournisseur)
    private fournissRepo: Repository<Fournisseur>,
    @InjectRepository(Person)
    private persoRepo: Repository<Person>,
    @InjectRepository(Stock)
    private stockRepo: Repository<Stock>,
    @InjectRepository(Vente)
    private venteRepo: Repository<Vente>,

  ){}

  async create(achatDto: CreateAchatDto) {
    // const getPerso = await this.persoRepo.findOneBy({id: +achatDto.admin})
    // if(!getPerso) throw new NotFoundException("person id not found")

    // const getFourniss = await this.fournissRepo.findOneBy({id: +achatDto.fournisseurs})
    // if(!getFourniss) throw new NotFoundException("fournisseurs id not found")

    const getStock = await this.stockRepo.findOneBy({id: +achatDto.idStock})
    if(!getStock) throw new NotFoundException("stock id not found")

    const newQte = Number(getStock.quantite) + Number(achatDto.quantite)
    await this.stockRepo.update(getStock.id, {quantite: newQte})

    const {idStock, ...restData} = achatDto
    const setAchats = this.achatRepo.create({
      ...restData,
      admin: null as any,
      stock: getStock,
      fournisseur : ""
    })

    await this.achatRepo.save(setAchats)
    if(achatDto.status == "retour pièce"){
      try{
        await this.venteRepo.delete(achatDto.venteId)
      }
      catch(error){
        throw new BadRequestException(error.message)
      }
    }
    return "ok";
  }

  async findAll() {
    try{
      const getAll = await this.achatRepo.find({
        relations:["stock"]
      })
      return getAll.reverse()
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: number) {
    try{
      const getOne = await this.achatRepo.find({
        where: {id},
        relations:["fournisseurs"]
      })
      
      return getOne
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async update(id: number, updateAchatDto: UpdateAchatDto) {
    try{
      await this.achatRepo.update(id, updateAchatDto)
      return await this.findOne(id)
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: number) {
    try{
      await this.achatRepo.delete(id)
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }
}
