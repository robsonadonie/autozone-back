import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { VentesService } from './ventes.service';
import { CreateVenteDto } from './dto/create-vente.dto';
import { UpdateVenteDto } from './dto/update-vente.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { CreateClientDto } from 'src/client/dto/create-client.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@ApiTags("ventes")
@Controller('ventes')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class VentesController {
  constructor(private readonly ventesService: VentesService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        quantite: {type: "number"},
        status: {type: "string"},
        mode_paiement: {type: "string"},
        TVA: {type: "number"},
        total_HT: {type: "number"},
        total_TTC: {type: "number"},
        admin: {type: "number"},
        client: {type: "number"},
        stock: {type: "number"},
        dataClient : {type:"object"}

      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createVenteDto: CreateVenteDto, clientDto: CreateClientDto) {
    return this.ventesService.create(createVenteDto, clientDto);
  }
  @Post("/more")
 
  @UseInterceptors(NoFilesInterceptor())
  createMore(@Body() createVenteDto: CreateVenteDto[]) {
    return this.ventesService.createMore(createVenteDto);
  }

  @Get()
  findAll() {
    return this.ventesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventesService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(NoFilesInterceptor())
  update(@Param('id') id: string, @Body() updateVenteDto: UpdateVenteDto) {
    return this.ventesService.update(+id, updateVenteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ventesService.remove(+id);
  }
}
