import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { accountsData } from './data';
import { Account } from './types';
import { openApiSpec } from './openapi';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4004;

// Middleware
app.use(cors());
app.use(express.json());

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// OpenAPI Spec endpoint for clients
app.get('/openapi.json', (req: Request, res: Response) => {
  res.json(openApiSpec);
});

// GET /accounts - List all accounts (with optional staffMemberId filter)
app.get('/accounts', (req: Request, res: Response) => {
  const { staffMemberId } = req.query;

  // If staffMemberId is provided, filter by it
  if (staffMemberId) {
    const staffAccount = accountsData.find(
      (account: Account) => account.staffMemberId === String(staffMemberId)
    );

    if (!staffAccount) {
      return res.status(404).json({
        success: false,
        message: `No account found for staff member ID: ${staffMemberId}`,
        data: null
      });
    }

    return res.json({
      success: true,
      data: staffAccount
    });
  }

  // Return all accounts if no filter
  res.json({
    success: true,
    data: accountsData,
    count: accountsData.length
  });
});

// GET /accounts/:id - Get specific account by ID
app.get('/accounts/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const account = accountsData.find(
    (item: Account) => item.id === id
  );

  if (!account) {
    return res.status(404).json({
      success: false,
      message: `Account not found with ID: ${id}`,
      data: null
    });
  }

  res.json({
    success: true,
    data: account
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'accounts-service',
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
  console.log(`🚀 Accounts service running on http://localhost:${PORT}`);
  console.log(`\n📚 API Documentation:`);
  console.log(`   - Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`   - OpenAPI JSON: http://localhost:${PORT}/openapi.json`);
  console.log(`\n🔧 API Endpoints:`);
  console.log(`   - GET /accounts - List all accounts`);
  console.log(`   - GET /accounts?staffMemberId={id} - Get account for specific staff member`);
  console.log(`   - GET /accounts/:id - Get specific account by ID`);
  console.log(`   - GET /health - Health check`);
});
