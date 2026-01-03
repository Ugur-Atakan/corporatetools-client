# Corporate Tools Client - NPM Paketi Kurulum Rehberi

## Paketi Yayınlama

### 1. Paket Klasörüne Git

```bash
cd packages/corporatetools-client
```

### 2. Bağımlılıkları Yükle

```bash
npm install
```

### 3. Build Et

```bash
npm run build
```

Bu komut `dist/` klasöründe derlenmiş JavaScript dosyalarını oluşturur.

### 4. Test Et (Yerel)

Yerel olarak test etmek için:

```bash
# Paket klasöründe
npm link

# Test projesinde
npm link @uguratakan/corporatetools-client
```

### 5. NPM'e Yayınla

```bash
# Önce npm'e login ol
npm login

# Yayınla
npm publish --access public
```

## Kullanım

### Yeni Projede Kullanım

```bash
npm install @registate/corporatetools-client
```

```typescript
import { CorporateToolsClient, CTJurisdiction } from '@registate/corporatetools-client';

const client = new CorporateToolsClient({
  apiUrl: process.env.CT_API_URL!,
  accessKey: process.env.CT_ACCESS_KEY!,
  secretKey: process.env.CT_SECRET_KEY!,
  websiteUrl: process.env.CT_WEBSITE_URL,
});

// Kullan
const companies = await client.listCompanies();
```

## Versiyon Güncelleme

Versiyon güncellemek için:

```bash
# Patch (1.0.0 -> 1.0.1)
npm version patch

# Minor (1.0.0 -> 1.1.0)
npm version minor

# Major (1.0.0 -> 2.0.0)
npm version major
```

Sonra tekrar publish et:
```bash
npm publish --access public
```

## Notlar

- `package.json`'daki `files` field'ı sadece `dist/`, `README.md` ve `LICENSE` dosyalarını yayınlar
- `.npmignore` ile gereksiz dosyalar hariç tutulur
- TypeScript declaration dosyaları (`*.d.ts`) otomatik oluşturulur

