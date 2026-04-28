import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@ApiTags("client")
@Controller('client')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: {type: "string"},
        firstName: {type: "string"},
        telephone: {type: "string"},
        adresse: {type: "string"},
        code_postal: {type: "string"},
        nif: {type: "string"},
        stat: {type: "string"},
        rc : {type: "string"},
        email: {type: "string"},
        admin: {type: "number"}
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(+id);
  }

  @Patch(':id')
  // @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: {type: "string"},
        firstName: {type: "string"},
        telephone: {type: "string"},
        adresse: {type: "string"},
        email: {type: "string"},
        rc: {type: "string"},
        nif: {type: "string"},
        stat: {type: "string"},
        
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    
    return this.clientService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }
}
