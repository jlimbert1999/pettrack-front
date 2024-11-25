import { Injectable } from '@angular/core';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Pet } from '../../pets/domain';
import { convertImageABase64 } from '../../../helpers';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  async generatePetSheet() {
    const docDefinition: TDocumentDefinitions = {
      header: [
        {
          // margin: [20, 20, 20, 20],
          columns: [
            {
              // auto-sized columns have their widths based on their content
              image: await convertImageABase64('/images/institution.jpg'),
              width: 80,
            },
            { width: 100, text: 'dsds' },
            {
              image: await convertImageABase64('/images/institution.jpg'),
              width: 50,
            },
          ],
        },
      ],
      pageSize: 'LETTER',
      content: [],
    };
    pdfMake.createPdf(docDefinition).print();
  }
}
