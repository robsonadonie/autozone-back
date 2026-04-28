import { Fournisseur } from "src/fournisseurs/entities/fournisseur.entity";
import { Person } from "src/person/entities/person.entity";
import { Stock } from "src/stock/entities/stock.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("achats")
export class Achat {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantite: number

    @Column()
    prix_unitaire: number

    @Column()
    status: string //reçu, annulé


    @ManyToOne(() => Stock, stock => stock.achats,
        { onDelete: "CASCADE", orphanedRowAction: "delete" })
    stock: Stock | number

    @Column()
    fournisseur: string

    @ManyToOne(() => Person, perso => perso.achats,
        { onDelete: "CASCADE", orphanedRowAction: "delete" })
    admin: Person | number

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
