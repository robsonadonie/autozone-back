import { Person } from "src/person/entities/person.entity"

export class CreateOrigineDto {
    pays: string
    admin: Person | number
}
