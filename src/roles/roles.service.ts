import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ){}

  async create(roleDto: CreateRoleDto) {
    const getRole = await this.roleRepo.findOneBy({role: roleDto.role.toLocaleLowerCase().trim()})
    if(getRole) throw new BadRequestException("role déjà exists")
    const saveRole = await this.roleRepo.save(roleDto)
    return saveRole
  }

  async findAll() {
    try{
      const getAll = await this.roleRepo.find({relations:["person"]})
      return getAll.reverse()
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: number) {
    try{
      const getOne = await this.roleRepo.find({
        where: {id},
        relations:["person"]
      })
      return getOne
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try{
      await this.roleRepo.update(id, updateRoleDto)
      return await this.findOne(id)
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: number) {
    try{
      await this.roleRepo.delete(id)
    }
    catch(error){
      throw new BadRequestException(error.message)
    }
  }
}
