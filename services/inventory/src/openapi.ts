export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Inventory Service API',
    version: '1.0.0',
    description: 'REST API for managing product inventory across multiple warehouses',
    contact: {
      name: 'API Support',
      email: 'api@example.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:4002',
      description: 'Local development server'
    },
    {
      url: 'https://api.example.com',
      description: 'Production server'
    }
  ],
  paths: {
    '/inventory': {
      get: {
        summary: 'List inventory',
        description: 'Retrieves inventory information. Can be filtered by productId query parameter.',
        tags: ['Inventory'],
        parameters: [
          {
            name: 'productId',
            in: 'query',
            required: false,
            description: 'Filter inventory by product ID',
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
                            $ref: '#/components/schemas/Inventory'
                          }
                        },
                        count: {
                          type: 'integer',
                          description: 'Total number of inventory items',
                          example: 15
                        }
                      },
                      required: ['success', 'data', 'count']
                    },
                    {
                      type: 'object',
                      description: 'Response when filtered by productId',
                      properties: {
                        success: {
                          type: 'boolean',
                          example: true
                        },
                        productId: {
                          type: 'string',
                          description: 'The product ID',
                          example: '1'
                        },
                        totalQuantity: {
                          type: 'integer',
                          description: 'Total quantity across all warehouses',
                          example: 50
                        },
                        warehouses: {
                          type: 'array',
                          description: 'Inventory details per warehouse',
                          items: {
                            $ref: '#/components/schemas/Inventory'
                          }
                        },
                        count: {
                          type: 'integer',
                          description: 'Number of warehouses with this product',
                          example: 3
                        }
                      },
                      required: ['success', 'productId', 'totalQuantity', 'warehouses', 'count']
                    }
                  ]
                }
              }
            }
          },
          '404': {
            description: 'Product not found (when productId filter is used)',
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
                      example: 'No inventory found for product ID: 999'
                    },
                    data: {
                      type: 'array',
                      items: {},
                      example: []
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
    '/inventory/{id}': {
      get: {
        summary: 'Get specific inventory item',
        description: 'Retrieves a specific inventory item by its unique ID',
        tags: ['Inventory'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'The unique ID of the inventory item',
            schema: {
              type: 'string',
              example: 'inv-001'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response with inventory item',
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
                      $ref: '#/components/schemas/Inventory'
                    }
                  },
                  required: ['success', 'data']
                }
              }
            }
          },
          '404': {
            description: 'Inventory item not found',
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
                      example: 'Inventory item not found with ID: inv-999'
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
        description: 'Check the health status of the inventory service',
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
                      example: 'inventory-service'
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
      Inventory: {
        type: 'object',
        required: ['id', 'productId', 'quantity', 'warehouseLocation'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique inventory item ID',
            example: 'inv-001'
          },
          productId: {
            type: 'string',
            description: 'Product ID this inventory belongs to',
            example: '1'
          },
          quantity: {
            type: 'integer',
            description: 'Available quantity in this warehouse',
            minimum: 0,
            example: 25
          },
          warehouseLocation: {
            type: 'string',
            description: 'Warehouse location',
            example: 'North America - Seattle'
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Inventory',
      description: 'Inventory management operations'
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