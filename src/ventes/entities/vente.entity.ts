import { Client } from "src/client/entities/client.entity";
import { Facture } from "src/facture/entities/facture.entity";
import { Person } from "src/person/entities/person.entity";
import { Stock } from "src/stock/entities/stock.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("ventes")
export class Vente {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantite: number

    @Column()
    status: string // payé, en attend

    @Column()
    mode_paiement: string

    @Column({ default: 0 })
    TVA: number

    @Column({ default: 0 })
    total_HT: number

    @Column({ default: 0 })
    total_TTC: number

    @ManyToOne(() => Person, perso => perso.vente,
        { onDelete: "CASCADE", orphanedRowAction: "delete" })
    admin: Person | number

    @ManyToOne(() => Client, client => client.vente,
        { onDelete: "CASCADE", orphanedRowAction: "delete" })
    client: Client | number
    @ManyToOne(() => Facture, facture => facture.vente)
    facture: Facture[] | number
    @ManyToOne(() => Stock, stock => stock.vente,
        { onDelete: "CASCADE", orphanedRowAction: "delete" })
    stock: Stock | number
    @CreateDateColumn()
    createdAt: Date
}
