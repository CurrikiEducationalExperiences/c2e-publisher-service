import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {CeeMediaCee, CeeMediaCeeRelations} from '../models';

export class CeeMediaCeeRepository extends DefaultCrudRepository<
  CeeMediaCee,
  typeof CeeMediaCee.prototype.id,
  CeeMediaCeeRelations
> {
  constructor(
    @inject('datasources.postgresql') dataSource: PostgresqlDataSource,
  ) {
    super(CeeMediaCee, dataSource);
  }
}
