import { Achat } from "src/achats/entities/achat.entity";
import { Person } from "src/person/entities/person.entity";
import { ProductFamily } from "src/product-family/entities/product-family.entity";
import { StockMouvement } from "src/stock_mouvement/entities/stock_mouvement.entity";
import { Vente } from "src/ventes/entities/vente.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("stock")
export class Stock {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code_barre: string

    @Column()
    code_items: string

    @Column()
    designation: string

    @Column()
    categorie: string

    @Column()
    quantite: number

    @Column()
    prix_affiche: number

    @Column()
    dernier_prix: number

    @Column()
    prix_achat: number

    @Column()
    emplacement: string
    @Column()
    marque_produit: string

    @ManyToOne(() => ProductFamily, family => family.stock,
        { onDelete: "CASCADE", orphanedRowAction: "delete" })
    family: ProductFamily | number

    @OneToMany(() => Achat, family => family.stock,
        { onDelete: "CASCADE", orphanedRowAction: "delete" })
    achats: Achat | number

    @ManyToOne(() => Person, perso => perso.stock,
        { onDelete: "CASCADE", orphanedRowAction: "delete" })
    admin: Person | number

    @OneToMany(() => StockMouvement, s_mouve => s_mouve.stock,
        { cascade: true })
    mouvements: StockMouvement[] | number

    @OneToMany(() => Vente, vente => vente.stock,
        { cascade: true })
    vente: StockMouvement[] | number

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @UpdateDateColumn()
    updatedAt: Date




}
