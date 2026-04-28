import { Fournisseur } from "src/fournisseurs/entities/fournisseur.entity"
import { Person } from "src/person/entities/person.entity"
import { Stock } from "src/stock/entities/stock.entity"

export class CreateAchatDto {
    quantite: number
    prix_unitaire: number
    venteId:number
    status: string //reçu, annulé
    idStock: number
    stock: Stock | number
    fournisseur: string
    admin: Person | number
}
