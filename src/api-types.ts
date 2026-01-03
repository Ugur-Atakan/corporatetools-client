import { CTEntityType } from './entity-types';
import { CTJurisdiction } from './jurisdictions';

// -------------------- CALLBACKS --------------------

export type CTCallbackApi = {
  id: string;
  created_at: string;
  url: string;
};

export type CTCallbacksListResponse = {
  success: boolean;
  timestamp: string;
  result: CTCallbackApi[];
};

export type CTCallbackCreateResponse = {
  success: boolean;
  timestamp: string;
  result: CTCallbackApi;
};

// -------------------- COMPLIANCE EVENTS --------------------

export type CTComplianceStatus = 'active' | 'none_required';

export type CTComplianceEventApi = {
  id: string;
  created_at: string;
  updated_at: string;
  status: CTComplianceStatus;
  due_date: string;
  jurisdiction?: CTJurisdiction | CTJurisdiction[];
  company: string;
  filing: string;
};

export type CTComplianceEventsListResponse = {
  success: boolean;
  timestamp: string;
  result: CTComplianceEventApi[];
};

/**
 * Companies
 */
export type CTCompanyApi = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  entity_type: CTEntityType;
  jurisdictions?: CTJurisdiction[];
  home_state?: CTJurisdiction;
};

export type CTCompaniesListResponse = {
  success: boolean;
  timestamp: string;
  result: CTCompanyApi[];
};

export type CTCompanyGetResponse = {
  success: boolean;
  timestamp: string;
  result: CTCompanyApi;
};

export type CTCompaniesCreateRequest = {
  companies: Array<{
    name: string;
    entity_type: CTEntityType;
    jurisdictions?: CTJurisdiction[];
    home_state?: CTJurisdiction;
  }>;
  duplicate_name_allowed?: boolean;
};

export type CTCompaniesCreateResponse = {
  success: boolean;
  timestamp: string;
  result: CTCompanyApi[];
};

export type CTCompaniesUpdateRequest = {
  companies: Array<{
    company?: string;
    name?: string;
    entity_type?: CTEntityType;
    jurisdictions?: CTJurisdiction[];
    home_state?: CTJurisdiction;
  }>;
  duplicate_name_allowed?: boolean;
};

export type CTCompaniesUpdateResponse = {
  success: boolean;
  timestamp: string;
  result: CTCompanyApi[];
};

/**
 * Filing Methods
 */
export type CTFilingMethodsListResponse = {
  success: boolean;
  timestamp: string;
  result: CTFilingMethod[];
};

export interface CTFilingMethod {
  id: string;
  name: string;
  type: 'mail' | 'online' | 'fax';
  cost: string;
  filing_description: string;
  jurisdiction: CTJurisdiction;
  agency_name: string;
  filed_in: Object;
  docs_in: Object;
}

// -------------------- DOCUMENTS --------------------

export type CTDocumentStatus = 'read' | 'unread';

export type CTDocumentType =
  | 'Active Filings Original Client Document'
  | 'Amendment'
  | 'Annual Report'
  | 'Bad Scan'
  | 'BOI Amendment'
  | 'BOI Initial'
  | 'Business Plan'
  | 'Certified Mail'
  | 'Certified Mail service of Process'
  | 'Client Upload'
  | 'Corporate Bylaws'
  | 'Corporate maintenance notice'
  | 'Credit Card Quote'
  | 'Delivered Service of Process'
  | 'EIN Letter'
  | 'EIN - SS4 Form'
  | 'Filing Document'
  | 'Form A Company'
  | 'Formation Document'
  | 'Hand delivered service of process'
  | 'High Priority'
  | 'Historical'
  | 'Incorporate Fast Original Client Document'
  | 'Informational document'
  | 'Initial Filing'
  | 'Initial Resolution'
  | 'Initial Vehicle Documentation'
  | 'Law on Call ToS Agreement'
  | 'NWRA Free Documents'
  | 'Ongoing Filing'
  | 'Operating Agreement'
  | 'Original CFS Document'
  | 'Original Filing'
  | 'Regular Mail'
  | 'Rejection Notice'
  | 'State Compliance'
  | 'State Notice'
  | 'Vehicle Mail'
  | 'Vehicle Renewal Notice'
  | 'VO Office Lease';

export type CTDocumentSource = 'mail' | 'generated' | 'hand-delivered';

export type CTDocumentApi = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  status: CTDocumentStatus;
  type: string;
  source: CTDocumentSource;
  pages: number;
  payment_locked: boolean;
  state: string;
  company_name: string;
  jurisdiction?: CTJurisdiction;
  company_id: string;
};

export type CTDocumentsListResponse = {
  success: boolean;
  timestamp: string;
  result: CTDocumentApi[];
};

export type CTDocumentGetResponse = {
  success: boolean;
  timestamp: string;
  result: CTDocumentApi;
};

export type CTDocumentPageUrlResult = {
  id: string;
  url: string;
};

export type CTDocumentPageUrlResponse = {
  success: boolean;
  timestamp: string;
  result: CTDocumentPageUrlResult;
};

export type CTDocumentsBulkDownloadResult = {
  id: string;
  url: string;
};

export type CTDocumentsBulkDownloadResponse = {
  success: boolean;
  timestamp: string;
  result: CTDocumentsBulkDownloadResult[];
};

export type CTDocumentUnlockResult = {
  action: 'capture';
  amount: number;
  result: string;
  success: boolean;
  invoice_ids: string[];
};

export type CTDocumentUnlockResponse = {
  success: boolean;
  timestamp: string;
  result: CTDocumentUnlockResult;
};

// -------------------- INVOICES --------------------

export type CTInvoiceStatus = 'paid' | 'unpaid' | 'cancelled';

export type CTInvoiceItemApi = {
  price: number;
  description: string;
  quantity: number;
};

export type CTInvoiceApi = {
  id: string;
  invoice_number: string;
  status: CTInvoiceStatus;
  company_id: string;
  created_at: string;
  updated_at: string;
  company: string;
  due_date: string;
  paid_date?: string | null;
  items: CTInvoiceItemApi[];
};

export type CTInvoicesListResponse = {
  success: boolean;
  timestamp: string;
  result: CTInvoiceApi[];
};

export type CTInvoiceGetResponse = {
  success: boolean;
  timestamp: string;
  result: CTInvoiceApi;
};

export type CTInvoicesPayResult = {
  action: 'capture';
  amount: number;
  result: string;
  success: boolean;
  invoice_ids: string[];
};

export type CTInvoicesPayResponse = {
  success: boolean;
  timestamp: string;
  result: CTInvoicesPayResult;
};

// -------------------- RESOURCES --------------------

export type CTResourceKind = 'document' | 'url';

export type CTResourceApi = {
  id: string;
  name: string;
  url: string;
  kind: CTResourceKind;
  jurisdiction: CTJurisdiction;
  agency: string;
  entity_types: string[];
};

export type CTResourcesListResponse = {
  success: boolean;
  timestamp: string;
  result: CTResourceApi[];
};

export type CTResourceGetResponse = {
  success: boolean;
  timestamp: string;
  result: CTResourceApi;
};

export type CTResourcePageUrlResult = {
  url: string;
  filename: string;
};

export type CTResourcePageUrlResponse = {
  success: boolean;
  timestamp: string;
  result: CTResourcePageUrlResult[];
};

// -------------------- SERVICES --------------------

export type CTRegisteredAgentProduct = {
  id: string;
  name: string;
  price: string;
  jurisdiction: CTJurisdiction;
  duration: number;
};

export type CTServiceStatus =
  | 'active'
  | 'cancelled'
  | 'awaiting-client-input'
  | 'cancel-requested';

export type CTServiceApi = {
  id: string;
  created_at: string;
  updated_at: string;
  status: CTServiceStatus;
  type: string;
  jurisdiction: string;
  jurisdiction_id: string;
  company: string;
  company_id: string;
};

export type CTServicesListResponse = {
  success: boolean;
  timestamp: string;
  result: CTServiceApi[];
};

export type CTServicesCreateRequest = {
  company?: string;
  company_id?: string;
  jurisdictions?: string[];
  jurisdiction_ids?: string[];
};

export type CTServicesCreateResponse = {
  success: boolean;
  timestamp: string;
  result: CTServiceApi[];
};

export type CTServiceCancelRequestResponse = {
  success: boolean;
  timestamp: string;
  result: CTServiceApi;
};

export type CTServiceInfoGetResponse<T = any> = {
  success: boolean;
  timestamp: string;
  result: T;
};

export type CTServiceInfoUpdateResponse = {
  success: boolean;
  timestamp: string;
  result: CTServiceApi;
};

// -------------------- ACCOUNT --------------------

export type CTAccountPersonEmail = {
  id: string;
  email_address: string;
  label: string;
  kind: string;
};

export type CTAccountPersonPhone = {
  id: string;
  phone_number: string;
  label: string;
  kind: string;
};

export type CTAccountPersonAddress = {
  id: string;
  line1: string;
  line2: string | null;
  line3: string | null;
  city: string;
  state_provice_region: string;
};

export type CTAccountPerson = {
  id: string;
  first_name: string;
  last_name: string;
  person_emails: CTAccountPersonEmail[];
  person_phones: CTAccountPersonPhone[];
  person_addresses: CTAccountPersonAddress[];
};

export type CTAccountApi = {
  id: string;
  website_id: string;
  type: string;
  affiliate: string | null;
  people: CTAccountPerson[];
};

export type CTAccountGetResponse = {
  success: boolean;
  timestamp: string;
  result: {
    account: CTAccountApi;
  };
};

export type CTAccountDashpanelApi = {
  unread_documents: number;
  unpaid_invoices: number;
  services_requiring_attention: number;
  orders_requiring_attention: number;
  pending_filings: number;
  upcoming_compliance_events: number;
};

export type CTAccountDashpanelResponse = {
  success: boolean;
  timestamp: string;
  result: CTAccountDashpanelApi;
};

// -------------------- ORDER ITEMS --------------------

export type CTOrderItemProduct = {
  id: string;
  price: number;
  name: string;
  filing_method?: {
    id: string;
    cost: number;
    name: string;
    type: string;
  };
};

export type CTOrderItemApi = {
  id: string;
  created_at: number;
  updated_at: number;
  company_id: string;
  name: string;
  order_id: string;
  quantity: number;
  status: 'awaiting-client-input' | 'new' | 'pending-state-formation';
  type: string;
  product: CTOrderItemProduct;
};

export type CTOrderItemsListResponse = {
  success: boolean;
  timestamp: string;
  result: CTOrderItemApi[];
};

export type CTOrderItemUpdateRequest = {
  form_data: Record<string, any>;
  order_item_id: string;
  company_id: string;
};

export type CTOrderItemUpdateResponse = {
  success: boolean;
  timestamp: string;
  result: CTOrderItemApi;
};

// -------------------- PAYMENT METHODS --------------------

export type CTPaymentMethodBillingAddress = {
  city: string;
  state: string;
  zip: string;
  country: string;
  address1: string;
  address2: string | null;
};

export type CTPaymentMethodApi = {
  id: string;
  first_name: string;
  last_name: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  created_at: string;
  brand: string;
  is_prepaid: boolean;
  billing_address: CTPaymentMethodBillingAddress;
};

export type CTPaymentMethodsListResponse = {
  success: boolean;
  timestamp: string;
  result: CTPaymentMethodApi[];
};

export type CTPaymentMethodCreateRequest = {
  number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
  first_name: string;
  last_name: string;
  billing_address: CTPaymentMethodBillingAddress;
};

export type CTPaymentMethodCreateResponse = {
  success: boolean;
  timestamp: string;
  result: {
    status_code: number;
    success: boolean;
  };
};

export type CTPaymentMethodUpdateRequest = {
  number?: string;
  exp_month?: string;
  exp_year?: string;
  cvc?: string;
  first_name?: string;
  last_name?: string;
  billing_address?: Partial<CTPaymentMethodBillingAddress>;
};

export type CTPaymentMethodUpdateResponse = {
  success: boolean;
  timestamp: string;
  result: {
    status_code: number;
    success: boolean;
  };
};

export type CTPaymentMethodDeleteResponse = {
  success: boolean;
  timestamp: string;
  result: {
    status_code: number;
    success: boolean;
  };
};

// -------------------- SIGNED FORMS --------------------

export type CTSignedFormApi = {
  url: string;
  filename: string;
};

export type CTSignedFormsListResponse = {
  success: boolean;
  timestamp: string;
  result: CTSignedFormApi[];
};

// -------------------- Filing Products --------------------
export type CTFilingProduct = {
  id: string;
  name: string;
  price: number;
  filing_name: string;
};

export type CTFilingProductsListResponse = {
  success: boolean;
  timestamp: string;
  result: CTFilingProduct[];
};

// -------------------- SIMPLE PRODUCTS --------------------

export type CTSimpleProductApi = {
  id: string;
  name: string;
  duration: number;
  kind: string;
  category: string;
  renewable: boolean;
  price: number;
  description: string | null;
};

export type CTSimpleProductsListResponse = {
  success: boolean;
  timestamp: string;
  result: CTSimpleProductApi[];
};

// -------------------- WEBSITES --------------------

export type CTWebsiteAddress = {
  line_1: string;
  line_2: string | null;
  city: string;
  state: string;
  zip_code: string;
  country: string;
};

export type CTWebsiteApi = {
  id: string;
  name: string;
  url: string;
  billing_name: string;
  login_url: string;
  created_at: string;
  updated_at: string;
  emails: string[];
  phone_numbers: string[];
  addresses: CTWebsiteAddress[];
};

export type CTWebsiteGetResponse = {
  success: boolean;
  timestamp: string;
  result: CTWebsiteApi;
};

