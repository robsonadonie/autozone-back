import { Person } from "src/person/entities/person.entity"
import { ProductFamily } from "src/product-family/entities/product-family.entity"

export class CreateStockDto {
    code_barre: string
    code_items: string
    designation: string
    categorie: string
    marque_produit: string
    quantite: number
    prix_affiche: number
    dernier_prix: number
    emplacement: string
    family: ProductFamily | number
    admin: Person | number
}
