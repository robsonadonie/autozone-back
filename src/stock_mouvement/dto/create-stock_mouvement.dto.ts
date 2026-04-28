import { Person } from "src/person/entities/person.entity"
import { Stock } from "src/stock/entities/stock.entity"

export class CreateStockMouvementDto {
    type: string //entrée, sortie
    quantite: number
    stock: Stock | number
    admin: Person | number
}
