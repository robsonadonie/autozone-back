import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { OriginesService } from './origines.service';
import { CreateOrigineDto } from './dto/create-origine.dto';
import { UpdateOrigineDto } from './dto/update-origine.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@ApiTags("Origines")
@Controller('origines')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class OriginesController {
  constructor(private readonly originesService: OriginesService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        pays: { type: "string"},
        admin: { type: "integer"},
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createOrigineDto: CreateOrigineDto) {
    return this.originesService.create(createOrigineDto);
  }

  @Get("all/:id")
  findAll(@Param("id") id: string) {
    return this.originesService.findAll(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.originesService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        pays: { type: "string"},
        admin: { type: "integer"},
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  update(@Param('id') id: string, @Body() updateOrigineDto: UpdateOrigineDto) {
    return this.originesService.update(+id, updateOrigineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.originesService.remove(+id);
  }
}
