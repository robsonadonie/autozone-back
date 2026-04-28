import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductFamilyDto } from './dto/create-product-family.dto';
import { UpdateProductFamilyDto } from './dto/update-product-family.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductFamily } from './entities/product-family.entity';
import { Repository } from 'typeorm';
import { Person } from 'src/person/entities/person.entity';
import { Origine } from 'src/origines/entities/origine.entity';
import { ProductLevel } from 'src/product-level/entities/product-level.entity';

@Injectable()
export class ProductFamilyService {
  constructor(
    @InjectRepository(ProductFamily)
    private prodRepo: Repository<ProductFamily>,
    @InjectRepository(Person)
    private persoRepo: Repository<Person>,
    @InjectRepository(Origine)
    private originRepo: Repository<Origine>,
    @InjectRepository(ProductLevel)
    private levelRepo: Repository<ProductLevel>
  ) { }

  async create(familyDto: CreateProductFamilyDto) {
    try {
      // const getPerso = await this.persoRepo.findOneBy({id: +familyDto.admin})
      // if(!getPerso) throw new NotFoundException("person id not found")

      const getLevel = await this.levelRepo.findOneBy({ id: +familyDto.level })
      if (!getLevel) throw new NotFoundException("level id not found")

      const getOrigin = await this.originRepo.findOneBy({ id: +familyDto.origine })
      if (!getOrigin) throw new NotFoundException("origin id not found")

      const getProd = familyDto.parent ? await this.prodRepo.findOne({
        where: { id: +familyDto.parent },
        relations: ["parent", "origine"]
      }) : null

      const setFamilyProd = this.prodRepo.create({
        ...familyDto,
        parent: getProd?.id,
        level: getLevel,
        level_name: getLevel.level,
        origine: getOrigin
      })

      return await this.prodRepo.save(setFamilyProd);
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findLevel(id: number) {
    try {
      const getLevel = await this.prodRepo.find({
        where: { level: { id } },
        relations: ["level", "parent", "parent.parent", "parent.parent.parent", "origine", "child"]
      })
      return getLevel;
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findOrigin(id: number) {
    try {
      const getOrigin = await this.prodRepo.find({
        where: { origine: { id } },
        relations: ["level", "parent", "origine", "stock"]
      })

      return getOrigin;
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: number) {
    try {
      const getOne = await this.prodRepo.find({
        where: { id },
        relations: ["level", "parent", "origine", "child", "stock"]
      })

      return getOne
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: number, updateProductFamilyDto: UpdateProductFamilyDto) {
    try {
      await this.prodRepo.update(id, updateProductFamilyDto)
      return await this.findOne(id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: number) {
    try {
      await this.prodRepo.delete(id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
