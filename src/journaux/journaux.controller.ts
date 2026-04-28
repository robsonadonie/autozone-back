import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { JournauxService } from './journaux.service';
import { CreateJournauxDto } from './dto/create-journaux.dto';
import { UpdateJournauxDto } from './dto/update-journaux.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@ApiTags("journaux")
@Controller('journaux')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class JournauxController {
  constructor(private readonly journauxService: JournauxService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        type: {type: "string"},
        cause: {type: "string"},
        mode_paiement: {type: "string"},
        montant: {type: "number"},
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createJournauxDto: CreateJournauxDto) {
    return this.journauxService.create(createJournauxDto);
  }

  @Get()
  findAll() {
    return this.journauxService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.journauxService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        type: {type: "string"},
        cause: {type: "string"},
        mode_paiement: {type: "string"},
        montant: {type: "number"},
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  update(@Param('id') id: string, @Body() updateJournauxDto: UpdateJournauxDto) {
    return this.journauxService.update(+id, updateJournauxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.journauxService.remove(+id);
  }
}
