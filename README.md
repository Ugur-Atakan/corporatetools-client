# @uguratakan/corporatetools-client

TypeScript client library for Corporate Tools API. Standalone version that works without NestJS dependencies.

## Installation

```bash
npm install @uguratakan/corporatetools-client
# or
yarn add @uguratakan/corporatetools-client
# or
pnpm add @uguratakan/corporatetools-client
```

## Quick Start

```typescript
import { CorporateToolsClient } from '@uguratakan/corporatetools-client';

const client = new CorporateToolsClient({
  apiUrl: 'https://api.corporatetools.com',
  accessKey: 'your-access-key',
  secretKey: 'your-secret-key',
  websiteUrl: 'https://your-website.com' // Your Provider for example www.registeredagentsinc.com 
});

// Use the client
const companies = await client.listCompanies();
const account = await client.getAccount();
```

## Configuration

```typescript
interface CorporateToolsConfig {
  apiUrl: string;           // Required: Corporate Tools API URL
  accessKey: string;        // Required: Your access key
  secretKey: string;        // Required: Your secret key
  websiteUrl: string;       // Required: Your Provider for example www.registeredagentsinc.com 
  timeout?: number;         // Optional: Request timeout in ms (default: 30000)
  logger?: {                // Optional: Custom logger
    log: (message: string) => void;
    error: (message: string) => void;
    debug: (message: string) => void;
  };
}
```

## API Methods

### Account
- `getAccount()` - Get account information
- `getAccountDashpanel()` - Get account dashboard data

### Companies
- `listCompanies(params?)` - List companies
- `getCompany(id)` - Get company by ID
- `createCompany(company, options?)` - Create a company
- `updateCompanies(payload)` - Update companies

### Documents
- `listDocuments(params?)` - List documents
- `getDocument(id)` - Get document by ID
- `getDocumentPageAsPng(id, pageNumber, dpi?)` - Get document page as PNG
- `getDocumentPageUrl(id, pageNumber, dpi?)` - Get document page URL
- `bulkDownloadDocuments(ids)` - Bulk download documents
- `downloadDocumentPdf(id)` - Download document as PDF
- `unlockDocument(id, paymentToken)` - Unlock document

### Invoices
- `listInvoices(params)` - List invoices
- `getInvoice(id)` - Get invoice by ID
- `payInvoices(paymentToken, invoiceIds)` - Pay invoices

### Services
- `listServices(params)` - List services
- `createServices(payload)` - Create services
- `requestServiceCancel(id)` - Request service cancellation
- `getServiceInfo<T>(id)` - Get service info
- `updateServiceInfo(id, info)` - Update service info

### Payment Methods
- `getPaymentMethods()` - List payment methods
- `createPaymentMethod(payload)` - Create payment method
- `updatePaymentMethod(id, payload)` - Update payment method
- `deletePaymentMethod(id)` - Delete payment method

### Shopping Cart
- `addToShoppingCart(params)` - Add item to cart
- `getShoppingCart(params?)` - Get shopping cart
- `checkoutShoppingCart(params)` - Checkout cart
- `deleteShoppingCartItem(itemIds)` - Delete cart items

### Order Items
- `listOrderItemsRequiringAttention(companyId?)` - List order items requiring attention
- `updateOrderItemRequiringAttention(payload)` - Update order item

### Resources
- `listResources(params?)` - List resources
- `getResource(id)` - Get resource by ID
- `getResourcePageAsPng(id, pageNumber, dpi?)` - Get resource page as PNG
- `downloadResourcePdf(id)` - Download resource as PDF

### Filing Products & Methods
- `listFilingProducts(params?)` - List filing products
- `listRegisteredAgentProducts()` - List registered agent products
- `listFilingMethods(options)` - List filing methods
- `getFilingMethodShemas(companyId, filingMethodId)` - Get filing method schemas
- `getFilingProductOfferings({companyId, jurisdiction})` - Get filing product offerings

### Signed Forms
- `getSignedForms(params)` - Get signed forms

### Simple Products
- `listSimpleProducts()` - List simple products

### Websites
- `getWebsite()` - Get website information

### Compliance Events
- `listComplianceEvents(params)` - List compliance events

### Callbacks
- `listCallbacks()` - List callbacks
- `createCallback(url)` - Create callback
- `deleteCallback(id)` - Delete callback

## TypeScript Support

Full TypeScript support with comprehensive type definitions included. All types are exported from the package.

## Examples

### List Companies

```typescript
const companies = await client.listCompanies({
  limit: 10,
  offset: 0,
});
```

### Create Company

```typescript
const company = await client.createCompany({
  name: 'My Company LLC',
  entity_type: 'Limited Liability Company',
  jurisdictions: [CTJurisdiction.Delaware],
});
```

### Get Documents

```typescript
const documents = await client.listDocuments({
  company_id: 'company-id',
  status: 'unread',
});
```

### Custom Logger

```typescript
const client = new CorporateToolsClient({
  apiUrl: 'https://api.corporatetools.com',
  accessKey: 'your-access-key',
  secretKey: 'your-secret-key',
  logger: {
    log: (msg) => console.log(`[INFO] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`),
    debug: (msg) => console.debug(`[DEBUG] ${msg}`),
  },
});
```

## License

MIT

