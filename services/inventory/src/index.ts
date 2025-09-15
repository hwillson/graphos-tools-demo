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

// GET /inventory - List all inventory (with optional productId filter)
app.get('/inventory', (req: Request, res: Response) => {
  const { productId } = req.query;

  // If productId is provided, filter by it
  if (productId) {
    const productInventory = inventoryData.filter(
      (item: Inventory) => item.productId === String(productId)
    );

    if (productInventory.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No inventory found for product ID: ${productId}`,
        data: []
      });
    }

    // Calculate total quantity across all warehouses
    const totalQuantity = productInventory.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    return res.json({
      success: true,
      productId: String(productId),
      totalQuantity,
      warehouses: productInventory,
      count: productInventory.length
    });
  }

  // Return all inventory if no filter
  res.json({
    success: true,
    data: inventoryData,
    count: inventoryData.length
  });
});

// GET /inventory/:id - Get specific inventory item by ID
app.get('/inventory/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const inventoryItem = inventoryData.find(
    (item: Inventory) => item.id === id
  );

  if (!inventoryItem) {
    return res.status(404).json({
      success: false,
      message: `Inventory item not found with ID: ${id}`,
      data: null
    });
  }

  res.json({
    success: true,
    data: inventoryItem
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
  console.log(`   - GET /inventory?productId={id} - Get inventory for specific product`);
  console.log(`   - GET /inventory/:id - Get specific inventory item by ID`);
  console.log(`   - GET /health - Health check`);
});