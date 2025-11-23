import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient, HttpParams } from '@angular/common/http';

import { from, map, mergeMap, of, switchMap, toArray } from 'rxjs';

import { owner, OwnerMapper, PetMapper } from '../../infrastructure';
import { environment } from '../../../../environments/environment';
import { compressImage } from '../../../../helpers';
import { FileService } from '../../../shared';

interface PetUpdloadProps {
  id?: string;
  file?: File;
  image: string | null;
  form: Object;
}
@Injectable({
  providedIn: 'root',
})
export class OwnersService {
  private http = inject(HttpClient);
  private fileService = inject(FileService);
  private readonly url = `${environment.apiUrl}/owners`;

  districts = toSignal(this.getDistricts(), { initialValue: [] });

  create(form: Object, pets: PetUpdloadProps[]) {
    return this.createFileUploadTask(pets).pipe(
      switchMap((petList) =>
        this.http.post<owner>(this.url, { ...form, pets: petList }).pipe(
          map((resp) => ({
            owner: OwnerMapper.fromResponse(resp),
            pets: resp.pets.map((pet) => PetMapper.fromResponse(pet)),
          }))
        )
      )
    );
  }

  update(ownerId: string, form: Object, pets: PetUpdloadProps[]) {
    return this.createFileUploadTask(pets).pipe(
      switchMap((petList) =>
        this.http
          .patch<owner>(`${this.url}/${ownerId}`, { ...form, pets: petList })
          .pipe(
            map((resp) => ({
              owner: OwnerMapper.fromResponse(resp),
              pets: resp.pets.map((pet) => PetMapper.fromResponse(pet)),
            }))
          )
      )
    );
  }

  findAll(limit: number, offset: number, term?: string) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
    });
    return this.http
      .get<{ owners: owner[]; length: number }>(this.url, { params })
      .pipe(
        map(({ owners, length }) => ({
          data: owners.map((resp) => ({
            owner: OwnerMapper.fromResponse(resp),
            pets: resp.pets.map((pet) => PetMapper.fromResponse(pet)),
          })),
          length,
        }))
      );
  }

  private createFileUploadTask(pets: PetUpdloadProps[]) {
    const CONCURRENCY = 2;
    return from(pets).pipe(
      mergeMap(({ id, file, image, form }) => {
        if (!file) {
          return of({
            ...form,
            id,
            image: image ? image.split('/').pop() : null,
          });
        }
        return from(compressImage(file)).pipe(
          switchMap((compressed) => this.fileService.uploadFile(compressed)),
          map(({ filename }) => ({
            ...form,
            id,
            image: filename,
          }))
        );
      }, CONCURRENCY),
      toArray()
    );
  }

  private getDistricts() {
    return this.http
      .get<{ id: number; name: string }[]>(`${this.url}/districts`)
      .pipe(
        map((resp) => resp.map(({ id, name }) => ({ value: id, text: name })))
      );
  }
}
