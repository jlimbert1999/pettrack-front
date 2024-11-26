import { Injectable } from '@angular/core';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { convertImageABase64 } from '../../../helpers';
import { Owner } from '../../pets/domain';
@Injectable({
  providedIn: 'root',
})
export class PdfService {
  async generatePetSheet(owner: Owner) {
    const backgroundImage = await convertImageABase64('/images/pet-banner.png');
    const docDefinition: TDocumentDefinitions = {
      header: {
        margin: [20, 20, 20, 40],
        columns: [
          {
            image: await convertImageABase64('/images/institution.jpeg'),
            width: 120,
          },
          {
            width: '*',
            alignment: 'center',
            stack: [
              {
                text: 'Centro de Zoonosis Municipal',
                bold: true,
                fontSize: 18,
              },
              { text: 'Hoja de registro' },
            ],
          },
          { text: new Date().toLocaleString(), fontSize: 11, width: 150 },
        ],
      },

      background: function (_, pageSize) {
        return {
          image: backgroundImage,
          alignment: 'center',
          opacity: 0.25,
          width: 350,
          absolutePosition: { y: pageSize.height / 4 },
        };
      },
      pageSize: 'LETTER',
      pageMargins: [30, 100, 30, 30],
      content: [
        ...owner.pets.map<Content[]>((pet, index) => [
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
                width: '*',
                table: {
                  widths: [80, '*'],
                  body: [
                    [{ text: 'NOMBRE:', bold: true }, pet.name],
                    [{ text: 'CODIGO:', bold: true }, pet.code],
                    [{ text: 'COLOR:', bold: true }, pet.color],
                    [{ text: 'ESPECIE:', bold: true }, pet.breed.species],
                    [{ text: 'RAZA:', bold: true }, pet.breed.name],
                  ],
                },
                layout: 'noBorders',
              },
              {
                width: '*',
                table: {
                  body: [
                    [
                      { text: 'NACIMIENTO:', bold: true },
                      pet.birthDate.toLocaleDateString(),
                    ],
                    [
                      { text: 'ESTERILIZADO:', bold: true },
                      pet.is_neutered ? 'SI' : 'NO',
                    ],
                    [
                      { text: 'FECHA ESTERILIZACIÓN:', bold: true },
                      pet.neuter_date?.toLocaleDateString() ??
                        'Sin esterilizar',
                    ],
                    [{ text: 'MACHO / HEMBRA:', bold: true }, pet.sex],
                  ],
                },
                layout: 'noBorders',
              },
            ],
          },
          { text: 'DESCRIPCION:', bold: true, marginTop: 8 },
          { text: pet.description },
          {
            style: 'tableExample',
            margin: [70, 200, 80, 0],
            table: {
              heights: [70, 10],
              widths: [200, 200],
              body: [
                ['', ''],
                [
                  { text: owner.fullname, alignment: 'center' },
                  {
                    text: 'Firma y sello de quien recibe',
                    alignment: 'center',
                  },
                ],
              ],
            },
            ...(index < owner.pets.length - 1 && { pageBreak: 'after' }),
          },
        ]),
      ],
    };
    pdfMake.createPdf(docDefinition).print();
  }

  generateTreatmentSheet() {
    const def: TDocumentDefinitions = {
      pageSize: 'A5', // Tamaño de página A5
      pageMargins: [20, 30, 20, 30], // Margen de la página
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
}
