import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { AchatsService } from './achats.service';
import { CreateAchatDto } from './dto/create-achat.dto';
import { UpdateAchatDto } from './dto/update-achat.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@ApiTags("achats")
@Controller('achats')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class AchatsController {
  constructor(private readonly achatsService: AchatsService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        quantite: {type: "number"},
        prix_unitaire: {type: "number"},
        status: {type: "string"},
        idStock: {type: "number"},
        fournisseurs: {type: "string"},
        admin: {type: "number"},
        venteId: {type: "number"},
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createAchatDto: CreateAchatDto) {
    return this.achatsService.create(createAchatDto);
  }

  @Get()
  findAll() {
    return this.achatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.achatsService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        quantite: {type: "number"},
        prix_unitaire: {type: "number"},
        status: {type: "string"},
        idStock: {type: "number"},
        fournisseurs: {type: "number"},
        admin: {type: "number"},
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  update(@Param('id') id: string, @Body() updateAchatDto: UpdateAchatDto) {
    return this.achatsService.update(+id, updateAchatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.achatsService.remove(+id);
  }
}
