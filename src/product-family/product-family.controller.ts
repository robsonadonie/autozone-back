import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { ProductFamilyService } from './product-family.service';
import { CreateProductFamilyDto } from './dto/create-product-family.dto';
import { UpdateProductFamilyDto } from './dto/update-product-family.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@ApiTags("family_product")
@Controller('product-family')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class ProductFamilyController {
  constructor(private readonly productFamilyService: ProductFamilyService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        family_name: {type: "string"},
        level: {type: "number"},
        description: {type: "string"},
        parent: {type: "number"},
        origine: {type: "number"},
        admin: {type: "number"}
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createProductFamilyDto: CreateProductFamilyDto) {
    return this.productFamilyService.create(createProductFamilyDto);
  }

  @Get("level/:id")
  findLevel(@Param("id") id: string) {
    return this.productFamilyService.findLevel(+id);
  }

  @Get("origin/:id")
  findOrigin(@Param("id") id: string) {
    return this.productFamilyService.findOrigin(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productFamilyService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        family_name: {type: "string"},
        level: {type: "number"},
        description: {type: "string"},
        parent: {type: "number"},
        origine: {type: "number"},
        admin: {type: "number"}
      }
    }
  })
  @UseInterceptors(NoFilesInterceptor())
  update(@Param('id') id: string, @Body() updateProductFamilyDto: UpdateProductFamilyDto) {
    return this.productFamilyService.update(+id, updateProductFamilyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productFamilyService.remove(+id);
  }
}
