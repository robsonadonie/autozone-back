import { Client } from "src/client/entities/client.entity"
import { Person } from "src/person/entities/person.entity"
import { Stock } from "src/stock/entities/stock.entity"
import { Vente } from "src/ventes/entities/vente.entity"

export class CreateFactureDto {
    designation: string
    quantite: number
    id: number
    prix_ht: number
    tva: number
    total_ht: number
    total_ttc: number
    mode_paiment: string
    numFacture: string
    date: string
    key_item: string
    client: Client | number
    stock: Stock | number
    vente: Vente |number
    admin: Person | number
}
