import { PartialType } from '@nestjs/swagger';
import { CreateStockMouvementDto } from './create-stock_mouvement.dto';

export class UpdateStockMouvementDto extends PartialType(CreateStockMouvementDto) {}
