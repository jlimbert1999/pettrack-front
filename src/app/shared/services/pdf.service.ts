import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { Owner, Pet } from '../../pets/domain';
import { FileService } from './file.service';
import { treatment } from '../../pets/infrastructure';

interface petDetailProps {
  pet: Pet;
  treatments: treatment[];
}
@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private fileService = inject(FileService);

  async generatePetSheet(owner: Owner, details: petDetailProps[]) {
    const backgroundImage = await this._getFileAsBase64(
      '/images/banner-2.jpeg'
    );
    const headerImage = await this._getFileAsBase64('/images/institution.jpeg');
    const sloganImage = await this._getFileAsBase64('/images/slogan.png');
    const petImages = await Promise.all(
      details.map(({ pet }) =>
        pet.image ? this._getFileAsBase64(pet.image) : null
      )
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
          absolutePosition: { y: pageSize.height / 2.4 },
        };
      },
      pageSize: 'LETTER',
      pageMargins: [30, 100, 30, 30],
      content: [
        ...details.map<Content[]>(({ pet, treatments }, index) => [
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
          { text: 'Listado de tratamientos', marginTop: 20, marginBottom: 5 },
          {
            fontSize: 10,
            table: {
              dontBreakRows: true,
              headerRows: 1,
              widths: [100, 150, 100, '*'],
              body: [
                ['Tratamiento', 'Nombre', 'Fecha', 'Lugar'],
                ...(treatments.length === 0
                  ? [['Sin registros', '', '', '']] // Si no hay tratamientos, muestra "Sin registros"
                  : treatments.map((treatment) => [
                      treatment.typeTreatment.category,
                      treatment.typeTreatment.name,
                      new Date(treatment.date).toLocaleDateString(),
                      treatment.medicalCenter.name,
                    ])),
              ],
            },
            layout: 'lightHorizontalLines',
          },
          {
            style: 'tableExample',
            margin: [70, 40, 80, 0],
            table: {
              heights: [70, 10],
              widths: [200, 200],
              dontBreakRows: true,
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
            ...(index < details.length - 1 && { pageBreak: 'after' }),
          },
        ]),
      ],
    };
    pdfMake.createPdf(docDefinition).print();
  }

  async generateCredential(pet: Pet) {
    const photo = await this._getFileAsBase64(
      pet.image ?? '/images/no-image.jpg'
    );
    const qr = `http://10.0.38.30:55600/pets/${pet.id}`;
    const def: TDocumentDefinitions = {
      pageSize: { width: 400, height: 250 },
      pageMargins: [10, 10, 10, 10],
      content: [
        {
          text: 'REGISTRO UNICO DE MASCOTAS',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 5],
        },
        {
          text: 'DATOS GENERALES',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            {
              // Imagen de la mascota
              image: photo, // Aquí coloca el string base64 de tu imagen
              width: 120,
              height: 120,
            },
            {
              // Información del carnet
              margin: [10, 0, 0, 0],
              stack: [
                { text: `CODIGO ${pet.code}`, style: 'important' },
                {
                  text: `FECHA REGISTRO ${pet.createdAt.toLocaleString()}`,
                  style: 'important',
                },
                { text: `NOMBRE: ${pet.name}`, style: 'info' },
                {
                  text: `${pet.breed.species} - ${pet.breed.name}`,
                  style: 'info',
                },
                { text: `${pet.owner?.fullname}`, style: 'info' },
              ],
            },
            {
              // Código QR y segunda imagen pequeña
              stack: [
                {
                  text: '',
                  margin: [0, 0, 0, 10],
                },
                {
                  qr: qr, // Reemplaza con el contenido del QR
                  fit: 80,
                  alignment: 'center',
                },
              ],
            },
          ],
        },
        {
          text: `En caso de perdida llamar a ${pet.owner?.phone}`,
          style: 'emergency',
          margin: [0, 10, 0, 0],
        },
      ],
      styles: {
        header: {
          fontSize: 12,
          bold: true,
          color: 'green',
        },
        subheader: {
          fontSize: 18,
          bold: true,
          color: 'green',
        },
        important: {
          fontSize: 10,
          bold: true,
          color: 'red',
        },
        info: {
          fontSize: 10,
          bold: true,
        },
        emergency: {
          fontSize: 8,
          color: 'red',
          alignment: 'center',
        },
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
