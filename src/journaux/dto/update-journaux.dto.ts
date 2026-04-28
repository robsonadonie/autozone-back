import { PartialType } from '@nestjs/swagger';
import { CreateJournauxDto } from './create-journaux.dto';

export class UpdateJournauxDto extends PartialType(CreateJournauxDto) {}
