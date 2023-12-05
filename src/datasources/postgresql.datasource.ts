import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const host = process.env.POSTGRESQL_HOST;
const port = process.env.POSTGRESQL_PORT;
const user = process.env.POSTGRESQL_USER;
const password = process.env.POSTGRESQL_PASSWORD;
const database = process.env.POSTGRESQL_DATABASE;
const name = 'postgresql';
const connector = 'postgresql';
const url = `postgres://${user}:${password}@${host}:${port}/${database}`;
const config = {name, connector, url, host, port, user, password, database};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PostgresqlDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'postgresql';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.postgresql', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
