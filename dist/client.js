"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorporateToolsClient = void 0;
const axios_1 = __importDefault(require("axios"));
const jwt = __importStar(require("jsonwebtoken"));
const crypto = __importStar(require("crypto"));
class CorporateToolsClient {
    constructor(config) {
        if (!config.apiUrl || !config.accessKey || !config.secretKey) {
            throw new Error('CorporateTools: apiUrl, accessKey, and secretKey are required');
        }
        this.accessKey = config.accessKey;
        this.secretKey = config.secretKey;
        this.websiteUrl = config.websiteUrl;
        this.logger = config.logger || {
            log: console.log.bind(console),
            error: console.error.bind(console),
            debug: console.debug.bind(console),
        };
        this.http = axios_1.default.create({
            baseURL: config.apiUrl,
            timeout: config.timeout || 30000,
        });
        this.logger.log('CorporateToolsClient initialized successfully');
    }
    /* -------------------- AUTH & SIGNING -------------------- */
    signToken(path, body = null) {
        let contentHash;
        if (body) {
            const bodyString = JSON.stringify(body);
            contentHash = crypto.createHash('sha256').update(bodyString).digest('hex');
        }
        else {
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
            },
        });
    }
    async request(method, path, options = {}) {
        // Query parameters must be added to path in GET requests because signature is validated on path
        let fullPath = path;
        if (options.params && Object.keys(options.params).length > 0) {
            const queryParams = new URLSearchParams();
            // Properly encode parameters (array support, etc.)
            Object.entries(options.params).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((v) => queryParams.append(`${key}[]`, String(v)));
                }
                else if (value !== undefined && value !== null) {
                    if (typeof value === 'object') {
                        queryParams.append(key, JSON.stringify(value));
                    }
                    else {
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
            const res = await this.http.request({
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
        }
        catch (err) {
            if (err.response) {
                const msg = err.response.data?.message || err.message;
                this.logger.error(`API Error ${err.response.status}: ${JSON.stringify(err.response.data)}`);
                throw new Error(`CorporateTools API error (${err.response.status}): ${msg}`);
            }
            throw err;
        }
    }
    /* -------------------- ACCOUNT -------------------- */
    async getAccount() {
        const res = await this.request('GET', '/account');
        return res.result.account;
    }
    async getAccountDashpanel() {
        const res = await this.request('GET', '/account/dashpanel');
        return res.result;
    }
    /* -------------------- CALLBACKS -------------------- */
    async listCallbacks() {
        const res = await this.request('GET', '/callbacks');
        return res.result;
    }
    async createCallback(url) {
        const res = await this.request('POST', '/callbacks', { data: { url } });
        return res.result;
    }
    async deleteCallback(id) {
        await this.request('DELETE', `/callbacks/${encodeURIComponent(id)}`);
    }
    /* -------------------- COMPLIANCE EVENTS -------------------- */
    async listComplianceEvents(params) {
        const hasCompany = !!params.company;
        const hasCompanyId = !!params.company_id;
        if (hasCompany === hasCompanyId) {
            throw new Error('CorporateTools listComplianceEvents: either company or company_id must be provided, but not both.');
        }
        if (!params.start_date || !params.end_date) {
            throw new Error('CorporateTools listComplianceEvents: start_date and end_date are required.');
        }
        const query = {
            start_date: params.start_date,
            end_date: params.end_date,
        };
        if (params.limit !== undefined)
            query.limit = params.limit;
        if (params.offset !== undefined)
            query.offset = params.offset;
        if (params.company)
            query.company = params.company;
        if (params.company_id)
            query.company_id = params.company_id;
        if (params.jurisdictions && params.jurisdictions.length > 0) {
            query.jurisdictions = params.jurisdictions;
        }
        const res = await this.request('GET', '/compliance-events', { params: query });
        return res.result;
    }
    /* -------------------- COMPANIES -------------------- */
    async listCompanies(params) {
        const query = {};
        if (params?.limit !== undefined)
            query.limit = params.limit;
        if (params?.offset !== undefined)
            query.offset = params.offset;
        if (params?.names && params.names.length > 0) {
            query.names = params.names;
        }
        const res = await this.request('GET', '/companies', { params: query });
        return res.result;
    }
    async getCompany(id) {
        try {
            const res = await this.request('GET', `/companies/${encodeURIComponent(id)}`);
            return res.result;
        }
        catch (e) {
            if (e.message?.includes('404'))
                return null;
            throw e;
        }
    }
    async createCompany(company, options) {
        const body = {
            companies: [company],
            duplicate_name_allowed: options?.duplicateNameAllowed,
        };
        const res = await this.request('POST', '/companies', { data: body });
        const created = res.result[0];
        if (!created) {
            throw new Error('CorporateTools: createCompany returned empty result');
        }
        return created;
    }
    async updateCompanies(payload) {
        const res = await this.request('PATCH', '/companies', { data: payload });
        return res.result;
    }
    /* ------------------- REGISTERED AGENT PRODUCTS ------------------- */
    async listRegisteredAgentProducts() {
        const res = await this.request('GET', '/registered-agent-products', {
            params: { url: this.websiteUrl },
        });
        return res.result;
    }
    /* -------------------- FILING PRODUCTS & METHODS -------------------- */
    async listFilingProducts(params) {
        const query = {};
        if (params?.jurisdiction)
            query.jurisdiction = params.jurisdiction;
        if (params?.entity_type)
            query.entity_type = params.entity_type;
        query.url = this.websiteUrl || params?.url;
        const res = await this.request('GET', '/filing-products', { params: query });
        return res.result;
    }
    async listFilingMethods(options) {
        const query = {};
        if (options?.jurisdiction) {
            query.jurisdiction = options.jurisdiction;
        }
        if (options?.company_id)
            query.company_id = options.company_id;
        if (options?.filing_product_id)
            query.filing_product_id = options.filing_product_id;
        const res = await this.request('GET', '/filing-methods', { params: query });
        return res.result;
    }
    async getFilingMethodShemas(company_id, filing_method_id) {
        const res = await this.request('GET', `/filing-methods/schemas`, {
            params: { company_id: company_id, filing_method_id: filing_method_id },
        });
        return res.result;
    }
    async getFilingProductOfferings({ company_id, jurisdiction, }) {
        const query = {
            company_id: company_id,
            jurisdiction: jurisdiction,
        };
        const res = await this.request('GET', '/filing-products/offerings', { params: query });
        return res.result;
    }
    /* -------------------- DOCUMENTS -------------------- */
    async listDocuments(params) {
        const query = {};
        if (params?.limit !== undefined)
            query.limit = params.limit;
        if (params?.offset !== undefined)
            query.offset = params.offset;
        if (params?.status)
            query.status = params.status;
        if (params?.start)
            query.start = params.start;
        if (params?.stop)
            query.stop = params.stop;
        if (params?.jurisdiction)
            query.jurisdiction = params.jurisdiction;
        if (params?.company_id)
            query.company_id = params.company_id;
        const res = await this.request('GET', '/documents', { params: query });
        return res.result;
    }
    async getDocument(id) {
        try {
            const res = await this.request('GET', `/documents/${encodeURIComponent(id)}`);
            return res.result;
        }
        catch (e) {
            if (e.message?.includes('404'))
                return null;
            throw e;
        }
    }
    async getDocumentPageAsPng(id, pageNumber, dpi) {
        const path = `/documents/${encodeURIComponent(id)}/page/${pageNumber}`;
        // Query params must be added to path for signature
        const fullPath = dpi ? `${path}?dpi=${dpi}` : path;
        const token = this.signToken(fullPath); // No body
        const res = await this.http.request({
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
    async getDocumentPageUrl(id, pageNumber, dpi) {
        const query = {};
        if (dpi)
            query.dpi = dpi;
        const res = await this.request('GET', `/documents/${encodeURIComponent(id)}/page/${pageNumber}/url`, {
            params: query,
        });
        return res.result;
    }
    async bulkDownloadDocuments(ids) {
        const res = await this.request('GET', '/documents/bulk-download', { params: { ids } });
        return res.result;
    }
    async downloadDocumentPdf(id) {
        const path = `/documents/${encodeURIComponent(id)}/download`;
        const token = this.signToken(path);
        const res = await this.http.request({
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
    async unlockDocument(id, paymentToken) {
        const res = await this.request('POST', `/documents/unlock/${encodeURIComponent(id)}`, {
            data: {
                payment_token: paymentToken,
            },
        });
        return res.result;
    }
    /* -------------------- INVOICES -------------------- */
    async listInvoices(params) {
        const hasCompanies = !!(params.companies && params.companies.length);
        const hasCompanyIds = !!(params.company_ids && params.company_ids.length);
        if (hasCompanies === hasCompanyIds) {
            throw new Error('CorporateTools listInvoices: either companies or company_ids must be provided, but not both.');
        }
        const query = {};
        if (params.limit !== undefined)
            query.limit = params.limit;
        if (params.offset !== undefined)
            query.offset = params.offset;
        if (params.companies && params.companies.length > 0) {
            query.companies = params.companies;
        }
        if (params.company_ids && params.company_ids.length > 0) {
            query.company_ids = params.company_ids;
        }
        if (params.start_date)
            query.start_date = params.start_date;
        if (params.end_date)
            query.end_date = params.end_date;
        if (params.status)
            query.status = params.status;
        const res = await this.request('GET', '/invoices', { params: query });
        return res.result;
    }
    async getInvoice(id) {
        try {
            const res = await this.request('GET', `/invoices/${encodeURIComponent(id)}`);
            return res.result;
        }
        catch (e) {
            if (e.message?.includes('404'))
                return null;
            throw e;
        }
    }
    async payInvoices(paymentToken, invoiceIds) {
        if (!invoiceIds.length) {
            throw new Error('CorporateTools payInvoices: invoiceIds list cannot be empty.');
        }
        const res = await this.request('POST', '/invoices/pay', {
            data: {
                payment_token: paymentToken,
                invoice_ids: invoiceIds,
            },
        });
        return res.result;
    }
    /* -------------------- SERVICES -------------------- */
    async listServices(params) {
        const hasCompany = !!params.company;
        const hasCompanyId = !!params.company_id;
        if (hasCompany === hasCompanyId) {
            throw new Error('CorporateTools listServices: either company or company_id must be provided, but not both.');
        }
        const query = {};
        if (params.company)
            query.company = params.company;
        if (params.company_id)
            query.company_id = params.company_id;
        if (params.limit !== undefined)
            query.limit = params.limit;
        if (params.offset !== undefined)
            query.offset = params.offset;
        const res = await this.request('GET', '/services', { params: query });
        return res.result;
    }
    async createServices(payload) {
        const hasCompany = !!payload.company;
        const hasCompanyId = !!payload.company_id;
        if (hasCompany === hasCompanyId) {
            throw new Error('CorporateTools createServices: either company or company_id must be provided, but not both.');
        }
        const body = {
            company: payload.company,
            company_id: payload.company_id,
            jurisdictions: payload.jurisdictions,
        };
        const res = await this.request('POST', '/services', { data: body });
        return res.result;
    }
    async requestServiceCancel(id) {
        const res = await this.request('POST', `/services/${encodeURIComponent(id)}/cancel-request`);
        return res.result;
    }
    async getServiceInfo(id) {
        const res = await this.request('GET', `/services/${encodeURIComponent(id)}/info`);
        return res.result;
    }
    async updateServiceInfo(id, info) {
        const res = await this.request('POST', `/services/${encodeURIComponent(id)}/info`, { data: info });
        return res.result;
    }
    /* -------------------- PAYMENT METHODS -------------------- */
    async getPaymentMethods() {
        const res = await this.request('GET', '/payment-methods');
        return res.result;
    }
    async createPaymentMethod(payload) {
        const res = await this.request('POST', '/payment-methods', { data: payload });
        return res.result;
    }
    async deletePaymentMethod(id) {
        await this.request('DELETE', `/payment-methods/${encodeURIComponent(id)}`);
    }
    async updatePaymentMethod(id, payload) {
        const res = await this.request('PATCH', `/payment-methods/${encodeURIComponent(id)}`, { data: payload });
        return res.result;
    }
    /* -------------------- SHOPPING CART -------------------- */
    /**
     * Add item to shopping cart
     */
    async addToShoppingCart(params) {
        const body = {
            company_id: params.companyId,
            product_id: params.productId,
            product_option_id: params.filingMethodId,
            quantity: params.quantity || 1,
        };
        if (params.formData) {
            body.form_data = params.formData;
        }
        const res = await this.request('POST', '/shopping-cart', {
            data: body,
        });
        return res;
    }
    /**
     * Get shopping cart items
     */
    async getShoppingCart(params) {
        const queryParams = {};
        if (params?.companyIds && params.companyIds.length > 0) {
            queryParams.company_ids = params.companyIds;
        }
        const res = await this.request('GET', '/shopping-cart', {
            params: queryParams,
        });
        return res.result || [];
    }
    /**
     * Checkout shopping cart
     */
    async checkoutShoppingCart(params) {
        const body = {
            item_ids: params.itemIds,
            payment_token: params.paymentMethodId,
        };
        const res = await this.request('POST', '/shopping-cart/checkout', {
            data: body,
        });
        return res;
    }
    /**
     * Delete shopping cart items
     */
    async deleteShoppingCartItem(itemIds) {
        const body = {
            item_ids: itemIds,
        };
        await this.request('DELETE', '/shopping-cart', {
            data: body,
        });
    }
    /* -------------------- ORDER ITEMS -------------------- */
    async listOrderItemsRequiringAttention(companyId) {
        const query = {};
        if (companyId)
            query.company_id = companyId;
        const res = await this.request('GET', '/order-items/requiring-attention', { params: query });
        return res.result;
    }
    async updateOrderItemRequiringAttention(payload) {
        const res = await this.request('POST', '/order-items/requiring-attention', { data: payload });
        return res.result;
    }
    /* -------------------- RESOURCES -------------------- */
    async listResources(params) {
        const query = {};
        if (params?.limit !== undefined)
            query.limit = params.limit;
        if (params?.offset !== undefined)
            query.offset = params.offset;
        if (params?.entity_type)
            query.entity_type = params.entity_type;
        if (params?.agency)
            query.agency = params.agency;
        if (params?.jurisdiction)
            query.jurisdiction = params.jurisdiction;
        if (params?.name)
            query.name = params.name;
        const res = await this.request('GET', '/resources', { params: query });
        return res.result;
    }
    async getResource(id) {
        try {
            const res = await this.request('GET', `/resources/${encodeURIComponent(id)}`);
            return res.result;
        }
        catch (e) {
            if (e.message?.includes('404'))
                return null;
            throw e;
        }
    }
    async getResourcePageAsPng(id, pageNumber, dpi) {
        const path = `/resources/${encodeURIComponent(id)}/page/${pageNumber}`;
        const fullPath = dpi ? `${path}?dpi=${dpi}` : path;
        const token = this.signToken(fullPath);
        const res = await this.http.request({
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
    async downloadResourcePdf(id) {
        const path = `/resources/${encodeURIComponent(id)}/download`;
        const token = this.signToken(path);
        const res = await this.http.request({
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
    async getSignedForms(params) {
        const res = await this.request('GET', '/signed-forms', { params });
        return res.result;
    }
    /* -------------------- SIMPLE PRODUCTS -------------------- */
    async listSimpleProducts() {
        const res = await this.request('GET', '/simple-products', {
            params: {
                url: this.websiteUrl,
            },
        });
        return res.result;
    }
    /* -------------------- WEBSITES -------------------- */
    async getWebsite() {
        const res = await this.request('GET', '/websites', {
            params: {
                url: this.websiteUrl,
            },
        });
        return res.result;
    }
}
exports.CorporateToolsClient = CorporateToolsClient;
