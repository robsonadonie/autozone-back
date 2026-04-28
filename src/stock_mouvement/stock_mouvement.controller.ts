import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { StockMouvementService } from './stock_mouvement.service';
import { CreateStockMouvementDto } from './dto/create-stock_mouvement.dto';
import { UpdateStockMouvementDto } from './dto/update-stock_mouvement.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@ApiTags("stock-mouvement")
@Controller('stock-mouvement')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class StockMouvementController {
  constructor(private readonly stockMouvementService: StockMouvementService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        type: {type: "string"},
        quantite: {type: "number"},
        stock: {type: "number"},
        admin: {type: "number"}
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createStockMouvementDto: CreateStockMouvementDto) {
    return this.stockMouvementService.create(createStockMouvementDto);
  }

  @Get()
  findAll() {
    return this.stockMouvementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockMouvementService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        type: {type: "string"},
        quantite: {type: "number"},
        stock: {type: "number"},
        admin: {type: "number"}
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  update(@Param('id') id: string, @Body() updateStockMouvementDto: UpdateStockMouvementDto) {
    return this.stockMouvementService.update(+id, updateStockMouvementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockMouvementService.remove(+id);
  }
}
