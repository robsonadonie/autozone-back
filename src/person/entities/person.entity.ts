import { Achat } from "src/achats/entities/achat.entity";
import { Auth } from "src/auth/entities/auth.entity";
import { Client } from "src/client/entities/client.entity";
import { Facture } from "src/facture/entities/facture.entity";
import { Fournisseur } from "src/fournisseurs/entities/fournisseur.entity";
import { Origine } from "src/origines/entities/origine.entity";
import { ProductFamily } from "src/product-family/entities/product-family.entity";
import { ProductLevel } from "src/product-level/entities/product-level.entity";
import { Stock } from "src/stock/entities/stock.entity";
import { StockMouvement } from "src/stock_mouvement/entities/stock_mouvement.entity";
import { Vente } from "src/ventes/entities/vente.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("person")
export class Person {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
 

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToOne(() => Auth, user => user.person,
    {onDelete: "CASCADE", onUpdate: "CASCADE", orphanedRowAction: "delete"})
    @JoinColumn()
    user: Auth | number

    @OneToMany(() => Origine, origin => origin.admin,
    {cascade:true})
    origine: Origine[] | number

    @OneToMany(() => ProductFamily, prodF => prodF.admin,
    {cascade:true})
    family: ProductFamily[] | number

    @OneToMany(() => ProductLevel, level => level.admin,
    {cascade:true})
    prodLevel: ProductLevel[] | number

    @OneToMany(() => Stock, stock => stock.admin,
    {cascade:true})
    stock: Stock[] | number

    @OneToMany(() => StockMouvement, s_mouve => s_mouve.admin,
    {cascade:true})
    mouvements: StockMouvement[] | number
    
    @OneToMany(() => Vente, vente => vente.admin,
    {cascade:true})
    vente: Vente[] | number

    @OneToMany(() => Client, client => client.admin,
    {cascade:true})
    client: Client[] | number

    @OneToMany(() => Achat, achat => achat.admin,
    {cascade:true})
    achats: Achat[] | number

    @OneToMany(() => Fournisseur, fourniss => fourniss.admin,
    {cascade:true})
    fournisseurs: Achat[] | number

    @OneToMany(() => Facture, facture => facture.admin,
    {cascade:true})
    facture: Facture
}

