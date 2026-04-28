import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductLevelDto } from './dto/create-product-level.dto';
import { UpdateProductLevelDto } from './dto/update-product-level.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductLevel } from './entities/product-level.entity';
import { Repository } from 'typeorm';
import { Person } from 'src/person/entities/person.entity';

@Injectable()
export class ProductLevelService {
  constructor(
    @InjectRepository(ProductLevel)
    private prodLevelRepo: Repository<ProductLevel>,
    @InjectRepository(Person)
    private persoRepo: Repository<Person>
  ){}

  async create(prodLevelDto: CreateProductLevelDto) {
    // const null as any = await this.persoRepo.findOneBy({id: +prodLevelDto.admin})
    // if(!null as any) throw new NotFoundException("person id not found")

    const getProd = await this.prodLevelRepo.createQueryBuilder("product_level")
    .where("product_level.level=:level", {level: prodLevelDto.level.toLowerCase().trim()})
    .andWhere("product_level.admin=:admin", {admin: +prodLevelDto.admin})
    .getOne()
    if(getProd) throw new BadRequestException("level already exists")
      
      const setProd = this.prodLevelRepo.create({
        ...prodLevelDto,
      admin: null as any
    })

    return await this.prodLevelRepo.save(setProd);
  }
  
  async onModuleInit() {
    setTimeout( async() => {
      const getOne = await this.prodLevelRepo.find({
        relations: [ "family"]
      })
      if(getOne.length == 0 || getOne.length < 4){
        let data = [{id:1,level:"marque",admin:null},{id:2,level:"modele",admin:null},{id:4,level:"serie",admin:null},{id:5,level:"marque_produit",admin:null}]
  
        data.map(async (item : any)=>{
           await this.prodLevelRepo.save(item);
  
        })
        return "created"
      }
      
    }, 1000);
    
  }
  

  async findFamilyLevel(id: number) {
    try{
      const getAll = await this.prodLevelRepo.find({
        where: {id},
        relations: [ "family", "family.parent"]
      })
      return getAll
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async findAll(id: number) {
    try{
      const getOne = await this.prodLevelRepo.find({
        relations: ["family"],
        order : {id : "ASC"}
      })
      return getOne
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: number) {
    try{
      const getOne = await this.prodLevelRepo.find({
        where: {id},
        relations: [ "family"]
      })
      return getOne
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async update(id: number, updateProductLevelDto: UpdateProductLevelDto) {
    try{
      await this.prodLevelRepo.update(id, updateProductLevelDto)
      return await this.findOne(id)
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: number) {
    try{
      await this.prodLevelRepo.delete(id)
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }
}
