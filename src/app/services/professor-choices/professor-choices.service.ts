import { Injectable } from '@angular/core';
import data from '../../../assets/prof_names.json';

@Injectable({
  providedIn: 'root'
})
export class ProfessorChoicesService {
  constructor() {}

  getNames(): string[] {
    return data.names;
  }
}
