export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Accounts Service API',
    version: '1.0.0',
    description: 'REST API for managing staff member accounts',
    contact: {
      name: 'API Support',
      email: 'api@example.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:4003',
      description: 'Local development server'
    },
    {
      url: 'https://api.example.com',
      description: 'Production server'
    }
  ],
  paths: {
    '/accounts': {
      get: {
        summary: 'List accounts',
        description: 'Retrieves accounts. Can be filtered by staffMemberId query parameter.',
        tags: ['Accounts'],
        parameters: [
          {
            name: 'staffMemberId',
            in: 'query',
            required: false,
            description: 'Filter account by staff member ID',
            schema: {
              type: 'string',
              example: '1'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    {
                      type: 'object',
                      description: 'Response when no filter is applied',
                      properties: {
                        success: {
                          type: 'boolean',
                          example: true
                        },
                        data: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/Account'
                          }
                        },
                        count: {
                          type: 'integer',
                          description: 'Total number of accounts',
                          example: 5
                        }
                      },
                      required: ['success', 'data', 'count']
                    },
                    {
                      type: 'object',
                      description: 'Response when filtered by staffMemberId',
                      properties: {
                        success: {
                          type: 'boolean',
                          example: true
                        },
                        data: {
                          $ref: '#/components/schemas/Account'
                        }
                      },
                      required: ['success', 'data']
                    }
                  ]
                }
              }
            }
          },
          '404': {
            description: 'Account not found (when staffMemberId filter is used)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false
                    },
                    message: {
                      type: 'string',
                      example: 'No account found for staff member ID: 999'
                    },
                    data: {
                      type: 'null',
                      example: null
                    }
                  },
                  required: ['success', 'message', 'data']
                }
              }
            }
          }
        }
      }
    },
    '/accounts/{id}': {
      get: {
        summary: 'Get specific account',
        description: 'Retrieves a specific account by its unique ID',
        tags: ['Accounts'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'The unique ID of the account',
            schema: {
              type: 'string',
              example: 'acc-001'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response with account',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    data: {
                      $ref: '#/components/schemas/Account'
                    }
                  },
                  required: ['success', 'data']
                }
              }
            }
          },
          '404': {
            description: 'Account not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false
                    },
                    message: {
                      type: 'string',
                      example: 'Account not found with ID: acc-999'
                    },
                    data: {
                      type: 'null',
                      example: null
                    }
                  },
                  required: ['success', 'message', 'data']
                }
              }
            }
          }
        }
      }
    },
    '/health': {
      get: {
        summary: 'Health check',
        description: 'Check the health status of the accounts service',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['healthy'],
                      example: 'healthy'
                    },
                    service: {
                      type: 'string',
                      example: 'accounts-service'
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time',
                      example: '2024-01-15T10:30:00.000Z'
                    }
                  },
                  required: ['status', 'service', 'timestamp']
                }
              }
            }
          }
        }
      }
    },
    '/api-docs': {
      get: {
        summary: 'API Documentation',
        description: 'Interactive Swagger UI documentation',
        tags: ['Documentation'],
        responses: {
          '200': {
            description: 'HTML page with Swagger UI'
          }
        }
      }
    },
    '/openapi.json': {
      get: {
        summary: 'OpenAPI Specification',
        description: 'Get the raw OpenAPI specification in JSON format',
        tags: ['Documentation'],
        responses: {
          '200': {
            description: 'OpenAPI specification',
            content: {
              'application/json': {
                schema: {
                  type: 'object'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Account: {
        type: 'object',
        required: ['id', 'staffMemberId', 'githubUsername'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique account ID',
            example: 'acc-001'
          },
          staffMemberId: {
            type: 'string',
            description: 'Staff member ID this account belongs to',
            example: '1'
          },
          githubUsername: {
            type: 'string',
            description: 'GitHub username for this account',
            example: 'jsmith-dev'
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Accounts',
      description: 'Account management operations'
    },
    {
      name: 'Health',
      description: 'Service health monitoring'
    },
    {
      name: 'Documentation',
      description: 'API documentation endpoints'
    }
  ]
};