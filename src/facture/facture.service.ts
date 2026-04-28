import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFactureDto } from './dto/create-facture.dto';
import { UpdateFactureDto } from './dto/update-facture.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Facture } from './entities/facture.entity';
import { Repository } from 'typeorm';
import { Person } from 'src/person/entities/person.entity';
import { Client } from 'src/client/entities/client.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Vente } from 'src/ventes/entities/vente.entity';

@Injectable()
export class FactureService {
  constructor(
    @InjectRepository(Facture)
    private factureRepo: Repository<Facture>,
    @InjectRepository(Person)
    private persoRepo: Repository<Person>,
    @InjectRepository(Vente)
    private venteRepo: Repository<Vente>,
    @InjectRepository(Client)
    private clientRepo: Repository<Client>
  ) { }

  async create(factureDto: CreateFactureDto) {
    // const null as any = await this.persoRepo.findOneBy({ id: +factureDto.admin })
    const getVente = await this.venteRepo.findOneBy({ id: +factureDto.stock })
    // if (!null as any) throw new NotFoundException("person id not found")
    const getCLient = await this.clientRepo.findOneBy({ id: +factureDto.client })
    if (!getCLient) throw new NotFoundException("client id not found")
    let key = `${(Math.random() * 100000)}~${(Math.random() * 100000)}`
    const saveFacture = await this.factureRepo.save({
      ...factureDto,
      admin: null as any,
      client: getCLient,
      vente: getVente as any,
      key_item: key
    })
    return "ok";
  }
  async createMore(factureDto: CreateFactureDto[]) {
    let key = `${(Math.random() * 100000)}~${(Math.random() * 100000)}`
    factureDto.map(async (factureDto) => {
      // const null as any = await this.persoRepo.findOneBy({ id: +factureDto.admin })
      const getVente = await this.venteRepo.findOneBy({ id: +factureDto.stock })
      // if (!null as any) throw new NotFoundException("person id not found")
      const getCLient = await this.clientRepo.findOneBy({ id: +factureDto.client })
      if (!getCLient) throw new NotFoundException("client id not found")

      const saveFacture = await this.factureRepo.save({
        ...factureDto,
        admin: null as any,
        client: getCLient,
        vente: getVente as any,
        key_item: key
      })
    })
    return "ok";
  }

  async findAll() {
    try {
      const getAll_key = await this.factureRepo.query("SELECT distinct(key_item) FROM facture")
      let data = [] as any
      const get_invoice = this.factureRepo.find({ relations: ["client", "vente", "vente.stock"] })
      for (let index = 0; index < getAll_key.length; index++) {
        const element = getAll_key[index] as CreateFactureDto;

        let rest = (await get_invoice).filter((item) => item.key_item == element.key_item)
        let client = rest[0].client

        let quantite = ((await rest).map((item) => item.quantite)).reduce((a, b) => a + b)
        let total_ht = ((await rest).map((item) => item.total_ht)).reduce((a, b) => a + b)
        let total_ttc = ((await rest).map((item) => item.total_ttc)).reduce((a, b) => a + b)
        let tva = ((await rest).map((item) => item.tva)).reduce((a, b) => a + b)
        let createdAt = rest[0].createdAt
        data.unshift({ client, quantite, tva, total_ht, total_ttc, createdAt, list: rest })
      }

      return await data
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: number) {
    try {
      const getOne = await this.factureRepo.find({
        where: { id },
        relations: [ "client"]
      })
      return getOne
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: number, updateFactureDto: UpdateFactureDto) {
    try {
      await this.factureRepo.update(id, updateFactureDto)
      return this.findOne(id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(factureDto: CreateFactureDto[]) {
    try {
      factureDto.map(async (factureDto) => {

        await this.factureRepo.delete(factureDto.id)
      })
      return await "deleted"
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
