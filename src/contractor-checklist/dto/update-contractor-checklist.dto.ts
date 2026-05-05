import { PartialType } from '@nestjs/swagger';
import { CreateContractorChecklistDto } from './create-contractor-checklist.dto';

export class UpdateContractorChecklistDto extends PartialType(CreateContractorChecklistDto) {}
