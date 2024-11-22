import { Injectable } from '@angular/core';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  generatePetSheet() {
    const docDefinition: TDocumentDefinitions = {
      header: [
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              width: 'auto',
              text: 'First column',
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              width: '*',
              text: 'Second column',
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
