import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { inventoryData } from './data';
import { Inventory } from './types';
import { openApiSpec } from './openapi';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4002;

// Middleware
app.use(cors());
app.use(express.json());

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// OpenAPI Spec endpoint for clients
app.get('/openapi.json', (req: Request, res: Response) => {
  res.json(openApiSpec);
});

// GET /inventory - List all inventory
app.get('/inventory', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: inventoryData,
    count: inventoryData.length
  });
});

// GET /inventory/:product_id - Get inventory for specific product
app.get('/inventory/:product_id', (req: Request, res: Response) => {
  const { product_id } = req.params;

  const productInventory = inventoryData.filter(
    (item: Inventory) => item.productId === product_id
  );

  if (productInventory.length === 0) {
    return res.status(404).json({
      success: false,
      message: `No inventory found for product ID: ${product_id}`,
      data: []
    });
  }

  // Calculate total quantity across all warehouses
  const totalQuantity = productInventory.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  res.json({
    success: true,
    productId: product_id,
    totalQuantity,
    warehouses: productInventory,
    count: productInventory.length
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'inventory-service',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Inventory service running on http://localhost:${PORT}`);
  console.log(`\n📚 API Documentation:`);
  console.log(`   - Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`   - OpenAPI JSON: http://localhost:${PORT}/openapi.json`);
  console.log(`\n🔧 API Endpoints:`);
  console.log(`   - GET /inventory - List all inventory`);
  console.log(`   - GET /inventory/:product_id - Get inventory for specific product`);
  console.log(`   - GET /health - Health check`);
});