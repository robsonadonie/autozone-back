import { Person } from "src/person/entities/person.entity";
import { Stock } from "src/stock/entities/stock.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("stock_mouvements")
export class StockMouvement {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string //entrée, sortie

    @Column()
    quantite: number

    @ManyToOne(() => Stock, stock => stock.mouvements,
    {onDelete: "CASCADE", orphanedRowAction:"delete"})
    stock: Stock | number

    @ManyToOne(() => Person, perso => perso.mouvements,
    {onDelete:"CASCADE", orphanedRowAction:"delete"})
    admin: Person | number

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
