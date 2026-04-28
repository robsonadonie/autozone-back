import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/interceptor/fileInterceptor';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@ApiTags("stock")
@Controller('stock')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private readonly stockService: StockService) { }

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        code_barre: { type: "string" },
        code_items: { type: "string" },
        designation: { type: "string" },
        marque_produit: { type: "string" },
        categorie: { type: "string" },
        quantite: { type: "number" },
        prix_affiche: { type: "number" },
        dernier_prix: { type: "number" },
        emplacement: { type: "string" },
        family: { type: "number" },
        admin: { type: "number" },
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }
  @Post("excel")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: 'string', format: 'binary' },
        admin: { type: "number" },
      }
    }
  })
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: "./public/fichier",
      filename: editFileName
    })
  }))
  importFromExcel(@Body() createStockDto: CreateStockDto, @UploadedFile() file: Express.Multer.File) {

    return this.stockService.importFromExcel(file, createStockDto);
  }

  @Get('export/:id')
  async exportStock(@Param("id") id: string) {

    const result = await this.stockService.exportStockToExcel(id);
    if(result == "error"){
      return {
        status: 'Aucun stock trouvé lié à votre demande',
        data: {filePath : null},
      };

    }else{

      return {
        status: 'Exportation réussie',
        data: result,
      };
    }
  }

  @Get()
  findAll() {
    return this.stockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        code_barre: { type: "string" },
        code_items: { type: "string" },
        designation: { type: "string" },
        marque_produit: { type: "string" },
        categorie: { type: "string" },
        prix_affiche: { type: "number" },
        dernier_prix: { type: "number" },
        emplacement: { type: "string" },
        family: { type: "number" },
        admin: { type: "number" },
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stockService.update(+id, updateStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockService.remove(+id);
  }




}
