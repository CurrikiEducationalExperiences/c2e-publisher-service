import {Entity, model, property} from '@loopback/repository';

@model()
export class CeeMediaCee extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  ceeMediaId: string;

  @property({
    type: 'string',
    required: true,
  })
  ceeId: string;


  constructor(data?: Partial<CeeMediaCee>) {
    super(data);
  }
}

export interface CeeMediaCeeRelations {
  // describe navigational properties here
}

export type CeeMediaCeeWithRelations = CeeMediaCee & CeeMediaCeeRelations;
