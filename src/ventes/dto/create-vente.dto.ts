import { Client } from "src/client/entities/client.entity"
import { Person } from "src/person/entities/person.entity"
import { Stock } from "src/stock/entities/stock.entity"
import { Vente } from "../entities/vente.entity"

export class CreateVenteDto {
    quantite: number
    status: string // payé, en attend
    mode_paiement: string
    TVA: number
    total_HT: number
    total_TTC: number
    admin: Person | number
    client: Client | number
    stock:  {id:number} |  Stock 
    vente:  {id:number} |  Vente 
    name: string
    dataClient : {id:string|number,name:string,firstName:string}

}
