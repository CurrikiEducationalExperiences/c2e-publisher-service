import {SchemaObject} from '@loopback/rest';

export const ceeListBatchRequest: SchemaObject = {
  title: 'List C2E by Licensed Media Batch',
  type: 'object',
  required: ['ceeMediaIds'],
  properties: {
    ceeMediaIds: {
      type: 'array',
      items: {
        type: 'string',
      }
    },
  }
}

export const ceeListBatchResponse: SchemaObject = {
  title: 'Response - List C2E by Licensed Media',
  type: 'object',
  required: ['message'],
  properties: {
    message: {
      type: 'string',
    }
  }
}

export const ceeListByLicensedMedia: SchemaObject = {
  title: 'List C2E by Licensed Media',
  type: 'object',
  required: ['ceeLicenseeEmail', 'ceeListingIds'],
  properties: {
    ceeLicenseeEmail: {
      type: 'string',
    },
    ceeListingIds: {
      type: 'array',
      items: {
        type: 'string',
      }
    },
  }
}

export const ceeListByMediaRequest: SchemaObject = {
  title: 'List C2E by Media ID',
  type: 'object',
  required: ['ceeMediaId', 'ceeWriterId', 'ceeStoreId', 'copyrightHolder'],
  properties: {
    ceeMediaId: {
      type: 'string',
    },
    ceeWriterId: {
      type: 'string'
    },
    ceeStoreId: {
      type: 'string'
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    identifier: {
      type: 'object',
      properties: {
        identifierType: {
          type: 'string',
        },
        identifierValue: {
          type: 'string',
        },
      },
    },
    copyrightHolder: {
      title: 'Organization or Person who is the owner of the C2E',
      type: 'object',
      required: ['name', 'email', 'url'],
      properties: {
        name: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        url: {
          type: 'string',
        },
      }
    },
    price: {
      type: 'string',
    },
    licenseType: {
      type: 'string',
    },
    licenseTerms: {
      type: 'string',
    }
  },
};
