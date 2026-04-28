import { Client } from "src/client/entities/client.entity";
import { Person } from "src/person/entities/person.entity";
import { Stock } from "src/stock/entities/stock.entity";
import { Vente } from "src/ventes/entities/vente.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("facture")
export class Facture {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    designation: string

    @Column()
    quantite: number

    @Column()
    prix_ht: number

    @Column()
    tva: number

    @Column()
    total_ht: number

    @Column()
    total_ttc: number

    @Column()
    mode_paiment: string

    @Column()
    numFacture: string

    @Column({default:null})
    date: string

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @Column()
    key_item: string
    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => Client, client => client.facture,
    {onDelete:"CASCADE", orphanedRowAction:"delete"})
    client: Client | number
    @ManyToOne(() => Vente, vente => vente.facture,
    {onDelete:"CASCADE", orphanedRowAction:"delete"})
    vente: Vente | number

    @ManyToOne(() => Person, perso => perso.facture,
    {onDelete:"CASCADE", orphanedRowAction:"delete"})
    admin: Person | number
}
