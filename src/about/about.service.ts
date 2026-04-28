import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { About } from './entities/about.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AboutService {
  constructor(
     @InjectRepository(About)
        private aboutRepo: Repository<About>, 
  ){}
  create(createAboutDto: CreateAboutDto) {
    return 'This action adds a new about';
  }

  async findAll() {
    const about = await this.aboutRepo.find()
    return about[0]
  }

  findOne(id: number) {
    return `This action returns a #${id} about`;
  }

  async update(id: number, updateAboutDto: UpdateAboutDto) {
     try{
      if(id != 404){
        await this.aboutRepo.update(id, updateAboutDto);
        let type = await this.aboutRepo.findOne({where :{id}});
        return "updated"
        
      }else{
        
        const newDt ={
          ...updateAboutDto,
          ville: "",
          logo :""
        }
        
        await this.aboutRepo.save({...newDt});
        return "updated"
        
      }
    }
    catch(error){
          throw new BadRequestException(error.message)
        }
  }

  remove(id: number) {
    return `This action removes a #${id} about`;
  }
}
