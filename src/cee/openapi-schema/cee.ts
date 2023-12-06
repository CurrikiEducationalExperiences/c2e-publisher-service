import {SchemaObject} from '@loopback/rest';

export const ceeCreateByMediaSchema: SchemaObject = {
  title: 'Create C2E by Media ID',
  type: 'object',
  required: ['ceeMediaId'],
  properties: {
    ceeMediaId: {
      type: 'string',
    },
    licensee: {
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
  }
};

export const ceeCreateByIdSchema: SchemaObject = {
  title: 'Create C2E by License Key',
  type: 'object',
  required: ['ceeId', 'token'],
  properties: {
    ceeId: {
      type: 'string',
    },
    decrypt: {
      type: 'boolean',
    },
    email: {
      type: 'string',
    },
    secret: {
      type: 'string',
    }
  }
};


export const ceeLicenseBatchRequestSchema: SchemaObject = {
  title: 'Create C2E License Batch',
  type: 'object',
  required: ['licenseeEmail', 'licenseeName'],
  properties: {
    licenseeEmail: {
      type: 'string',
    },
    licenseeName: {
      type: 'string',
    }
  }
};
