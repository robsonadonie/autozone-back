import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from "@nestjs/typeorm"
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"
import { Role } from 'src/roles/entities/role.entity';
import { Roles } from 'src/enum/enum';
import { Person } from 'src/person/entities/person.entity';
import { PersonService } from 'src/person/person.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private userRepo: Repository<Auth>, 
    @InjectRepository(Person)
    private personRepo: Repository<Person>,
    private jwtService: JwtService,
    private personSerive:PersonService,
  ){}
  async register(userDto: CreateAuthDto) {
    const userExiste = await this.userRepo.findOneBy({email: userDto.email})
    if(userExiste) throw new BadRequestException("name/exists")

    const {name, firstName, ...restData} = userDto
    const user = this.userRepo.create({
      ...restData,
      status :"1"
    })
    
    user.passwordConfirm = await bcrypt.genSalt()
    user.password = await bcrypt.hash(user.password, user.passwordConfirm)
    
    const saveDataUser = await this.userRepo.save(user)

    if(saveDataUser){
      const setPerson = this.personRepo.create({
        name: userDto.email,
        user: saveDataUser
      })

      await this.personRepo.save(setPerson)
      return "created"
    }
    
  }

  async signIn(credentials: CreateAuthDto){
    const getUser = await this.userRepo.findOne({
      where: {email: credentials.email},
      relations: { person : true}
    })
    
    if(!getUser){
      return "email/incorrect"
    }

    const getPassword = await bcrypt.compare(credentials.password, getUser.password)
    if(!getPassword) return "password/incorrect"

    const {password, passwordConfirm, ...restData} = getUser
if(getUser.status == "0") return "desactived"
    const token = this.jwtService.sign({...restData})
    return { "token" : token }
  }

  async findAll() {
    try{
      const getAll = await this.userRepo.find({relations:["person", "role"]})
      return getAll.reverse()
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: number) {
    if(id>0){

      try{
        const getOne = await this.userRepo.findOne({
        where: {id},
        relations:["person"]
      }) as any;
      if(getOne){
        delete getOne?.password as any
        delete getOne?.passwordConfirm as any
        return getOne

      }else{
        return "use-not-found"
      }
      
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    try{
      const user = await this.personRepo.findOne({where:{user:{id:+id}}}) as any
      const px = await this.personRepo.findOne({where:{user:{id}}}) as any
      
      if(updateAuthDto.password){

        let userS = {} as any
       let conf = await bcrypt.genSalt()
        userS.password = await bcrypt.hash(updateAuthDto.password, conf)
        userS.email=updateAuthDto.email
        
        
        await this.userRepo.update(id,userS)
        await this.personRepo.update(user.id,{name:updateAuthDto.email})
        return "actived"
      }else{

        if(updateAuthDto.role){
          await this.userRepo.update(id,{role : updateAuthDto.role,email:updateAuthDto.email})
          await this.personRepo.update(user.id,{name:updateAuthDto.email})
          
        }
        await this.personRepo.update(user.id,{name:updateAuthDto.email})
        return "actived"
      }
      
    }
    catch(error){
      
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: number) {
    try{
      await this.userRepo.delete(id)
      return "deleted"
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }
}
