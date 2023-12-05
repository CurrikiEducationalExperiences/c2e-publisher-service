import {Entity, model, property} from '@loopback/repository';

@model()
export class Cee extends Entity {
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
    type: 'object',
    postgresql: {
      dataType: 'jsonb',
    },
  })
  manifest?: object;

  @property({
    type: 'string'
  })
  type?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt?: string;

  constructor(data?: Partial<Cee>) {
    super(data);
  }
}

export interface CeeRelations {
  // describe navigational properties here
}

export type CeeWithRelations = Cee & CeeRelations;
