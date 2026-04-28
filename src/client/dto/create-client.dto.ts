import { Person } from "src/person/entities/person.entity"

export class CreateClientDto {
    name: string
    firstName: string
    telephone: string
    adresse: string
    code_postal: string
    ville: string
    pays: string
    nif: string
    status: string
    stat: string
    rc: string

    email: string
    admin: Person | number | null
}
