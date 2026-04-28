import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Repository } from 'typeorm';
import { ProductFamily } from 'src/product-family/entities/product-family.entity';
import { Person } from 'src/person/entities/person.entity';
import { ProductLevel } from 'src/product-level/entities/product-level.entity';
import { Origine } from 'src/origines/entities/origine.entity';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { ProductFamilyService } from 'src/product-family/product-family.service';
import { CreateProductFamilyDto } from 'src/product-family/dto/create-product-family.dto';


@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepo: Repository<Stock>,
    @InjectRepository(ProductFamily)
    private familyRepo: Repository<ProductFamily>,
    @InjectRepository(Person)
    private persoRepo: Repository<Person>,
    @InjectRepository(Origine)
    private originRepo: Repository<Origine>,
    @InjectRepository(ProductLevel)
    private levelRepo: Repository<ProductLevel>,
    private familyService: ProductFamilyService
  ) { }

  async create(stockDto: CreateStockDto) {
    // const null as any = await this.persoRepo.findOneBy({id: +stockDto.admin})
    // if(!null as any) throw new NotFoundException("person id not found")

    const getFamily = await this.familyRepo.findOneBy({ id: +stockDto.family })
    if (!getFamily) throw new NotFoundException("product family id not found")

    const setStock = this.stockRepo.create({
      ...stockDto,
      family: getFamily,
      admin: null as any
    })

    return await this.stockRepo.save(setStock)
  }

  async findAll() {
    try {
      const getAll = await this.stockRepo.find({
        relations: [

          "family",
          "family.parent",
          "family.parent.parent",
          "family.parent.parent.parent",
          "family.parent.parent.parent.origine",
          "family.origine",
        ]
      })
      return getAll.reverse()
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: number) {
    const getOne = await this.stockRepo.findOne({
      where: { id },
      relations: [

        "family",
        "family.parent",
        "family.parent.parent",
        "family.parent.parent.parent",
        "family.origine"
      ]
    })
    return getOne
  }

  async update(id: number, updateStockDto: UpdateStockDto) {
    try {
      await this.stockRepo.update(id, updateStockDto)
      return "updated"
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }


  async importFromExcel(file: Express.Multer.File, stockDto: CreateStockDto) {
    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.readFile(file.path);
    } catch (err) {
      throw new BadRequestException("Fichier Excel invalide ou illisible");
    }

    if (!workbook.SheetNames?.length) {
      throw new BadRequestException("Le fichier Excel ne contient aucune feuille");
    }

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);
    const savedProducts: Stock[] = [];
    const excelEmpty: any[] = [];

    const colonnesImportantes = [
      "code barre", "code items", "designation", "categorie", "quantite",
      "prix affiche", "dernier prix", "prix achat", "emplacement",
      "origines", "marque", "model", "serie", "marque produit"
    ];

    const synonymMapping: Record<string, string> = {
      model: 'modele',
      modele: 'modele',
      'marqueproduit': 'marque_produit',
      origin: 'origines',
      origine: 'origines',
    };

    const normalize = (str: any): string => {
      if (typeof str !== 'string') return '';
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/\s|_/g, '').trim();
    };

    const applySynonym = (key: string): string => {
      const safeKey = normalize(key);
      return synonymMapping[safeKey] || safeKey;
    };

    const getExcelValue = (row: any, colName: string, map: Map<string, string>): any => {
      const normalized = applySynonym(colName);
      const originalCol = map.get(normalized);
      return originalCol ? row[originalCol] : undefined;
    };

    const allLevel = await this.levelRepo.find();

    for (const row of data) {
      const excelColsMap = new Map<string, string>();
      for (const col of Object.keys(row)) {
        if (!col || typeof col !== 'string') continue;
        excelColsMap.set(applySynonym(col), col);
      }

      // Vérification colonnes obligatoires
      const colonnesVides: string[] = [];
      for (const col of colonnesImportantes) {
        const valeur = getExcelValue(row, col, excelColsMap);
        if (valeur === undefined || valeur === null || valeur === '') {
          colonnesVides.push(col);
        }
      }
      if (colonnesVides.length > 0) {
        excelEmpty.push(row);
        continue;
      }

      // Origine
      const rowOrigine = getExcelValue(row, "origines", excelColsMap);
      let origine = await this.originRepo.findOneBy({ pays: rowOrigine });
      if (!origine || normalize(origine.pays) !== normalize(rowOrigine)) {
        origine = await this.originRepo.save({ pays: rowOrigine, admin: null as any });
      }

      // Vérification produit existant (code_items + designation)
      const codeItems = getExcelValue(row, "code items", excelColsMap);
      const designation = getExcelValue(row, "designation", excelColsMap);

      let existingProduct = await this.stockRepo.findOne({
        where: { code_items: codeItems, designation: designation },
      });

      if (existingProduct) {
        // Mise à jour simple du stock sans créer les familles
        const newQuantity = Number(getExcelValue(row, "quantite", excelColsMap)) || 0;
        existingProduct.quantite += newQuantity;

        let updated = false;

        const newPrixAffiche = Number(getExcelValue(row, "prix affiche", excelColsMap));
        const newDernierPrix = Number(getExcelValue(row, "dernier prix", excelColsMap));
        const newPrixAchat = Number(getExcelValue(row, "prix achat", excelColsMap));
        const newEmplacement = getExcelValue(row, "emplacement", excelColsMap);
        const newMarqueProduit = getExcelValue(row, "marque_produit", excelColsMap);

        if (newPrixAffiche && newPrixAffiche !== existingProduct.prix_affiche) {
          existingProduct.prix_affiche = newPrixAffiche;
          updated = true;
        }
        if (newDernierPrix && newDernierPrix !== existingProduct.dernier_prix) {
          existingProduct.dernier_prix = newDernierPrix;
          updated = true;
        }
        if (newPrixAchat && newPrixAchat !== existingProduct.prix_achat) {
          existingProduct.prix_achat = newPrixAchat;
          updated = true;
        }
        if (newEmplacement && newEmplacement !== existingProduct.emplacement) {
          existingProduct.emplacement = newEmplacement;
          updated = true;
        }

        if ((!existingProduct.marque_produit || existingProduct.marque_produit.trim() === '')
          && newMarqueProduit && newMarqueProduit.trim() !== '') {
          existingProduct.marque_produit = newMarqueProduit;
          updated = true;
        }

        if (updated || newQuantity > 0) {
          await this.stockRepo.save(existingProduct);
        }

        savedProducts.push(existingProduct);
        continue; // passe à la ligne suivante
      }

      // Produit non trouvé → création familles puis produit

      let prodFamily: ProductFamily[] = [];
      for (const level of allLevel) {
        const normLevel = applySynonym(level.level);
        const originalCol = excelColsMap.get(normLevel);

        if (originalCol && row[originalCol]) {
          const setFamily = this.familyRepo.create({
            family_name: row[originalCol],
            level: level.id,
            admin: null as any,
            origine: origine.id
          });

          const saveFamily = await this.familyService.create(setFamily as CreateProductFamilyDto);

          const parent = saveFamily.level_name.toLowerCase().trim() == "marque_produit" ? null :
            (saveFamily.level_name.toLowerCase().trim() == "marque" ?
              prodFamily.find(item => item.level_name.toLowerCase().trim() == "marque_produit")?.id :
              (saveFamily.level_name.toLowerCase().trim() == "modele" ?
                prodFamily.find(item => item.level_name.toLowerCase().trim() == "marque")?.id :
                (saveFamily.level_name.toLowerCase().trim() == "serie" ?
                  prodFamily.find(item => item.level_name.toLowerCase().trim() == "modele")?.id :
                  prodFamily.find(item => item.level_name.toLowerCase().trim() == "serie")?.id)));

          await this.familyRepo.update(saveFamily.id, { parent: parent as any });

          prodFamily.push(saveFamily);
        }
      }

      const lastProdFamily = prodFamily.find(item =>
        item.level_name.toLowerCase().trim() == "serie"
      );

      const marqueProdExcel = getExcelValue(row, "marque_produit", excelColsMap);
      const marqueFallback = getExcelValue(row, "marque", excelColsMap);

      const product = this.stockRepo.create({
        ...stockDto,
        code_barre: getExcelValue(row, "code barre", excelColsMap),
        code_items: codeItems,
        designation: designation,
        marque_produit: marqueProdExcel && marqueProdExcel.trim() !== '' ? marqueProdExcel : (marqueFallback || ''),
        categorie: getExcelValue(row, "categorie", excelColsMap),
        quantite: Number(getExcelValue(row, "quantite", excelColsMap)) || 0,
        prix_affiche: Number(getExcelValue(row, "prix affiche", excelColsMap)) || 0,
        dernier_prix: Number(getExcelValue(row, "dernier prix", excelColsMap)) || 0,
        prix_achat: Number(getExcelValue(row, "prix achat", excelColsMap)) || 0,
        emplacement: getExcelValue(row, "emplacement", excelColsMap),
        family: lastProdFamily,
        admin: null as any,
      });

      savedProducts.push(await this.stockRepo.save(product));
    }

    // Nettoyage fichier temporaire
    fs.unlinkSync(file.path);

    // Export des lignes ignorées
    let ignoredFilePath = '';
    if (excelEmpty.length > 0) {
      const exportDir = path.join(__dirname, '..', '..', 'public', 'exports');
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      const normalizedIgnoredRows = excelEmpty.map(row => {
        const excelColsMap = new Map<string, string>();
        for (const col of Object.keys(row)) {
          if (!col || typeof col !== 'string') continue;
          excelColsMap.set(applySynonym(col), col);
        }
        const normalizedRow: Record<string, any> = {};
        for (const col of colonnesImportantes) {
          normalizedRow[col] = getExcelValue(row, col, excelColsMap) || '';
        }
        return normalizedRow;
      });

      const exportFileName = `lignes_ignorées_${Date.now()}.xlsx`;
      ignoredFilePath = path.join(exportDir, exportFileName);

      const worksheet = XLSX.utils.json_to_sheet(normalizedIgnoredRows);
      const workbookExport = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbookExport, worksheet, "Lignes ignorées");
      XLSX.writeFile(workbookExport, ignoredFilePath);
      return "okay"
    }

    return {
      message: `${savedProducts.length} produits importés/mis à jour avec succès.`,
      produits: savedProducts,
      lignes_ignorees: excelEmpty.length,
      fichier_vide: ignoredFilePath ? `/exports/${path.basename(ignoredFilePath)}` : null,
      remarque: excelEmpty.length > 0
        ? `Certains produits n'ont pas été importés à cause de cellules vides. Veuillez remplir ces champs puis réimporter le fichier corrigé.`
        : null
    };
  }


  async exportStockToExcel(id: string) {
    // 1. Récupérer tous les produits
    let stocks = [] as any
    if (id == "1") {

      stocks = await this.stockRepo.find({
        relations: [

          "family",
          "family.parent",
          "family.parent.parent",
          "family.parent.parent.parent",
          "family.origine"
        ]
      });
    } else if (id == "2") {

      stocks = await this.stockRepo.find({
        where: { quantite: 0 }, relations: [

          "family",
          "family.parent",
          "family.parent.parent",
          "family.parent.parent.parent",
          "family.origine"
        ]
      });
    } else if (id == "3") {

      stocks = await this.stockRepo.createQueryBuilder('stock')
        .leftJoinAndSelect('stock.family', 'family')
        .leftJoinAndSelect('family.parent', 'parent')
        .leftJoinAndSelect('parent.parent', 'grandparent')
        .leftJoinAndSelect('grandparent.parent', 'greatgrandparent')
        .leftJoinAndSelect('family.origine', 'origine')
        .where('stock.quantite > :min', { min: 0 })
        .andWhere('stock.quantite < :max', { max: 4 })
        .getMany();
    }
    if (!stocks.length) return 'error';

    // 2. Transformation en lignes Excel
    const rows = stocks.map(stock => ({
      'Code Barre': stock.code_barre,
      'Code Items': stock.code_items,
      'Designation': stock.designation,
      'Marque Produit': stock.marque_produit,
      'Categorie': stock.categorie,
      'Quantité': stock.quantite,
      'Prix Affiché': stock.prix_affiche,
      'Dernier Prix': stock.dernier_prix,
      'Prix Achat': stock.prix_achat,
      'Emplacement': stock.emplacement,
      'Origine': (stock.family as any)?.origine?.pays || '',
      'Marque': (stock.family as any)?.parent?.parent?.family_name || '',
      'Modele': (stock.family as any)?.parent?.family_name || '',
      'Serie': (stock.family as any)?.family_name || '',
    }));


    // 3. Création du workbook
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stocks');

    // 4. Définition du chemin (utiliser process.cwd() au lieu de __dirname)
    const exportDir = path.join(process.cwd(), 'public', 'exports');
    if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

    const fileName = `${id == "1" ? "exporter_tout_les_stocks" : (id == "2" ? "exporter_les_stocks_épuisés" : "exporter_les_stocks_faibles")}-${stocks.length}.xlsx`;
    const filePath = path.join(exportDir, fileName);

    // 5. Écriture du fichier
    XLSX.writeFile(workbook, filePath);


    // 6. Retourner l’URL relative (pour servir dans un contrôleur ou frontend)
    return { filePath: `/exports/${fileName}` };
  }




  // async importFromExcel(file: Express.Multer.File, stockDto: CreateStockDto) {

  //   let workbook: XLSX.WorkBook;
  //   try {
  //     workbook = XLSX.readFile(file.path);
  //   } catch (err) {
  //     throw new BadRequestException("Fichier Excel invalide ou illisible");
  //   }

  //   if (!workbook.SheetNames?.length) {
  //     throw new BadRequestException("Le fichier Excel ne contient aucune feuille");
  //   }

  //   const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //   const data: any[] = XLSX.utils.sheet_to_json(worksheet);
  //   const savedProducts: Stock[] = [];
  //   const excelEmpty: any[] = [];

  //   const colonnesImportantes = [
  //     "code barre", "code items", "designation", "categorie", "quantite",
  //     "prix affiche", "dernier prix", "prix achat", "emplacement",
  //     "origines", "marque", "model", "serie", "marque produit"
  //   ];

  //   const synonymMapping: Record<string, string> = {
  //     model: 'modele',
  //     modele: 'modele',
  //     'marqueproduit': 'marque_produit',
  //     origin: 'origines',
  //     origine: 'origines',
  //   };

  //   const normalize = (str: any): string => {
  //     if (typeof str !== 'string') return '';
  //     return str.normalize("NFD").replace(/[\u0300-\u036f]/g, '')
  //       .toLowerCase().replace(/\s|_/g, '').trim();
  //   };

  //   const applySynonym = (key: string): string => {
  //     const safeKey = normalize(key);
  //     return synonymMapping[safeKey] || safeKey;
  //   };

  //   const getExcelValue = (row: any, colName: string, map: Map<string, string>): any => {
  //     const normalized = applySynonym(colName);
  //     const originalCol = map.get(normalized);
  //     return originalCol ? row[originalCol] : undefined;
  //   };

  //   const allLevel = await this.levelRepo.find();

  //   for (const row of data) {
  //     const excelColsMap = new Map<string, string>();
  //     for (const col of Object.keys(row)) {
  //       if (!col || typeof col !== 'string') continue;
  //       excelColsMap.set(applySynonym(col), col);
  //     }

  //     // ✅ Vérification colonnes obligatoires
  //     const colonnesVides: string[] = [];
  //     for (const col of colonnesImportantes) {
  //       const valeur = getExcelValue(row, col, excelColsMap);
  //       if (valeur === undefined || valeur === null || valeur === '') {
  //         colonnesVides.push(col);
  //       }
  //     }
  //     if (colonnesVides.length > 0) {
  //       excelEmpty.push(row);
  //       continue;
  //     }

  //     // ✅ Origine
  //     const rowOrigine = getExcelValue(row, "origines", excelColsMap);
  //     let origine = await this.originRepo.findOneBy({ pays: rowOrigine });
  //     if (!origine || normalize(origine.pays) !== normalize(rowOrigine)) {
  //       origine = await this.originRepo.save({ pays: rowOrigine, admin: null as any });
  //     }

  //     // ✅ Familles
  //     let prodFamily: ProductFamily[] = [];
  //     for (const level of allLevel) {
  //       const normLevel = applySynonym(level.level);
  //       const originalCol = excelColsMap.get(normLevel);

  //       if (originalCol && row[originalCol]) {
  //         const setFamily = this.familyRepo.create({
  //           family_name: row[originalCol],
  //           level: level.id,
  //           admin: null as any,
  //           origine: origine.id
  //         });

  //         const saveFamily = await this.familyService.create(setFamily as CreateProductFamilyDto);
  //         const parent = saveFamily.level_name.toLowerCase().trim() == "marque_produit" ? null :
  //           (saveFamily.level_name.toLowerCase().trim() == "marque" ?
  //             prodFamily.find(item => item.level_name.toLowerCase().trim() == "marque_produit")?.id :
  //             (saveFamily.level_name.toLowerCase().trim() == "modele" ?
  //               prodFamily.find(item => item.level_name.toLowerCase().trim() == "marque")?.id :
  //               (saveFamily.level_name.toLowerCase().trim() == "serie" ?
  //                 prodFamily.find(item => item.level_name.toLowerCase().trim() == "modele")?.id :
  //                 prodFamily.find(item => item.level_name.toLowerCase().trim() == "serie")?.id)));

  //         await this.familyRepo.update(saveFamily.id, { parent: parent as any });
  //         prodFamily.push(saveFamily);
  //       }
  //     }

  //     // ✅ Vérification produit existant (code_items + designation)
  //     const codeItems = getExcelValue(row, "code items", excelColsMap);
  //     const designation = getExcelValue(row, "designation", excelColsMap);

  //     let existingProduct = await this.stockRepo.findOne({
  //       where: { code_items: codeItems, designation: designation },
  //     });

  //     if (existingProduct) {
  //       // ✅ Toujours mettre à jour la quantité (ajout)
  //       const newQuantity = Number(getExcelValue(row, "quantite", excelColsMap)) || 0;
  //       existingProduct.quantite += newQuantity;

  //       // ✅ Vérifier si les autres champs diffèrent → mise à jour conditionnelle
  //       let updated = false;

  //       const newPrixAffiche = Number(getExcelValue(row, "prix affiche", excelColsMap));
  //       const newDernierPrix = Number(getExcelValue(row, "dernier prix", excelColsMap));
  //       const newPrixAchat = Number(getExcelValue(row, "prix achat", excelColsMap));
  //       const newEmplacement = getExcelValue(row, "emplacement", excelColsMap);

  //       if (newPrixAffiche && newPrixAffiche !== existingProduct.prix_affiche) {
  //         existingProduct.prix_affiche = newPrixAffiche;
  //         updated = true;
  //       }
  //       if (newDernierPrix && newDernierPrix !== existingProduct.dernier_prix) {
  //         existingProduct.dernier_prix = newDernierPrix;
  //         updated = true;
  //       }
  //       if (newPrixAchat && newPrixAchat !== existingProduct.prix_achat) {
  //         existingProduct.prix_achat = newPrixAchat;
  //         updated = true;
  //       }
  //       if (newEmplacement && newEmplacement !== existingProduct.emplacement) {
  //         existingProduct.emplacement = newEmplacement;
  //         updated = true;
  //       }

  //       if (updated || newQuantity > 0) {
  //         await this.stockRepo.save(existingProduct);
  //       }

  //       savedProducts.push(existingProduct);
  //       continue; // ⬅️ pas de doublon
  //     }

  //     // ✅ Création d’un nouveau produit si non trouvé
  //     if (prodFamily.length) {
  //       const lastProdFamily = prodFamily.find(item =>
  //         item.level_name.toLowerCase().trim() == "serie"
  //       );

  //       const product = this.stockRepo.create({
  //         ...stockDto,
  //         code_barre: getExcelValue(row, "code barre", excelColsMap),
  //         code_items: codeItems,
  //         designation: designation,
  //         marque_produit: getExcelValue(row, "marque_produit", excelColsMap),
  //         categorie: getExcelValue(row, "categorie", excelColsMap),
  //         quantite: Number(getExcelValue(row, "quantite", excelColsMap)) || 0,
  //         prix_affiche: Number(getExcelValue(row, "prix affiche", excelColsMap)) || 0,
  //         dernier_prix: Number(getExcelValue(row, "dernier prix", excelColsMap)) || 0,
  //         prix_achat: Number(getExcelValue(row, "prix achat", excelColsMap)) || 0,
  //         emplacement: getExcelValue(row, "emplacement", excelColsMap),
  //         family: lastProdFamily,
  //         admin: null as any,
  //       });

  //       savedProducts.push(await this.stockRepo.save(product));
  //     }
  //   }

  //   // ✅ Nettoyage fichier temporaire
  //   fs.unlinkSync(file.path);

  //   // ✅ Export des lignes ignorées
  //   let ignoredFilePath = '';
  //   if (excelEmpty.length > 0) {
  //     const exportDir = path.join(__dirname, '..', '..', 'public', 'exports');
  //     if (!fs.existsSync(exportDir)) {
  //       fs.mkdirSync(exportDir, { recursive: true });
  //     }

  //     const normalizedIgnoredRows = excelEmpty.map(row => {
  //       const excelColsMap = new Map<string, string>();
  //       for (const col of Object.keys(row)) {
  //         if (!col || typeof col !== 'string') continue;
  //         excelColsMap.set(applySynonym(col), col);
  //       }
  //       const normalizedRow: Record<string, any> = {};
  //       for (const col of colonnesImportantes) {
  //         normalizedRow[col] = getExcelValue(row, col, excelColsMap) || '';
  //       }
  //       return normalizedRow;
  //     });

  //     const exportFileName = `lignes_ignorées_${Date.now()}.xlsx`;
  //     ignoredFilePath = path.join(exportDir, exportFileName);

  //     const worksheet = XLSX.utils.json_to_sheet(normalizedIgnoredRows);
  //     const workbookExport = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbookExport, worksheet, "Lignes ignorées");
  //     XLSX.writeFile(workbookExport, ignoredFilePath);
  //   }

  //   return {
  //     message: `${savedProducts.length} produits importés/mis à jour avec succès.`,
  //     produits: savedProducts,
  //     lignes_ignorees: excelEmpty.length,
  //     fichier_vide: ignoredFilePath ? `/exports/${path.basename(ignoredFilePath)}` : null,
  //     remarque: excelEmpty.length > 0
  //       ? `Certains produits n'ont pas été importés à cause de cellules vides. Veuillez remplir ces champs puis réimporter le fichier corrigé.`
  //       : null
  //   };
  // }



  //   async importFromExcel(file: Express.Multer.File, stockDto: CreateStockDto) {

  //   // const null as any = await this.persoRepo.findOneBy({ id: +stockDto.admin });
  //   // if (!null as any) throw new NotFoundException("Personne id not found");

  //   let workbook: XLSX.WorkBook;
  //   try {
  //     workbook = XLSX.readFile(file.path);
  //   } catch (err) {
  //     throw new BadRequestException("Fichier Excel invalide ou illisible");
  //   }

  //   if (!workbook.SheetNames?.length) {
  //     throw new BadRequestException("Le fichier Excel ne contient aucune feuille");
  //   }

  //   const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //   const data: any[] = XLSX.utils.sheet_to_json(worksheet);
  //   const savedProducts: Stock[] = [];
  //   const excelEmpty: any[] = [];

  //   const colonnesImportantes = [
  //     "code barre", "code items", "designation", "categorie", "quantite",
  //     "prix affiche", "dernier prix", "prix achat", "emplacement",
  //     "origines", "marque", "model", "serie", "marque produit"
  //   ];

  //   const synonymMapping: Record<string, string> = {
  //     model: 'modele',
  //     modele: 'modele',
  //     'marqueproduit': 'marque_produit',
  //     origin: 'origines',
  //     origine: 'origines',
  //   };

  //   const normalize = (str: any): string => {
  //     if (typeof str !== 'string') return '';
  //     return str
  //       .normalize("NFD")
  //       .replace(/[\u0300-\u036f]/g, '')
  //       .toLowerCase()
  //       .replace(/\s|_/g, '')
  //       .trim();
  //   };

  //   const applySynonym = (key: string): string => {
  //     const safeKey = normalize(key);
  //     return synonymMapping[safeKey] || safeKey;
  //   };

  //   const getExcelValue = (row: any, colName: string, map: Map<string, string>): any => {
  //     const normalized = applySynonym(colName);
  //     const originalCol = map.get(normalized);
  //     return originalCol ? row[originalCol] : undefined;
  //   };

  //   const allLevel = await this.levelRepo.find();

  //   for (const row of data) {
  //     const excelColsMap = new Map<string, string>();
  //     for (const col of Object.keys(row)) {
  //       if (!col || typeof col !== 'string') continue;
  //       excelColsMap.set(applySynonym(col), col);
  //     }

  //     const colonnesVides: string[] = [];

  //     for (const col of colonnesImportantes) {
  //       const valeur = getExcelValue(row, col, excelColsMap);
  //       if (valeur === undefined || valeur === null || valeur === '') {
  //         colonnesVides.push(col);
  //       }
  //     }

  //     if (colonnesVides.length > 0) {
  //       excelEmpty.push(row);
  //       continue;
  //     }

  //     const rowOrigine = getExcelValue(row, "origines", excelColsMap);
  //     let origine = await this.originRepo.findOneBy({ pays: rowOrigine });
  //     if (!origine || normalize(origine.pays) !== normalize(rowOrigine)) {
  //       origine = await this.originRepo.save({ pays: rowOrigine, admin: null as any });
  //     }

  //     let prodFamily: ProductFamily[] = [];
  //     for (const level of allLevel) {
  //       const normLevel = applySynonym(level.level);
  //       const originalCol = excelColsMap.get(normLevel);

  //       if (originalCol && row[originalCol]) {
  //         const setFamily = this.familyRepo.create({
  //           family_name: row[originalCol],
  //           level: level.id,
  //           admin: null as any,
  //           origine: origine.id
  //         });

  //         const saveFamily = await this.familyService.create(setFamily as CreateProductFamilyDto);
  //         const parent = saveFamily.level_name.toLowerCase().trim() == "marque_produit" ? null :(saveFamily.level_name.toLowerCase().trim() == "marque" ? prodFamily.find(item => item.level_name.toLowerCase().trim() == "marque_produit")?.id : (
  //           saveFamily.level_name.toLowerCase().trim() == "modele" ? 
  //           prodFamily.find(item => item.level_name.toLowerCase().trim() == "marque")?.id : 
  //           (saveFamily.level_name.toLowerCase().trim() == "serie" ?
  //           prodFamily.find(item => item.level_name.toLowerCase().trim() == "modele")?.id :
  //           prodFamily.find(item => item.level_name.toLowerCase().trim() == "serie")?.id
  //         )))

  //         await this.familyRepo.update(saveFamily.id, {parent: parent as any})
  //         prodFamily.push(saveFamily);
  //       }
  //     }

  //     if (prodFamily.length) {
  //       const lastProdFamily = prodFamily.find(item =>
  //         item.level_name.toLowerCase().trim() == "serie"
  //       );

  //       const product = this.stockRepo.create({
  //         ...stockDto,
  //         code_barre: getExcelValue(row, "code barre", excelColsMap),
  //         code_items: getExcelValue(row, "code items", excelColsMap),
  //         designation: getExcelValue(row, "designation", excelColsMap),
  //         marque_produit: getExcelValue(row, "marque_produit", excelColsMap),
  //         categorie: getExcelValue(row, "categorie", excelColsMap),
  //         quantite: Number(getExcelValue(row, "quantite", excelColsMap)) || 0,
  //         prix_affiche: Number(getExcelValue(row, "prix affiche", excelColsMap)) || 0,
  //         dernier_prix: Number(getExcelValue(row, "dernier prix", excelColsMap)) || 0,
  //         prix_achat: Number(getExcelValue(row, "prix achat", excelColsMap)) || 0,
  //         emplacement: getExcelValue(row, "emplacement", excelColsMap),
  //         family: lastProdFamily,
  //         admin: null as any,
  //       });



  //       savedProducts.push(await this.stockRepo.save(product));
  //     }
  //   }

  //   fs.unlinkSync(file.path);

  //   let ignoredFilePath = '';
  //   if (excelEmpty.length > 0) {
  //     const exportDir = path.join(__dirname, '..', '..', 'public', 'exports');
  //     if (!fs.existsSync(exportDir)) {
  //       fs.mkdirSync(exportDir, { recursive: true });
  //     }

  //     const normalizedIgnoredRows = excelEmpty.map(row => {
  //       const excelColsMap = new Map<string, string>();
  //       for (const col of Object.keys(row)) {
  //         if (!col || typeof col !== 'string') continue;
  //         excelColsMap.set(applySynonym(col), col);
  //       }

  //       const normalizedRow: Record<string, any> = {};
  //       for (const col of colonnesImportantes) {
  //         normalizedRow[col] = getExcelValue(row, col, excelColsMap) || '';
  //       }

  //       return normalizedRow;
  //     });

  //     const exportFileName = `lignes_ignorées_${Date.now()}.xlsx`;
  //     ignoredFilePath = path.join(exportDir, exportFileName);

  //     const worksheet = XLSX.utils.json_to_sheet(normalizedIgnoredRows);
  //     const workbookExport = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbookExport, worksheet, "Lignes ignorées");

  //     XLSX.writeFile(workbookExport, ignoredFilePath);
  //   }

  //   return {
  //     message: `${savedProducts.length} produits importés avec succès.`,
  //     produits: savedProducts,
  //     lignes_ignorees: excelEmpty.length,
  //     fichier_vide: ignoredFilePath
  //       ? `/exports/${path.basename(ignoredFilePath)}`
  //       : null,
  //     remarque: excelEmpty.length > 0
  //       ? `Certains produits n'ont pas été importés à cause de cellules vides. Veuillez remplir ces champs puis réimporter le fichier corrigé.`
  //       : null
  //   };
  // }


  async remove(id: number) {
    try {
      await this.stockRepo.delete(id)
      return "deleted"
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
