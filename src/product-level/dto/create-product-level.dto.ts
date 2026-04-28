import { Person } from "src/person/entities/person.entity"

export class CreateProductLevelDto {
    level: string
    admin: Person | number
}
