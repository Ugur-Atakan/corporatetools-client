import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { CTEntityType } from './entity-types';
import {
  CTCompanyApi,
  CTCompaniesListResponse,
  CTCompanyGetResponse,
  CTCompaniesCreateRequest,
  CTCompaniesCreateResponse,
  CTCompaniesUpdateRequest,
  CTCompaniesUpdateResponse,
  CTFilingProductsListResponse,
  CTFilingMethodsListResponse,
  CTRegisteredAgentProduct,
  CTComplianceEventApi,
  CTComplianceEventsListResponse,
  CTCallbackApi,
  CTCallbacksListResponse,
  CTCallbackCreateResponse,
  CTDocumentsListResponse,
  CTDocumentGetResponse,
  CTDocumentPageUrlResponse,
  CTDocumentsBulkDownloadResponse,
  CTDocumentUnlockResponse,
  CTDocumentApi,
  CTDocumentPageUrlResult,
  CTDocumentsBulkDownloadResult,
  CTDocumentUnlockResult,
  CTInvoiceApi,
  CTInvoicesListResponse,
  CTInvoiceGetResponse,
  CTInvoicesPayResponse,
  CTInvoicesPayResult,
  CTServiceApi,
  CTServicesListResponse,
  CTServicesCreateRequest,
  CTServicesCreateResponse,
  CTServiceCancelRequestResponse,
  CTServiceInfoGetResponse,
  CTServiceInfoUpdateResponse,
  CTAccountApi,
  CTAccountGetResponse,
  CTAccountDashpanelApi,
  CTAccountDashpanelResponse,
  CTOrderItemApi,
  CTOrderItemsListResponse,
  CTOrderItemUpdateRequest,
  CTOrderItemUpdateResponse,
  CTPaymentMethodApi,
  CTPaymentMethodsListResponse,
  CTPaymentMethodCreateRequest,
  CTPaymentMethodCreateResponse,
  CTPaymentMethodUpdateRequest,
  CTPaymentMethodUpdateResponse,
  CTPaymentMethodDeleteResponse,
  CTResourceApi,
  CTResourcesListResponse,
  CTResourceGetResponse,
  CTSignedFormApi,
  CTSignedFormsListResponse,
  CTSimpleProductApi,
  CTSimpleProductsListResponse,
  CTWebsiteApi,
  CTWebsiteGetResponse,
  CTFilingProduct,
  CTFilingMethod,
} from './api-types';
import { CTJurisdiction } from './jurisdictions';

export interface CorporateToolsConfig {
  apiUrl: string;
  accessKey: string;
  secretKey: string;
  websiteUrl?: string;
  timeout?: number;
  logger?: {
    log: (message: string) => void;
    error: (message: string) => void;
    debug: (message: string) => void;
  };
}

export class CorporateToolsClient {
  private readonly logger: Required<CorporateToolsConfig>['logger'];
  private readonly http: AxiosInstance;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly websiteUrl?: string;

  constructor(config: CorporateToolsConfig) {
    if (!config.apiUrl || !config.accessKey || !config.secretKey) {
      throw new Error(
        'CorporateTools: apiUrl, accessKey, and secretKey are required',
      );
    }

    this.accessKey = config.accessKey;
    this.secretKey = config.secretKey;
    this.websiteUrl = config.websiteUrl;
    this.logger = config.logger || {
      log: console.log.bind(console),
      error: console.error.bind(console),
      debug: console.debug.bind(console),
    };

    this.http = axios.create({
      baseURL: config.apiUrl,
      timeout: config.timeout || 30000,
    });

    this.logger.log('CorporateToolsClient initialized successfully');
  }

  /* -------------------- AUTH & SIGNING -------------------- */

  private signToken(path: string, body: any = null): string {
    let contentHash: string;

    if (body) {
      const bodyString = JSON.stringify(body);
      contentHash = crypto.createHash('sha256').update(bodyString).digest('hex');
    } else {
      contentHash = crypto.createHash('sha256').update('').digest('hex');
    }

    const payload = {
      path: path,
      content: contentHash,
    };

    return jwt.sign(payload, this.secretKey, {
      algorithm: 'HS256',
      header: {
        access_key: this.accessKey,
      } as any,
    });
  }

  async request<T = any>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    path: string,
    options: {
      data?: any;
      params?: Record<string, any>;
      headers?: AxiosRequestConfig['headers'];
    } = {},
  ): Promise<T> {
    // Query parameters must be added to path in GET requests because signature is validated on path
    let fullPath = path;
    if (options.params && Object.keys(options.params).length > 0) {
      const queryParams = new URLSearchParams();

      // Properly encode parameters (array support, etc.)
      Object.entries(options.params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(`${key}[]`, String(v)));
        } else if (value !== undefined && value !== null) {
          if (typeof value === 'object') {
            queryParams.append(key, JSON.stringify(value));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const queryString = queryParams.toString();
      // URLSearchParams encodes everything, but example code has a manual loop.
      // For simplicity, we add to path instead of axios params serializer so signature works.
      if (queryString) {
        fullPath += `?${queryString}`;
      }
    }

    // Create token (with fullPath including query params and data)
    const token = this.signToken(fullPath, options.data);

    try {
      this.logger.debug(`Requesting: ${method} ${fullPath}`);

      const res = await this.http.request<T>({
        method,
        url: fullPath, // Query parameters included here
        data: options.data,
        // params: options.params, // We already embedded params in path above, don't pass again here
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return res.data;
    } catch (err: any) {
      if (err.response) {
        const msg = err.response.data?.message || err.message;
        this.logger.error(
          `API Error ${err.response.status}: ${JSON.stringify(err.response.data)}`,
        );
        throw new Error(
          `CorporateTools API error (${err.response.status}): ${msg}`,
        );
      }
      throw err;
    }
  }

  /* -------------------- ACCOUNT -------------------- */

  async getAccount(): Promise<CTAccountApi> {
    const res = await this.request<CTAccountGetResponse>('GET', '/account');
    return res.result.account;
  }

  async getAccountDashpanel(): Promise<CTAccountDashpanelApi> {
    const res = await this.request<CTAccountDashpanelResponse>(
      'GET',
      '/account/dashpanel',
    );
    return res.result;
  }

  /* -------------------- CALLBACKS -------------------- */

  async listCallbacks(): Promise<CTCallbackApi[]> {
    const res = await this.request<CTCallbacksListResponse>(
      'GET',
      '/callbacks',
    );
    return res.result;
  }

  async createCallback(url: string): Promise<CTCallbackApi> {
    const res = await this.request<CTCallbackCreateResponse>(
      'POST',
      '/callbacks',
      { data: { url } },
    );
    return res.result;
  }

  async deleteCallback(id: string): Promise<void> {
    await this.request<any>('DELETE', `/callbacks/${encodeURIComponent(id)}`);
  }

  /* -------------------- COMPLIANCE EVENTS -------------------- */

  async listComplianceEvents(params: {
    company?: string;
    company_id?: string;
    start_date: string;
    end_date: string;
    limit?: number;
    offset?: number;
    jurisdictions?: CTJurisdiction[];
  }): Promise<CTComplianceEventApi[]> {
    const hasCompany = !!params.company;
    const hasCompanyId = !!params.company_id;

    if (hasCompany === hasCompanyId) {
      throw new Error(
        'CorporateTools listComplianceEvents: either company or company_id must be provided, but not both.',
      );
    }

    if (!params.start_date || !params.end_date) {
      throw new Error(
        'CorporateTools listComplianceEvents: start_date and end_date are required.',
      );
    }

    const query: Record<string, any> = {
      start_date: params.start_date,
      end_date: params.end_date,
    };

    if (params.limit !== undefined) query.limit = params.limit;
    if (params.offset !== undefined) query.offset = params.offset;
    if (params.company) query.company = params.company;
    if (params.company_id) query.company_id = params.company_id;
    if (params.jurisdictions && params.jurisdictions.length > 0) {
      query.jurisdictions = params.jurisdictions;
    }

    const res = await this.request<CTComplianceEventsListResponse>(
      'GET',
      '/compliance-events',
      { params: query },
    );

    return res.result;
  }

  /* -------------------- COMPANIES -------------------- */

  async listCompanies(params?: {
    limit?: number;
    offset?: number;
    names?: string[];
  }): Promise<CTCompanyApi[]> {
    const query: Record<string, any> = {};

    if (params?.limit !== undefined) query.limit = params.limit;
    if (params?.offset !== undefined) query.offset = params.offset;
    if (params?.names && params.names.length > 0) {
      query.names = params.names;
    }

    const res = await this.request<CTCompaniesListResponse>(
      'GET',
      '/companies',
      { params: query },
    );

    return res.result;
  }

  async getCompany(id: string): Promise<CTCompanyApi | null> {
    try {
      const res = await this.request<CTCompanyGetResponse>(
        'GET',
        `/companies/${encodeURIComponent(id)}`,
      );
      return res.result;
    } catch (e: any) {
      if (e.message?.includes('404')) return null;
      throw e;
    }
  }

  async createCompany(
    company: {
      name: string;
      entity_type: CTEntityType;
      jurisdictions?: CTJurisdiction[];
      home_state?: CTJurisdiction;
    },
    options?: { duplicateNameAllowed?: boolean },
  ): Promise<CTCompanyApi> {
    const body: CTCompaniesCreateRequest = {
      companies: [company],
      duplicate_name_allowed: options?.duplicateNameAllowed,
    };

    const res = await this.request<CTCompaniesCreateResponse>(
      'POST',
      '/companies',
      { data: body },
    );

    const created = res.result[0];
    if (!created) {
      throw new Error('CorporateTools: createCompany returned empty result');
    }

    return created;
  }

  async updateCompanies(
    payload: CTCompaniesUpdateRequest,
  ): Promise<CTCompanyApi[]> {
    const res = await this.request<CTCompaniesUpdateResponse>(
      'PATCH',
      '/companies',
      { data: payload },
    );
    return res.result;
  }

  /* ------------------- REGISTERED AGENT PRODUCTS ------------------- */

  async listRegisteredAgentProducts(): Promise<CTRegisteredAgentProduct[]> {
    const res = await this.request('GET', '/registered-agent-products', {
      params: { url: this.websiteUrl },
    });
    return res.result;
  }

  /* -------------------- FILING PRODUCTS & METHODS -------------------- */

  async listFilingProducts(params?: {
    jurisdiction?: CTJurisdiction;
    entity_type?: CTEntityType;
    url?: string;
  }): Promise<CTFilingProduct[]> {
    const query: Record<string, any> = {};

    if (params?.jurisdiction) query.jurisdiction = params.jurisdiction;
    if (params?.entity_type) query.entity_type = params.entity_type;
    query.url = this.websiteUrl || params?.url;

    const res = await this.request<CTFilingProductsListResponse>(
      'GET',
      '/filing-products',
      { params: query },
    );
    return res.result;
  }

  async listFilingMethods(options?: {
    company_id: string;
    filing_product_id: string;
    jurisdiction?: CTJurisdiction;
  }): Promise<CTFilingMethod[]> {
    const query: Record<string, any> = {};

    if (options?.jurisdiction) {
      query.jurisdiction = options.jurisdiction;
    }

    if (options?.company_id) query.company_id = options.company_id;
    if (options?.filing_product_id)
      query.filing_product_id = options.filing_product_id;

    const res = await this.request<CTFilingMethodsListResponse>(
      'GET',
      '/filing-methods',
      { params: query },
    );
    return res.result;
  }

  async getFilingMethodShemas(
    company_id: string,
    filing_method_id: string,
  ): Promise<any> {
    const res = await this.request<any>('GET', `/filing-methods/schemas`, {
      params: { company_id: company_id, filing_method_id: filing_method_id },
    });
    return res.result;
  }

  async getFilingProductOfferings({
    company_id,
    jurisdiction,
  }: {
    company_id: string;
    jurisdiction: CTJurisdiction;
  }): Promise<any> {
    const query = {
      company_id: company_id,
      jurisdiction: jurisdiction,
    };
    const res = await this.request<CTFilingMethodsListResponse>(
      'GET',
      '/filing-products/offerings',
      { params: query },
    );
    return res.result;
  }

  /* -------------------- DOCUMENTS -------------------- */

  async listDocuments(params?: {
    limit?: number;
    offset?: number;
    status?: 'read' | 'unread';
    start?: string;
    stop?: string;
    jurisdiction?: CTJurisdiction;
    company_id?: string;
  }): Promise<CTDocumentApi[]> {
    const query: Record<string, any> = {};

    if (params?.limit !== undefined) query.limit = params.limit;
    if (params?.offset !== undefined) query.offset = params.offset;
    if (params?.status) query.status = params.status;
    if (params?.start) query.start = params.start;
    if (params?.stop) query.stop = params.stop;
    if (params?.jurisdiction) query.jurisdiction = params.jurisdiction;
    if (params?.company_id) query.company_id = params.company_id;

    const res = await this.request<CTDocumentsListResponse>(
      'GET',
      '/documents',
      { params: query },
    );
    return res.result;
  }

  async getDocument(id: string): Promise<CTDocumentApi | null> {
    try {
      const res = await this.request<CTDocumentGetResponse>(
        'GET',
        `/documents/${encodeURIComponent(id)}`,
      );
      return res.result;
    } catch (e: any) {
      if (e.message?.includes('404')) return null;
      throw e;
    }
  }

  async getDocumentPageAsPng(
    id: string,
    pageNumber: number,
    dpi?: 72 | 150 | 300,
  ): Promise<Buffer> {
    const path = `/documents/${encodeURIComponent(id)}/page/${pageNumber}`;
    // Query params must be added to path for signature
    const fullPath = dpi ? `${path}?dpi=${dpi}` : path;
    const token = this.signToken(fullPath); // No body

    const res = await this.http.request<ArrayBuffer>({
      method: 'GET',
      url: fullPath,
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'image/png',
      },
    });

    return Buffer.from(res.data);
  }

  async getDocumentPageUrl(
    id: string,
    pageNumber: number,
    dpi?: 72 | 150 | 300,
  ): Promise<CTDocumentPageUrlResult> {
    const query: Record<string, any> = {};
    if (dpi) query.dpi = dpi;

    const res = await this.request<CTDocumentPageUrlResponse>(
      'GET',
      `/documents/${encodeURIComponent(id)}/page/${pageNumber}/url`,
      {
        params: query,
      },
    );

    return res.result;
  }

  async bulkDownloadDocuments(
    ids: string[],
  ): Promise<CTDocumentsBulkDownloadResult[]> {
    const res = await this.request<CTDocumentsBulkDownloadResponse>(
      'GET',
      '/documents/bulk-download',
      { params: { ids } },
    );

    return res.result;
  }

  async downloadDocumentPdf(id: string): Promise<Buffer> {
    const path = `/documents/${encodeURIComponent(id)}/download`;
    const token = this.signToken(path);

    const res = await this.http.request<ArrayBuffer>({
      method: 'GET',
      url: path,
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/pdf',
      },
    });

    return Buffer.from(res.data);
  }

  async unlockDocument(
    id: string,
    paymentToken: string,
  ): Promise<CTDocumentUnlockResult> {
    const res = await this.request<CTDocumentUnlockResponse>(
      'POST',
      `/documents/unlock/${encodeURIComponent(id)}`,
      {
        data: {
          payment_token: paymentToken,
        },
      },
    );

    return res.result;
  }

  /* -------------------- INVOICES -------------------- */

  async listInvoices(params: {
    limit?: number;
    offset?: number;
    companies?: string[];
    company_ids?: string[];
    start_date?: string;
    end_date?: string;
    status?: 'paid' | 'unpaid';
  }): Promise<CTInvoiceApi[]> {
    const hasCompanies = !!(params.companies && params.companies.length);
    const hasCompanyIds = !!(params.company_ids && params.company_ids.length);

    if (hasCompanies === hasCompanyIds) {
      throw new Error(
        'CorporateTools listInvoices: either companies or company_ids must be provided, but not both.',
      );
    }

    const query: Record<string, any> = {};

    if (params.limit !== undefined) query.limit = params.limit;
    if (params.offset !== undefined) query.offset = params.offset;
    if (params.companies && params.companies.length > 0) {
      query.companies = params.companies;
    }
    if (params.company_ids && params.company_ids.length > 0) {
      query.company_ids = params.company_ids;
    }
    if (params.start_date) query.start_date = params.start_date;
    if (params.end_date) query.end_date = params.end_date;
    if (params.status) query.status = params.status;

    const res = await this.request<CTInvoicesListResponse>(
      'GET',
      '/invoices',
      { params: query },
    );

    return res.result;
  }

  async getInvoice(id: string): Promise<CTInvoiceApi | null> {
    try {
      const res = await this.request<CTInvoiceGetResponse>(
        'GET',
        `/invoices/${encodeURIComponent(id)}`,
      );
      return res.result;
    } catch (e: any) {
      if (e.message?.includes('404')) return null;
      throw e;
    }
  }

  async payInvoices(
    paymentToken: string,
    invoiceIds: string[],
  ): Promise<CTInvoicesPayResult> {
    if (!invoiceIds.length) {
      throw new Error(
        'CorporateTools payInvoices: invoiceIds list cannot be empty.',
      );
    }

    const res = await this.request<CTInvoicesPayResponse>(
      'POST',
      '/invoices/pay',
      {
        data: {
          payment_token: paymentToken,
          invoice_ids: invoiceIds,
        },
      },
    );

    return res.result;
  }

  /* -------------------- SERVICES -------------------- */

  async listServices(params: {
    company?: string;
    company_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<CTServiceApi[]> {
    const hasCompany = !!params.company;
    const hasCompanyId = !!params.company_id;

    if (hasCompany === hasCompanyId) {
      throw new Error(
        'CorporateTools listServices: either company or company_id must be provided, but not both.',
      );
    }

    const query: Record<string, any> = {};

    if (params.company) query.company = params.company;
    if (params.company_id) query.company_id = params.company_id;
    if (params.limit !== undefined) query.limit = params.limit;
    if (params.offset !== undefined) query.offset = params.offset;

    const res = await this.request<CTServicesListResponse>(
      'GET',
      '/services',
      { params: query },
    );

    return res.result;
  }

  async createServices(payload: {
    company?: string;
    company_id?: string;
    jurisdictions?: CTJurisdiction[];
  }): Promise<CTServiceApi[]> {
    const hasCompany = !!payload.company;
    const hasCompanyId = !!payload.company_id;

    if (hasCompany === hasCompanyId) {
      throw new Error(
        'CorporateTools createServices: either company or company_id must be provided, but not both.',
      );
    }

    const body: CTServicesCreateRequest = {
      company: payload.company,
      company_id: payload.company_id,
      jurisdictions: payload.jurisdictions,
    };

    const res = await this.request<CTServicesCreateResponse>(
      'POST',
      '/services',
      { data: body },
    );

    return res.result;
  }

  async requestServiceCancel(id: string): Promise<CTServiceApi> {
    const res = await this.request<CTServiceCancelRequestResponse>(
      'POST',
      `/services/${encodeURIComponent(id)}/cancel-request`,
    );
    return res.result;
  }

  async getServiceInfo<T = any>(id: string): Promise<T> {
    const res = await this.request<CTServiceInfoGetResponse<T>>(
      'GET',
      `/services/${encodeURIComponent(id)}/info`,
    );
    return res.result;
  }

  async updateServiceInfo(
    id: string,
    info: any,
  ): Promise<CTServiceApi> {
    const res = await this.request<CTServiceInfoUpdateResponse>(
      'POST',
      `/services/${encodeURIComponent(id)}/info`,
      { data: info },
    );
    return res.result;
  }

  /* -------------------- PAYMENT METHODS -------------------- */

  async getPaymentMethods(): Promise<CTPaymentMethodApi[]> {
    const res = await this.request<CTPaymentMethodsListResponse>(
      'GET',
      '/payment-methods',
    );
    return res.result;
  }

  async createPaymentMethod(
    payload: CTPaymentMethodCreateRequest,
  ): Promise<CTPaymentMethodCreateResponse['result']> {
    const res = await this.request<CTPaymentMethodCreateResponse>(
      'POST',
      '/payment-methods',
      { data: payload },
    );
    return res.result;
  }

  async deletePaymentMethod(id: string): Promise<void> {
    await this.request<CTPaymentMethodDeleteResponse>(
      'DELETE',
      `/payment-methods/${encodeURIComponent(id)}`,
    );
  }

  async updatePaymentMethod(
    id: string,
    payload: CTPaymentMethodUpdateRequest,
  ): Promise<CTPaymentMethodUpdateResponse['result']> {
    const res = await this.request<CTPaymentMethodUpdateResponse>(
      'PATCH',
      `/payment-methods/${encodeURIComponent(id)}`,
      { data: payload },
    );
    return res.result;
  }

  /* -------------------- SHOPPING CART -------------------- */

  /**
   * Add item to shopping cart
   */
  async addToShoppingCart(params: {
    companyId: string;
    productId: string;
    filingMethodId: string;
    quantity?: number;
    formData?: Record<string, any>;
  }): Promise<any> {
    const body: any = {
      company_id: params.companyId,
      product_id: params.productId,
      product_option_id: params.filingMethodId,
      quantity: params.quantity || 1,
    };

    if (params.formData) {
      body.form_data = params.formData;
    }

    const res = await this.request<any>('POST', '/shopping-cart', {
      data: body,
    });

    return res;
  }

  /**
   * Get shopping cart items
   */
  async getShoppingCart(params?: {
    companyIds?: string[];
  }): Promise<any[]> {
    const queryParams: Record<string, any> = {};

    if (params?.companyIds && params.companyIds.length > 0) {
      queryParams.company_ids = params.companyIds;
    }

    const res = await this.request<any>('GET', '/shopping-cart', {
      params: queryParams,
    });

    return res.result || [];
  }

  /**
   * Checkout shopping cart
   */
  async checkoutShoppingCart(params: {
    itemIds: string[];
    paymentMethodId: string;
  }): Promise<{ success: boolean; invoice_ids: string[] }> {
    const body = {
      item_ids: params.itemIds,
      payment_token: params.paymentMethodId,
    };

    const res = await this.request<{
      success: boolean;
      invoice_ids: string[];
    }>('POST', '/shopping-cart/checkout', {
      data: body,
    });

    return res;
  }

  /**
   * Delete shopping cart items
   */
  async deleteShoppingCartItem(itemIds: string[]): Promise<void> {
    const body = {
      item_ids: itemIds,
    };

    await this.request<any>('DELETE', '/shopping-cart', {
      data: body,
    });
  }

  /* -------------------- ORDER ITEMS -------------------- */

  async listOrderItemsRequiringAttention(
    companyId?: string,
  ): Promise<CTOrderItemApi[]> {
    const query: Record<string, any> = {};
    if (companyId) query.company_id = companyId;

    const res = await this.request<CTOrderItemsListResponse>(
      'GET',
      '/order-items/requiring-attention',
      { params: query },
    );
    return res.result;
  }

  async updateOrderItemRequiringAttention(
    payload: CTOrderItemUpdateRequest,
  ): Promise<CTOrderItemApi> {
    const res = await this.request<CTOrderItemUpdateResponse>(
      'POST',
      '/order-items/requiring-attention',
      { data: payload },
    );
    return res.result;
  }

  /* -------------------- RESOURCES -------------------- */

  async listResources(params?: {
    limit?: number;
    offset?: number;
    entity_type?: string;
    agency?: string;
    jurisdiction?: CTJurisdiction;
    name?: string;
  }): Promise<CTResourceApi[]> {
    const query: Record<string, any> = {};

    if (params?.limit !== undefined) query.limit = params.limit;
    if (params?.offset !== undefined) query.offset = params.offset;
    if (params?.entity_type) query.entity_type = params.entity_type;
    if (params?.agency) query.agency = params.agency;
    if (params?.jurisdiction) query.jurisdiction = params.jurisdiction;
    if (params?.name) query.name = params.name;

    const res = await this.request<CTResourcesListResponse>(
      'GET',
      '/resources',
      { params: query },
    );
    return res.result;
  }

  async getResource(id: string): Promise<CTResourceApi | null> {
    try {
      const res = await this.request<CTResourceGetResponse>(
        'GET',
        `/resources/${encodeURIComponent(id)}`,
      );
      return res.result;
    } catch (e: any) {
      if (e.message?.includes('404')) return null;
      throw e;
    }
  }

  async getResourcePageAsPng(
    id: string,
    pageNumber: number,
    dpi?: 72 | 150 | 300,
  ): Promise<Buffer> {
    const path = `/resources/${encodeURIComponent(id)}/page/${pageNumber}`;
    const fullPath = dpi ? `${path}?dpi=${dpi}` : path;
    const token = this.signToken(fullPath);

    const res = await this.http.request<ArrayBuffer>({
      method: 'GET',
      url: fullPath,
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'image/png',
      },
    });

    return Buffer.from(res.data);
  }

  async downloadResourcePdf(id: string): Promise<Buffer> {
    const path = `/resources/${encodeURIComponent(id)}/download`;
    const token = this.signToken(path);

    const res = await this.http.request<ArrayBuffer>({
      method: 'GET',
      url: path,
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/pdf',
      },
    });

    return Buffer.from(res.data);
  }

  /* -------------------- SIGNED FORMS -------------------- */

  async getSignedForms(params: {
    filing_method_id: string;
    website_id: string;
  }): Promise<CTSignedFormApi[]> {
    const res = await this.request<CTSignedFormsListResponse>(
      'GET',
      '/signed-forms',
      { params },
    );
    return res.result;
  }

  /* -------------------- SIMPLE PRODUCTS -------------------- */

  async listSimpleProducts(): Promise<CTSimpleProductApi[]> {
    const res = await this.request<CTSimpleProductsListResponse>(
      'GET',
      '/simple-products',
      {
        params: {
          url: this.websiteUrl,
        },
      },
    );
    return res.result;
  }

  /* -------------------- WEBSITES -------------------- */

  async getWebsite(): Promise<CTWebsiteApi> {
    const res = await this.request<CTWebsiteGetResponse>('GET', '/websites', {
      params: {
        url: this.websiteUrl,
      },
    });
    return res.result;
  }
}

