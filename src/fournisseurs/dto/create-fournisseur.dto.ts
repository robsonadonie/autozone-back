import { Person } from "src/person/entities/person.entity"

export class CreateFournisseurDto {
    name: string
    telephone: string
    email:string
    adresse: string
    admin: Person | number
}
