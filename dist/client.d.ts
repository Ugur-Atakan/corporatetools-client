import { AxiosRequestConfig } from 'axios';
import { CTEntityType } from './entity-types';
import { CTCompanyApi, CTCompaniesUpdateRequest, CTRegisteredAgentProduct, CTComplianceEventApi, CTCallbackApi, CTDocumentApi, CTDocumentPageUrlResult, CTDocumentsBulkDownloadResult, CTDocumentUnlockResult, CTInvoiceApi, CTInvoicesPayResult, CTServiceApi, CTAccountApi, CTAccountDashpanelApi, CTOrderItemApi, CTOrderItemUpdateRequest, CTPaymentMethodApi, CTPaymentMethodCreateRequest, CTPaymentMethodCreateResponse, CTPaymentMethodUpdateRequest, CTPaymentMethodUpdateResponse, CTResourceApi, CTSignedFormApi, CTSimpleProductApi, CTWebsiteApi, CTFilingProduct, CTFilingMethod } from './api-types';
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
export declare class CorporateToolsClient {
    private readonly logger;
    private readonly http;
    private readonly accessKey;
    private readonly secretKey;
    private readonly websiteUrl?;
    constructor(config: CorporateToolsConfig);
    private signToken;
    request<T = any>(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', path: string, options?: {
        data?: any;
        params?: Record<string, any>;
        headers?: AxiosRequestConfig['headers'];
    }): Promise<T>;
    getAccount(): Promise<CTAccountApi>;
    getAccountDashpanel(): Promise<CTAccountDashpanelApi>;
    listCallbacks(): Promise<CTCallbackApi[]>;
    createCallback(url: string): Promise<CTCallbackApi>;
    deleteCallback(id: string): Promise<void>;
    listComplianceEvents(params: {
        company?: string;
        company_id?: string;
        start_date: string;
        end_date: string;
        limit?: number;
        offset?: number;
        jurisdictions?: CTJurisdiction[];
    }): Promise<CTComplianceEventApi[]>;
    listCompanies(params?: {
        limit?: number;
        offset?: number;
        names?: string[];
    }): Promise<CTCompanyApi[]>;
    getCompany(id: string): Promise<CTCompanyApi | null>;
    createCompany(company: {
        name: string;
        entity_type: CTEntityType;
        jurisdictions?: CTJurisdiction[];
        home_state?: CTJurisdiction;
    }, options?: {
        duplicateNameAllowed?: boolean;
    }): Promise<CTCompanyApi>;
    updateCompanies(payload: CTCompaniesUpdateRequest): Promise<CTCompanyApi[]>;
    listRegisteredAgentProducts(): Promise<CTRegisteredAgentProduct[]>;
    listFilingProducts(params?: {
        jurisdiction?: CTJurisdiction;
        entity_type?: CTEntityType;
        url?: string;
    }): Promise<CTFilingProduct[]>;
    listFilingMethods(options?: {
        company_id: string;
        filing_product_id: string;
        jurisdiction?: CTJurisdiction;
    }): Promise<CTFilingMethod[]>;
    getFilingMethodShemas(company_id: string, filing_method_id: string): Promise<any>;
    getFilingProductOfferings({ company_id, jurisdiction, }: {
        company_id: string;
        jurisdiction: CTJurisdiction;
    }): Promise<any>;
    listDocuments(params?: {
        limit?: number;
        offset?: number;
        status?: 'read' | 'unread';
        start?: string;
        stop?: string;
        jurisdiction?: CTJurisdiction;
        company_id?: string;
    }): Promise<CTDocumentApi[]>;
    getDocument(id: string): Promise<CTDocumentApi | null>;
    getDocumentPageAsPng(id: string, pageNumber: number, dpi?: 72 | 150 | 300): Promise<Buffer>;
    getDocumentPageUrl(id: string, pageNumber: number, dpi?: 72 | 150 | 300): Promise<CTDocumentPageUrlResult>;
    bulkDownloadDocuments(ids: string[]): Promise<CTDocumentsBulkDownloadResult[]>;
    downloadDocumentPdf(id: string): Promise<Buffer>;
    unlockDocument(id: string, paymentToken: string): Promise<CTDocumentUnlockResult>;
    listInvoices(params: {
        limit?: number;
        offset?: number;
        companies?: string[];
        company_ids?: string[];
        start_date?: string;
        end_date?: string;
        status?: 'paid' | 'unpaid';
    }): Promise<CTInvoiceApi[]>;
    getInvoice(id: string): Promise<CTInvoiceApi | null>;
    payInvoices(paymentToken: string, invoiceIds: string[]): Promise<CTInvoicesPayResult>;
    listServices(params: {
        company?: string;
        company_id?: string;
        limit?: number;
        offset?: number;
    }): Promise<CTServiceApi[]>;
    createServices(payload: {
        company?: string;
        company_id?: string;
        jurisdictions?: CTJurisdiction[];
    }): Promise<CTServiceApi[]>;
    requestServiceCancel(id: string): Promise<CTServiceApi>;
    getServiceInfo<T = any>(id: string): Promise<T>;
    updateServiceInfo(id: string, info: any): Promise<CTServiceApi>;
    getPaymentMethods(): Promise<CTPaymentMethodApi[]>;
    createPaymentMethod(payload: CTPaymentMethodCreateRequest): Promise<CTPaymentMethodCreateResponse['result']>;
    deletePaymentMethod(id: string): Promise<void>;
    updatePaymentMethod(id: string, payload: CTPaymentMethodUpdateRequest): Promise<CTPaymentMethodUpdateResponse['result']>;
    /**
     * Add item to shopping cart
     */
    addToShoppingCart(params: {
        companyId: string;
        productId: string;
        filingMethodId: string;
        quantity?: number;
        formData?: Record<string, any>;
    }): Promise<any>;
    /**
     * Get shopping cart items
     */
    getShoppingCart(params?: {
        companyIds?: string[];
    }): Promise<any[]>;
    /**
     * Checkout shopping cart
     */
    checkoutShoppingCart(params: {
        itemIds: string[];
        paymentMethodId: string;
    }): Promise<{
        success: boolean;
        invoice_ids: string[];
    }>;
    /**
     * Delete shopping cart items
     */
    deleteShoppingCartItem(itemIds: string[]): Promise<void>;
    listOrderItemsRequiringAttention(companyId?: string): Promise<CTOrderItemApi[]>;
    updateOrderItemRequiringAttention(payload: CTOrderItemUpdateRequest): Promise<CTOrderItemApi>;
    listResources(params?: {
        limit?: number;
        offset?: number;
        entity_type?: string;
        agency?: string;
        jurisdiction?: CTJurisdiction;
        name?: string;
    }): Promise<CTResourceApi[]>;
    getResource(id: string): Promise<CTResourceApi | null>;
    getResourcePageAsPng(id: string, pageNumber: number, dpi?: 72 | 150 | 300): Promise<Buffer>;
    downloadResourcePdf(id: string): Promise<Buffer>;
    getSignedForms(params: {
        filing_method_id: string;
        website_id: string;
    }): Promise<CTSignedFormApi[]>;
    listSimpleProducts(): Promise<CTSimpleProductApi[]>;
    getWebsite(): Promise<CTWebsiteApi>;
}
