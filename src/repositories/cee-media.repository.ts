import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {CeeMedia, CeeMediaRelations} from '../models';

export class CeeMediaRepository extends DefaultCrudRepository<
  CeeMedia,
  typeof CeeMedia.prototype.id,
  CeeMediaRelations
> {
  constructor(
    @inject('datasources.postgresql') dataSource: PostgresqlDataSource,
  ) {
    super(CeeMedia, dataSource);
  }

  async getAllInHierarchy() {
    const query = `
      WITH RECURSIVE HierarchicalData AS (
          SELECT id, title, description, parentid, id AS rootparentid, identifier, identifierType, resource, type, thumbnail, collection, createdat, 1 as level, id::text AS path
          FROM ceemedia
          WHERE parentid IS NULL

          UNION ALL

          SELECT t.id, t.title, t.description, t.parentid, h.rootparentid, t.identifier, t.identifierType, t.resource, t.type, t.thumbnail, t.collection, t.createdat, h.level + 1, h.path || '/' || LPAD(t.id::text, 10, '0')
          FROM ceemedia t
          INNER JOIN HierarchicalData h ON t.parentid = h.id
      )
      SELECT hd.id, hd.title, hd.description, hd.parentid, hd.rootparentid, hd.identifier, hd.identifierType, hd.resource, hd.type, hd.thumbnail, hd.collection, hd.createdat, hd.level
      FROM HierarchicalData as hd
      ORDER BY path, (SELECT createdat FROM ceemedia WHERE id = hd.id)
    `;
    const result = await this.dataSource.execute(query);
    return result;
  }

  async findOneInHierarchy(id: string) {
    const query = `
      WITH RECURSIVE HierarchicalData AS (
          SELECT id, title, parentid, id AS rootparentid, identifier, identifierType, resource, type, thumbnail, collection, createdat, 1 as level, id::text AS path
          FROM ceemedia
          WHERE parentid IS NULL

          UNION ALL

          SELECT t.id, t.title, t.parentid, h.rootparentid, t.identifier, t.identifierType, t.resource, t.type, t.thumbnail, t.collection, t.createdat, h.level + 1, h.path || '/' || LPAD(t.id::text, 10, '0')
          FROM ceemedia t
          INNER JOIN HierarchicalData h ON t.parentid = h.id
      )
      SELECT hd.id, hd.title, hd.parentid, hd.rootparentid, hd.identifier, hd.identifierType, hd.resource, hd.type, hd.thumbnail, hd.collection, hd.createdat, hd.level
      FROM HierarchicalData as hd
      WHERE hd.id = '${id}'
      ORDER BY path, (SELECT createdat FROM ceemedia WHERE id = hd.id)
    `;
    const result = await this.dataSource.execute(query);
    if (result.length === 0) {
      return null;
    } else {
      return result[0];
    }
  }

  async findAllCollections() {
    const query = `SELECT collection FROM ceemedia WHERE collection != 'null' GROUP BY collection ORDER BY collection`;
    const result = await this.dataSource.execute(query);
    return result.map((item: any) => item.collection);
  }

  async getAllIdsToList() {
    const query = `
      WITH RECURSIVE HierarchicalData AS (
            SELECT id, title, description, parentid, id AS rootparentid, identifier, identifierType, resource, type, thumbnail, collection, createdat, 1 as level, id::text AS path
            FROM ceemedia
            WHERE parentid IS NULL

            UNION ALL

            SELECT t.id, t.title, t.description, t.parentid, h.rootparentid, t.identifier, t.identifierType, t.resource, t.type, t.thumbnail, t.collection, t.createdat, h.level + 1, h.path || '/' || LPAD(t.id::text, 10, '0')
            FROM ceemedia t
            INNER JOIN HierarchicalData h ON t.parentid = h.id
        )
        SELECT hd.id, hd.title, hd.description, hd.parentid, hd.rootparentid, hd.identifier, hd.identifierType, hd.resource, hd.type, hd.thumbnail, hd.collection, hd.createdat, hd.level
        FROM HierarchicalData AS hd
      LEFT JOIN ceemediacee AS cmr ON cmr.ceemediaid = hd.id
        WHERE cmr.ceeid IS NULL
      ORDER BY path, (SELECT createdat FROM ceemedia WHERE id = hd.id)
    `;
    const result = await this.dataSource.execute(query);
    return result;
  }
}
