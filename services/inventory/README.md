# Inventory REST API Service

A Node.js REST API service for managing product inventory.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

The server will start on http://localhost:4002

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

## API Endpoints

### GET /inventory
Returns all inventory records across all warehouses.

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 15
}
```

### GET /inventory/:product_id
Returns inventory information for a specific product across all warehouses.

**Parameters:**
- `product_id` - The ID of the product (1-5)

**Response (Success):**
```json
{
  "success": true,
  "productId": "1",
  "totalQuantity": 50,
  "warehouses": [...],
  "count": 3
}
```

**Response (Not Found):**
```json
{
  "success": false,
  "message": "No inventory found for product ID: 99",
  "data": []
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "inventory-service",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Test Data

The service includes test inventory data for products 1-5, distributed across three warehouses:
- North America - Seattle
- Europe - London
- Asia - Tokyo

Each product has varying quantities in different warehouses to simulate real inventory distribution.