import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { FactureService } from './facture.service';
import { CreateFactureDto } from './dto/create-facture.dto';
import { UpdateFactureDto } from './dto/update-facture.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@ApiTags("facture")
@Controller('facture')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class FactureController {
  constructor(private readonly factureService: FactureService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    isArray: true,
    schema: {
      type: "object",
      properties: {
        designation: {type: "string"},
        quantite: {type: "number"},
        prix_ht: {type: "number"},
        tva: {type: "number"},
        total_ht: {type: "number"},
        total_ttc: {type: "number"},
        stock: {type: "number"},
        mode_paiment: {type: "string"},
        numFacture: {type: "string"},
        date: {type: "string"},
        client: {type: "number"},
        admin: {type: "number"},
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createFactureDto: CreateFactureDto) {
    return this.factureService.create(createFactureDto);
  }
  @Post("/more")
  @UseInterceptors(NoFilesInterceptor())
  createMore(@Body() createFactureDto: CreateFactureDto[]) {
    return this.factureService.createMore(createFactureDto);
  }

  @Get()
  findAll() {
    return this.factureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.factureService.findOne(+id);
  }

  @Patch(':id')
  
  update(@Param('id') id: string, @Body() updateFactureDto: UpdateFactureDto) {
    return this.factureService.update(+id, updateFactureDto);
  }

  @Post('/del')
  remove(@Body() createFactureDto: CreateFactureDto[]) {
    return this.factureService.remove(createFactureDto);
  }
   
}
