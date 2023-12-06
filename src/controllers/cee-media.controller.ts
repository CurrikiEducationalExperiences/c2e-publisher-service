import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response
} from '@loopback/rest';
import {generateEpubDescription} from '../cee/utils/epub-util';
import {FILE_UPLOAD_SERVICE} from '../keys';
import {CeeMedia} from '../models';
import {CeeMediaRepository, CeeRepository} from '../repositories';
import {FileUploadHandler} from '../types';

export class CeeMediaController {
  constructor(
    @repository(CeeMediaRepository)
    public ceeMediaRepository: CeeMediaRepository,
    @repository(CeeRepository)
    public ceeRepository: CeeRepository,
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler
  ) { }

  @post('/c2e-media')
  @response(200, {
    description: 'CeeMedia model instance',
    content: {'application/json': {schema: getModelSchemaRef(CeeMedia)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CeeMedia, {
            title: 'NewCeeMedia',
            exclude: ['id'],
          }),
        },
      },
    })
    ceeMedia: Omit<CeeMedia, 'id'>,
  ): Promise<CeeMedia> {
    return this.ceeMediaRepository.create(ceeMedia);
  }

  @get('/c2e-media/collections')
  @response(200, {
    description: 'CeeMedia collections'
  })
  async collections(): Promise<string[]> {
    return this.ceeMediaRepository.findAllCollections();
  }

  @get('/c2e-media/count')
  @response(200, {
    description: 'CeeMedia model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(CeeMedia) where?: Where<CeeMedia>,
  ): Promise<Count> {
    return this.ceeMediaRepository.count(where);
  }

  @get('/c2e-media')
  @response(200, {
    description: 'Array of CeeMedia model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CeeMedia, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(CeeMedia) filter?: Filter<CeeMedia>,
  ): Promise<CeeMedia[]> {
    // return this.ceeMediaRepository.find(filter);
    return this.ceeMediaRepository.getAllInHierarchy();
  }

  @patch('/c2e-media')
  @response(200, {
    description: 'CeeMedia PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CeeMedia, {partial: true}),
        },
      },
    })
    ceeMedia: CeeMedia,
    @param.where(CeeMedia) where?: Where<CeeMedia>,
  ): Promise<Count> {
    return this.ceeMediaRepository.updateAll(ceeMedia, where);
  }

  @get('/c2e-media/{id}')
  @response(200, {
    description: 'CeeMedia model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CeeMedia, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(CeeMedia, {exclude: 'where'}) filter?: FilterExcludingWhere<CeeMedia>
  ): Promise<CeeMedia> {
    return this.ceeMediaRepository.findById(id, filter);
  }

  @patch('/c2e-media/{id}')
  @response(204, {
    description: 'CeeMedia PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CeeMedia, {partial: true}),
        },
      },
    })
    ceeMedia: CeeMedia,
  ): Promise<void> {
    await this.ceeMediaRepository.updateById(id, ceeMedia);
  }

  @put('/c2e-media/{id}')
  @response(204, {
    description: 'CeeMedia PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ceeMedia: CeeMedia,
  ): Promise<void> {
    await this.ceeMediaRepository.replaceById(id, ceeMedia);
  }

  @del('/c2e-media/{id}')
  @response(204, {
    description: 'CeeMedia DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.ceeMediaRepository.deleteById(id);
  }

  @get('/descgen')
  async descgen(
    @param.query.string('model') model: string,
    @param.query.string('limit') limit: number,
    @param.query.string('maxcontext') maxContext: number,
  ): Promise<any[]> {
    if (!limit || limit > 10 || limit < 1) return ['no limit'];

    if (!maxContext || maxContext > 2500 || maxContext < 1) return ['bad context'];

    const results = await this.ceeMediaRepository.execute(`SELECT * FROM ceemedia WHERE title = description order by createdat DESC limit ${limit}`);

    if (!Array.isArray(results)) return [];

    for (const row of results) {
      const description = await generateEpubDescription(row.resource, model, maxContext);
      if (description.indexOf('ENOFILE') !== -1) {
        await this.ceeMediaRepository.updateById(row.id, {description: 'ENOFILE'});
      } else {
        await this.ceeMediaRepository.updateById(row.id, {description: description});
      }
    }

    return ['done'];
  }

}
