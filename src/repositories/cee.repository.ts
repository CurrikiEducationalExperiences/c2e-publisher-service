import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {Cee, CeeRelations} from '../models';

export class CeeRepository extends DefaultCrudRepository<
  Cee,
  typeof Cee.prototype.id,
  CeeRelations
> {
  constructor(
    @inject('datasources.postgresql') dataSource: PostgresqlDataSource,
  ) {
    super(Cee, dataSource);
  }
}
