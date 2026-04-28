import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { Auth } from 'src/auth/entities/auth.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private persoRepo: Repository<Person>,
    @InjectRepository(Auth)
    private userRepo: Repository<Auth>
  ){}

  async create(personDto: CreatePersonDto) {
    const getUser = await this.userRepo.findOneBy({id: +personDto.user})
    if(!getUser) throw new NotFoundException("user id not found")

    const setPerso = this.persoRepo.create({
      ...personDto,
      user: getUser
    })

    const savePerso = await this.persoRepo.save(setPerso)
    return savePerso;
  }

  async findAll() {
    const getAllPerson = await this.persoRepo.find({relations: ["user"]});
    if(!getAllPerson) throw new NotFoundException("Person not found")
    return getAllPerson.reverse();
  }

  async findOne(id: number) {
    const getOnePerso = await this.persoRepo.findOne({
      where: {id},
      relations: {user: true}
    })

    if(!getOnePerso) throw new NotFoundException("Person not found")
    return getOnePerso;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    const user = await this.persoRepo.findOne({where:{user:{id:+id}}}) as any
    const getPerso = await this.persoRepo.findOneBy({id})
    if(!getPerso) throw new NotFoundException("Person id not found")
    await this.persoRepo.update(id, updatePersonDto)
  
    await this.userRepo.update(user.id, {email : updatePersonDto.name})
    return await this.findOne(id);
  }

  async remove(id: number) {
    try{
      await this.persoRepo.delete(id)
    }
    catch(error){
      throw new BadRequestException("Person can't remove", error)
    }
  }
}
