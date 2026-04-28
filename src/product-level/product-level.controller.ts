import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { ProductLevelService } from './product-level.service';
import { CreateProductLevelDto } from './dto/create-product-level.dto';
import { UpdateProductLevelDto } from './dto/update-product-level.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@ApiTags("product_level")
@Controller('product-level')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class ProductLevelController {
  constructor(private readonly productLevelService: ProductLevelService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        level: {type: "string"},
        admin: {type: "number"}
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createProductLevelDto: CreateProductLevelDto) {
    return this.productLevelService.create(createProductLevelDto);
  }

  @Get('level/:id')
  findFamilyLevel(@Param("id") id: string) {
    return this.productLevelService.findFamilyLevel(+id);
  }

  @Get('all/:id')
  findAll(@Param("id") id: string) {
    return this.productLevelService.findAll(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productLevelService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(NoFilesInterceptor())
  update(@Param('id') id: string, @Body() updateProductLevelDto: UpdateProductLevelDto) {
    return this.productLevelService.update(+id, updateProductLevelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productLevelService.remove(+id);
  }
}
