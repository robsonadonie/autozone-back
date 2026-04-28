import { PartialType } from '@nestjs/swagger';
import { CreateOrigineDto } from './create-origine.dto';

export class UpdateOrigineDto extends PartialType(CreateOrigineDto) {}
