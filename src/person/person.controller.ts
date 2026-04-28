import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/interceptor/fileInterceptor';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('person')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string"},
        firstName: { type: "string"},
        contact: { type: "string"},
        user: {type: "integer"}
      }
    } 
  })
  @UseInterceptors(FileInterceptor("images", {
    storage: diskStorage({
      destination: "./public/images",
      filename: editFileName
    })
  }))
  create(@Body() createPersonDto: CreatePersonDto, @UploadedFile() file: Express.Multer.File) {
    const dataPerso = {
      ...createPersonDto,
      images: file ? file.filename : "default.jpeg"
    }
    return this.personService.create(dataPerso);
  }

  @Get()
  findAll() {
    return this.personService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string"},
        firstName: { type: "string"},
        contact: { type: "string"},
        images: {type: "file"},
        user: {type: "integer"}
      }
    }
  })
  @UseInterceptors(FileInterceptor("images", {
    storage: diskStorage({
      destination: "./public/images",
      filename: editFileName
    })
  }))
  async update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto, @UploadedFile() file: Express.Multer.File) {
    const getPerso = await this.personService.findOne(+id)

    // const setPerso = {
    //   ...updatePersonDto,
    //   images: file ? file.filename : getPerso.images
    // }
    // return this.personService.update(+id, setPerso);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
