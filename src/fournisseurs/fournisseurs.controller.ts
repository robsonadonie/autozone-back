import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { FournisseursService } from './fournisseurs.service';
import { CreateFournisseurDto } from './dto/create-fournisseur.dto';
import { UpdateFournisseurDto } from './dto/update-fournisseur.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('fournisseurs')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class FournisseursController {
  constructor(private readonly fournisseursService: FournisseursService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: {type: "string"},
        telephone: {type: "string"},
        email: {type: "string"},
        adresse: {type: "string"},
        admin: {type: "number"},
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createFournisseurDto: CreateFournisseurDto) {
    return this.fournisseursService.create(createFournisseurDto);
  }

  @Get()
  findAll() {
    return this.fournisseursService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fournisseursService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: {type: "string"},
        telephone: {type: "string"},
        email: {type: "string"},
        adresse: {type: "string"},
        admin: {type: "number"},
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  update(@Param('id') id: string, @Body() updateFournisseurDto: UpdateFournisseurDto) {
    return this.fournisseursService.update(+id, updateFournisseurDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fournisseursService.remove(+id);
  }
}
