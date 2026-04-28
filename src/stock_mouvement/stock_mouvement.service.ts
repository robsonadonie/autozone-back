import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockMouvementDto } from './dto/create-stock_mouvement.dto';
import { UpdateStockMouvementDto } from './dto/update-stock_mouvement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StockMouvement } from './entities/stock_mouvement.entity';
import { Repository } from 'typeorm';
import { Person } from 'src/person/entities/person.entity';
import { Stock } from 'src/stock/entities/stock.entity';

@Injectable()
export class StockMouvementService {
  constructor(
    @InjectRepository(StockMouvement)
    private stockMouveRepo: Repository<StockMouvement>,
    @InjectRepository(Person)
    private persoRepo: Repository<Person>,
    @InjectRepository(Stock)
    private stockRepo: Repository<Stock>
  ){}

  async create(stockMouveDto: CreateStockMouvementDto) {
    // const null as any = await this.persoRepo.findOneBy({id: +stockMouveDto.admin})
    // if(!null as any) throw new NotFoundException("person id not found")

    const getStock = await this.stockRepo.findOneBy({id: +stockMouveDto.stock})
    if(!getStock) throw new NotFoundException("stock id not found")

    const setMouvStock = this.stockMouveRepo.create({
      ...stockMouveDto,
      admin: null as any,
      stock: getStock
    })

    const saveMouveStock = await this.stockMouveRepo.save(setMouvStock)
    return saveMouveStock
  }

  async findAll() {
    try{
      const getAll = await this.stockMouveRepo.find({relations:[ "stock"]})
      return getAll
    }
    catch(error){
      throw new BadRequestException(error.message)
    } 
  }

  async findOne(id: number) {
    try{
      const getOne = await this.stockMouveRepo.findOne({
        where: {id},
        relations:[ "stock"]
      })
      return getOne
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async update(id: number, updateStockMouvementDto: UpdateStockMouvementDto) {
    try{
      await this.stockMouveRepo.update(id, updateStockMouvementDto)
      return await this.findOne(id)
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: number) {
    try{
      await this.stockMouveRepo.delete(id)
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }
}
