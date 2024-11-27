import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { Owner, Pet } from '../../pets/domain';
import { FileService } from './file.service';
@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private fileService = inject(FileService);

  async generateOwnerSheet() {}

  async generatePetSheet(owner: Owner, pets: Pet[]) {
    const backgroundImage = await this._getFileAsBase64('/images/banner.jpg');
    const headerImage = await this._getFileAsBase64('/images/institution.jpeg');
    const sloganImage = await this._getFileAsBase64('/images/slogan.png');
    const petImages = await Promise.all(
      pets.map((pet) => (pet.image ? this._getFileAsBase64(pet.image) : null))
    );
    const docDefinition: TDocumentDefinitions = {
      header: {
        margin: [20, 20, 20, 40],
        columns: [
          {
            image: headerImage,
            width: 120,
          },
          {
            width: '*',
            alignment: 'center',
            stack: [
              {
                text: 'Secretaría Municipal de Salud',
                bold: true,
                fontSize: 18,
              },
              { text: 'Centro Municipal de Zoonosis', fontSize: 16 },
              { text: 'Registro Unico de Mascotas Sacaba' },
            ],
          },
          {
            image: sloganImage,
            width: 120,
          },
        ],
      },
      footer: {
        margin: [0, 0, 20, 0],
        alignment: 'right',
        fontSize: 10,
        text: `Generado el ${new Date().toLocaleString()}`,
      },

      background: function (_, pageSize) {
        return {
          image: backgroundImage,
          alignment: 'center',
          opacity: 0.25,
          width: 500,
          absolutePosition: { y: pageSize.height / 4 },
        };
      },
      pageSize: 'LETTER',
      pageMargins: [30, 100, 30, 30],
      content: [
        ...pets.map<Content[]>((pet, index) => [
          { text: 'DATOS GENERALES DEL PROPIETARIO', bold: true },
          {
            marginBottom: 10,
            canvas: [
              { type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 },
            ],
          },
          {
            marginBottom: 40,
            columns: [
              {
                width: '*',
                table: {
                  body: [
                    [{ text: 'NOMBRE:', bold: true }, owner.fullname],
                    [{ text: 'DIRECCION:', bold: true }, owner.address],
                    [{ text: 'DISTRITO:', bold: true }, owner.district.name],
                  ],
                },
                layout: 'noBorders',
              },
              {
                width: 200,
                table: {
                  body: [
                    [{ text: 'NRO. CI:', bold: true }, owner.dni],
                    [{ text: 'TELEFONO:', bold: true }, owner.phone],
                  ],
                },
                layout: 'noBorders',
              },
            ],
          },
          { text: 'DATOS DE LA MASCOTA', bold: true },
          {
            marginBottom: 10,
            canvas: [
              { type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 },
            ],
          },
          {
            columns: [
              {
                width: 220,
                alignment: 'center',
                stack: [
                  {
                    ...(petImages[index]
                      ? { width: 200, height: 200, image: petImages[index] }
                      : {
                          width: 200,
                          height: 200,
                          canvas: [
                            {
                              type: 'rect',
                              x: 0,
                              y: 0,
                              w: 200,
                              h: 200,
                              lineWidth: 1,
                            },
                          ],
                        }),
                  },
                  {
                    text: `CODIGO: ${pet.code}`,
                    bold: true,
                    alignment: 'center',
                    marginTop: 5,
                  },
                ],
              },
              { width: 10, text: '' },
              {
                width: '*',
                columns: [
                  {
                    width: '*',
                    fontSize: 10,
                    table: {
                      widths: [120, '*'],
                      body: [
                        [{ text: 'NOMBRE:', bold: true }, pet.name],
                        [{ text: 'COLOR:', bold: true }, pet.color],
                        [{ text: 'ESPECIE:', bold: true }, pet.breed.species],
                        [{ text: 'RAZA:', bold: true }, pet.breed.name],
                        [
                          { text: 'MACHO/HEMBRA:', bold: true },
                          pet.sex.toUpperCase(),
                        ],
                        [
                          { text: 'NACIMIENTO:', bold: true },
                          pet.birthDate?.toLocaleDateString() ?? '----',
                        ],
                        [
                          { text: 'ESTERILIZADO:', bold: true },
                          pet.is_neutered ? 'SI' : 'NO',
                        ],
                        [
                          { text: 'FECHA ESTERILIZACIÓN:', bold: true },
                          pet.neuter_date?.toDateString() ?? '----',
                        ],
                        [{ text: 'DESCRIPCION:', bold: true }, pet.description],
                      ],
                    },
                    layout: 'noBorders',
                  },
                ],
              },
            ],
          },
          // TODO ADD PET HISTORY TABLE
          {
            style: 'tableExample',
            margin: [70, 200, 80, 0],
            table: {
              heights: [70, 10],
              widths: [200, 200],
              body: [
                ['', ''],
                [
                  { text: owner.fullname.toUpperCase(), alignment: 'center' },
                  {
                    text: 'Firma y sello de quien recibe',
                    alignment: 'center',
                  },
                ],
              ],
            },
            ...(index < pets.length - 1 && { pageBreak: 'after' }),
          },
        ]),
      ],
    };
    pdfMake.createPdf(docDefinition).print();
  }

  generateTreatmentSheet() {
    const def: TDocumentDefinitions = {
      pageSize: 'A5',
      pageMargins: [20, 30, 20, 30],
      content: [
        {
          text: 'Carnet de Vacunación',
          style: 'header',
          alignment: 'center',
          margin: [0, 20, 0, 20],
        },
        {
          text: 'Nombre de la Mascota: [Nombre]',
          style: 'subheader',
          margin: [0, 10, 0, 5],
        },
        {
          text: 'Raza: [Raza]',
          style: 'subheader',
          margin: [0, 10, 0, 5],
        },
        {
          text: 'Vacunas Administradas:',
          style: 'subheader',
          margin: [0, 10, 0, 5],
        },
        {
          ul: [
            '1. [Vacuna 1] - [Fecha]',
            '2. [Vacuna 2] - [Fecha]',
            // Agrega más vacunas según sea necesario
          ],
          margin: [0, 5, 0, 5],
        },
      ],
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          color: '#4A90E2', // Color del texto
          margin: [0, 20, 0, 20],
        },
        subheader: {
          fontSize: 18,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        paragraph: {
          fontSize: 14,
          margin: [0, 5, 0, 5],
        },
      },
      footer: function (currentPage, pageCount) {
        return {
          text: 'Página ' + currentPage + ' de ' + pageCount,
          alignment: 'center',
          margin: [0, 10, 0, 0],
        };
      },
    };
    pdfMake.createPdf(def).print();
  }

  private async _getFileAsBase64(url: string): Promise<string> {
    const blob = await lastValueFrom(this.fileService.getFile(url));
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }
}
