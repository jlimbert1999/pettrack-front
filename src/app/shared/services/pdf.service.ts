import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Platform } from '@angular/cdk/platform';

import { AuthService } from '../../auth/presentation/services/auth.service';
import { treatment } from '../../pets/infrastructure';
import { Owner, Pet } from '../../pets/domain';
import { FileService } from './file.service';
import { environment } from '../../../environments/environment';

interface petDetailProps {
  pet: Pet;
  treatments: treatment[];
}
@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private fileService = inject(FileService);
  private user = inject(AuthService).user();
  private platform = inject(Platform);

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
    const qrData = `${environment.queryUrl}`;
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
      background: function () {
        return {
          image: backgroundImage,
          alignment: 'center',
          opacity: 0.2,
          width: 400,
          height: 150,
          marginTop: 60,
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
                          pet.neuter_date?.toLocaleDateString() ?? '',
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
          {
            text: 'LISTADO DE TRATAMIENTOS',
            marginTop: 20,
            marginBottom: 10,
            bold: true,
          },
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
            margin: [10, 80, 10, 0],
            ...(index < details.length - 1 && { pageBreak: 'after' }),
            columns: [
              {
                qr: `${qrData}/${pet.id}`,
                fit: 75,
              },
              {
                stack: [
                  {
                    fontSize: 10,
                    alignment: 'right',
                    text: `Fecha: ${new Date().toLocaleString()}`,
                  },
                  {
                    fontSize: 10,
                    alignment: 'right',
                    text: `Generado por: ${
                      this.user?.fullname.toUpperCase() ?? ''
                    }`,
                  },
                ],
                width: '*',
                margin: [0, 40, 0, 0],
              },
            ],
          },
        ]),
      ],
    };

    if (this.platform.ANDROID || this.platform.IOS) {
      pdfMake
        .createPdf(docDefinition)
        .download(
          `${owner.fullname.toUpperCase()} - ${
            owner.dni
          } (Hoja de registro RUM).pdf`
        ); // más seguro en móvil
    } else {
      pdfMake.createPdf(docDefinition).print(); // en escritorio
    }
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
