import { TestBed } from '@angular/core/testing';

import { ProfessorChoicesService } from './professor-choices.service';

describe('ProfessorChoicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfessorChoicesService = TestBed.get(ProfessorChoicesService);
    expect(service).toBeTruthy();
  });
});
