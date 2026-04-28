import { Origine } from "src/origines/entities/origine.entity"
import { ProductFamily } from "../entities/product-family.entity"
import { Person } from "src/person/entities/person.entity"
import { ProductLevel } from "src/product-level/entities/product-level.entity"

export class CreateProductFamilyDto {
    family_name: string
    level: ProductLevel | number
    level_name: string
    parent?: ProductFamily | number 
    origine: Origine | number
    admin: Person | number
}
