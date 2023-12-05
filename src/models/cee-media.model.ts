import {Entity, model, property} from '@loopback/repository';

@model()
export class CeeMedia extends Entity {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuid',
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
    required: true,
  })
  resource: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  createdAt?: string;

  @property({
    type: 'date'
  })
  updatedAt?: string;

  // parent property with null default value
  @property({
    type: 'string'
  })
  parentId?: string;

  // owner property
  @property({
    type: 'string'
  })
  ownerId: string;

  //identifierType property with null default value
  @property({
    type: 'string'
  })
  identifierType?: string;

  //identifierValue property with null default value
  @property({
    type: 'string'
  })
  identifier?: string;

  //thumbnail property with null default value
  @property({
    type: 'string'
  })
  thumbnail?: string;

  //thumbnail property with null default value
  @property({
    type: 'string'
  })
  collection?: string;

  constructor(data?: Partial<CeeMedia>) {
    super(data);
  }
}

export interface CeeMediaRelations {
  // describe navigational properties here
}

export type CeeMediaWithRelations = CeeMedia & CeeMediaRelations;
