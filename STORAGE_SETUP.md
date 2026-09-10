# Setup Guide for Ambedkar360

## Architecture Overview

```
ambedkar360/
├── app/
│   ├── api/
│   │   ├── blob/           # Vercel Blob Storage API
│   │   ├── manuscripts/    # Manuscript CRUD operations
│   │   ├── ocr/           # OCR text storage
│   │   └── ocr/process/   # OCR processing
│   ├── manuscript/        # Reader pages
│   ├── archive/          # Listing page
│   └── admin/            # Admin panel
├── lib/
│   └── manuscripts.ts    # Manuscript database
└── public/
    ├── audio/           # Audio files (optional local storage)
    └── manuscripts/     # Manuscript images (optional local storage)
```

## Storage Solutions

### 1. **Vercel Blob Storage** ✅ (Recommended)
Best for: Audio files, manuscript images, PDFs

**Setup:**
```bash
# 1. In Vercel Dashboard:
# Project → Storage → Create Blob

# 2. Environment variables auto-added:
# BLOB_READ_WRITE_TOKEN
# NEXT_PUBLIC_BLOB_URL

# 3. Deploy
vercel env pull
vercel deploy --prod
```

**Upload via API:**
```typescript
const formData = new FormData()
formData.append('file', audioFile)
formData.append('fileName', `audio/speech-${Date.now()}.mp3`)

const response = await fetch('/api/blob', {
  method: 'POST',
  body: formData,
})
const { url } = await response.json()
// Use url in manuscript record
```

### 2. **Firebase/Firestore** 📊
Best for: OCR text, metadata, user data

**Setup:**
```bash
npm install firebase

# 1. Create project at console.firebase.google.com
# 2. Enable Firestore Database
# 3. Get config from Project Settings
# 4. Add to .env.local
```

**Config:**
```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
}

export const app = initializeApp(config)
export const db = getFirestore(app)
```

**Store OCR Text:**
```typescript
import { collection, addDoc } from 'firebase/firestore'

const ocrRef = collection(db, 'ocrPages')
await addDoc(ocrRef, {
  manuscriptId: 'annihilation-of-caste',
  pageNumber: 1,
  text: 'Extracted text...',
  confidence: 96.5,
  timestamp: new Date(),
})
```

### 3. **MongoDB Atlas** 📚
Best for: Scalable database, complex queries

**Setup:**
```bash
npm install mongoose

# 1. Create cluster at mongodb.com
# 2. Create database user
# 3. Get connection string
# 4. Add MONGODB_URI to .env.local
```

**Models:**
```typescript
// lib/models.ts
import mongoose from 'mongoose'

const ocrSchema = new mongoose.Schema({
  manuscriptId: String,
  pageNumber: Number,
  text: String,
  confidence: Number,
  createdAt: { type: Date, default: Date.now },
})

export const OCRPage = mongoose.model('OCRPage', ocrSchema)
```

## Implementation Steps

### Step 1: Enable Vercel Blob
```bash
# In Vercel Dashboard:
1. Go to Project Settings
2. Storage tab
3. Create new Blob database
4. Name: "ambedkar-archive"
```

### Step 2: Update Environment Variables
```bash
# .env.local
BLOB_READ_WRITE_TOKEN=<token-from-vercel>
NEXT_PUBLIC_BLOB_URL=https://<id>.blob.vercel-storage.com

# Firebase (optional)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
```

### Step 3: Deploy
```bash
vercel env pull
git add .env.local
git commit -m "Add environment variables"
git push
vercel deploy --prod
```

### Step 4: Upload Files
```bash
# Visit: https://your-domain.vercel.app/admin
# Use upload forms to add:
# - Audio files (MP3s)
# - Manuscript pages (PNG/PDF)
# - Get URLs and update manuscripts
```

### Step 5: Connect Database (Optional)
For production OCR text storage:
- Use Firebase Firestore or MongoDB
- Store extracted text by page
- Query efficiently during reading

## API Endpoints

### Upload File
```bash
POST /api/blob
Content-Type: multipart/form-data

file: <binary>
fileName: audio/annihilation-of-caste.mp3
```

### List Manuscripts
```bash
GET /api/manuscripts
```

### Get Single Manuscript
```bash
GET /api/manuscripts/[id]
```

### Create Manuscript
```bash
POST /api/manuscripts
Content-Type: application/json

{
  "id": "new-manuscript",
  "title": "New Title",
  "author": "B. R. Ambedkar",
  "year": 1956,
  "audioUrl": "https://blob.vercel-storage.com/audio.mp3",
  "image": "https://blob.vercel-storage.com/image.png"
}
```

### Store OCR Text
```bash
POST /api/ocr
Content-Type: application/json

{
  "manuscriptId": "annihilation-of-caste",
  "pageNumber": 1,
  "text": "Extracted text..."
}
```

## File Organization in Blob Storage

```
ambedkar-archive/
├── audio/
│   ├── 1694340000-annihilation-of-caste.mp3
│   ├── 1694340100-constitution.mp3
│   └── ... (other audio files)
├── manuscripts/
│   ├── 1694340200-annihilation-page-01.png
│   ├── 1694340300-annihilation-page-02.png
│   └── ... (other pages)
└── metadata/
    └── manuscripts.json
```

## Cost Estimation

| Service | Cost | Use Case |
|---------|------|----------|
| Vercel Blob | $1/100GB read, $0.5/GB written | Audio & images |
| Firebase | Free tier (~1GB storage) | OCR text, metadata |
| MongoDB | Free tier (512MB) | Complex queries |
| Vercel Deployment | Free with Next.js | Hosting |

## Troubleshooting

**Issue: Upload returns 401**
- Check BLOB_READ_WRITE_TOKEN is set
- Verify token hasn't expired
- Redeploy after adding token

**Issue: Files not accessible**
- Verify NEXT_PUBLIC_BLOB_URL is correct
- Check file permissions in Vercel dashboard
- Ensure blob access is set to "public"

**Issue: Database connection fails**
- Check MongoDB connection string
- Verify IP whitelist in MongoDB Atlas
- Check environment variables loaded

## Next Steps

1. ✅ Set up Vercel Blob Storage
2. ✅ Create Firebase/MongoDB account
3. ✅ Upload sample audio files via admin panel
4. ✅ Upload manuscript pages
5. ✅ Test OCR text extraction
6. ✅ Integrate search functionality
7. ✅ Add user comments/annotations

## Support Resources

- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Firebase Setup](https://firebase.google.com/docs/setup)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
