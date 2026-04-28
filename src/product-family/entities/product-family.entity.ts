import { Origine } from "src/origines/entities/origine.entity";
import { Person } from "src/person/entities/person.entity";
import { ProductLevel } from "src/product-level/entities/product-level.entity";
import { Stock } from "src/stock/entities/stock.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("product_family")
export class ProductFamily {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    family_name: string

    @Column({default: null})
    description: string

    @ManyToOne(() => ProductLevel, prodLevel => prodLevel.family,
    {onDelete:"CASCADE", orphanedRowAction:"delete"})
    level: ProductLevel | number

    @Column()
    level_name: string

    @OneToOne(() => ProductFamily, parent => parent.child,
    {nullable: true, onDelete: "CASCADE", orphanedRowAction:"delete", })
    @JoinColumn()
    parent?: ProductFamily | number

    @OneToOne(() => ProductFamily, (child) => child.parent)
    child?: ProductFamily | number

    @ManyToOne(() => Origine, origin => origin.family,
    {nullable: true, onDelete:"CASCADE", orphanedRowAction: "delete"})
    origine?: Origine | number

    @ManyToOne(() => Person, perso => perso.family,
    {onDelete:"CASCADE", orphanedRowAction:"delete"})
    admin: Person | number

    @OneToMany(() => Stock, stock => stock.family,
    {cascade:true})
    stock: Stock[] | number

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
