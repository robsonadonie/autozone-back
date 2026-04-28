import { IsOptional } from "class-validator"
import { Auth } from "src/auth/entities/auth.entity"

export class CreatePersonDto {
    name: string
    firstName: string
    address: string
    contact: string
    images: string 
    user: Auth | number
}
