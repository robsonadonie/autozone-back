import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVenteDto } from './dto/create-vente.dto';
import { UpdateVenteDto } from './dto/update-vente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vente } from './entities/vente.entity';
import { Repository } from 'typeorm';
import { Person } from 'src/person/entities/person.entity';
import { Client } from 'src/client/entities/client.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { StockService } from 'src/stock/stock.service';
import { CreateClientDto } from 'src/client/dto/create-client.dto';
import { ClientService } from 'src/client/client.service';
import { Facture } from 'src/facture/entities/facture.entity';

@Injectable()
export class VentesService {
  constructor(
    @InjectRepository(Vente)
    private venteRepo: Repository<Vente>,
    @InjectRepository(Person)
    private persoRepo: Repository<Person>,
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
    private clientService: ClientService,
    @InjectRepository(Stock)
    private stockRepo: Repository<Stock>,
    @InjectRepository(Facture)
    private factRepo: Repository<Facture>,
    private stockService: StockService
  ) { }

  async create(venteDto: CreateVenteDto, clientDto: CreateClientDto) {
    const getPerso = await this.persoRepo.findOneBy({ id: +venteDto.admin })
    if (!getPerso) throw new NotFoundException("person id not found")

    let infoClient: any;

    const {id, ...restData} = venteDto.dataClient

    if (venteDto.dataClient.id == "newClient") {

   

      let admin =await this.persoRepo.findOne({ where: { id: +venteDto.admin } })

      const Client =  this.clientRepo.create({
        ...restData,
        admin: admin
      } as any)
      const saveClient = await this.clientRepo.save(Client)
      infoClient = saveClient
    }
    else {
      const setClient = await this.clientService.findOne(+venteDto.client)
      infoClient = setClient
    }


    const getStock = await this.stockService.findOne(+venteDto.stock)
    if (!getStock) throw new NotFoundException("stock id not found")

    if (Number(getStock.quantite) >= Number(venteDto.quantite)) {
      const newQte = Number(getStock.quantite) - Number(venteDto.quantite)
      await this.stockRepo.update(getStock.id, { quantite: newQte })
    }
    else {
      throw new BadRequestException("votre stock est insuffisant")
    }

    try {
      const setVente = this.venteRepo.create({
        ...venteDto,
        admin: getPerso,
        client: infoClient,
        stock: getStock
      })
      const saveVente = await this.venteRepo.save(setVente)
      return [saveVente]
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }
  async createMore(venteDto: CreateVenteDto[]) {
    const venteList: Vente[] = []
    let infoClient: any;
    const {id, ...restData} = venteDto[0].dataClient
    if (venteDto[0].dataClient.id == "newClient") {
      let admin =await this.persoRepo.findOne({ where: { id: +venteDto[0].admin } })

      const Client =  this.clientRepo.create({
        ...restData,
        admin: admin
      } as any)
      const saveClient = await this.clientRepo.save(Client)
      infoClient = saveClient
    }

    else {
      const setClient = await this.clientService.findOne(+venteDto[0].client)
      infoClient = setClient
    }


    for (let index = 0; index < venteDto.length; index++) {
      let vente = venteDto[index]
      const getPerso = await this.persoRepo.findOneBy({ id: +vente.admin })
      if (!getPerso) throw new NotFoundException("person id not found")

      const getStock = await this.stockService.findOne(+vente.stock.id)
      if (!getStock) throw new NotFoundException("stock id not found")

      if (Number(getStock.quantite) >= Number(vente.quantite)) {
        const newQte = Number(getStock.quantite) - Number(vente.quantite)
        await this.stockRepo.update(getStock.id, { quantite: newQte })
      }
      else {
        return "votre stock est insuffisant"
      }

      try {

        const setVente = this.venteRepo.create({
          ...vente,
          admin: getPerso,
          client: infoClient,
          stock: getStock
        })
        const saveVente = await this.venteRepo.save(setVente)
        await venteList.push(saveVente as any)


      }
      catch (error) {
        throw new BadRequestException(error.message)
      }


    }


    return venteList
  }

  async findAll() {
    try {
      const getAll = await this.venteRepo.find({
        relations: [
          "admin",
          "client",
          "stock",
          "stock.admin",
          "stock.family",
          "stock.family.parent",
          "stock.family.parent.parent",
          "stock.family.parent.parent.parent",
          "stock.family.origine"
        ]
      })
      let list_with_invoice: Vente[] = []
      let AllInvoice = await this.factRepo.find({
        relations: [
          "vente"
        ]
      })

      getAll.map(async (vente) => {
        let invoice = await AllInvoice.filter((item: any) => item.vente?.id == vente.id)
        list_with_invoice.unshift({ ...vente, facture: invoice || [] })


      })
      return list_with_invoice
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: number) {
    try {
      const getOne = await this.venteRepo.findOne({
        where: { id },
        relations: [
          "admin",
          "client",
          "stock",
          "stock.admin",
          "stock.family",
          "stock.family.parent",
          "stock.family.parent.parent",
          "stock.family.parent.parent.parent",
          "stock.family.origine"
        ]
      })
      return getOne
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: number, updateVenteDto: UpdateVenteDto) {
    try {
      await this.venteRepo.update(id, updateVenteDto)
      return "updated"
    }
    catch (error) {
      throw "error"
    }
  }

  async remove(id: number) {
    try {
      await this.venteRepo.delete(id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
