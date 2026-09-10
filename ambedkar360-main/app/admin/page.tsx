'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Upload, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'

export default function AdminPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadStatus('loading')
    setStatusMessage('Uploading to Vercel Blob Storage...')

    try {
      const file = files[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileName', `ambedkar-archive/${Date.now()}-${file.name}`)

      const response = await fetch('/api/blob', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setUploadStatus('success')
      setStatusMessage(`✅ File uploaded successfully! URL: ${data.url}`)
    } catch (error) {
      setUploadStatus('error')
      setStatusMessage(`❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F9F8F3] text-[#002147]">
      <header className="border-b border-[#002147]/15 px-5 py-5 lg:px-10">
        <Link
          href="/archive"
          className="inline-flex items-center gap-2 text-sm font-semibold hover:text-[#C56A35] transition-colors"
        >
          <ArrowLeft size={16} /> Back to archive
        </Link>
      </header>

      <section className="mx-auto max-w-[1440px] px-5 py-12 lg:px-10">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold tracking-[-0.045em]">Admin Panel</h1>
          <p className="mt-2 text-sm opacity-60">
            Manage manuscripts, upload audio, and handle OCR processing
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Upload Audio */}
          <div className="rounded-lg border border-[#002147]/15 bg-white p-8">
            <div className="flex size-12 items-center justify-center rounded-lg bg-[#C56A35]/20 mb-4">
              <Upload size={24} className="text-[#C56A35]" />
            </div>
            <h3 className="text-lg font-semibold">Upload Audio</h3>
            <p className="mt-2 text-sm opacity-75">
              Upload manuscript audio narrations to Vercel Blob Storage
            </p>
            <div className="mt-4">
              <label className="block">
                <span className="sr-only">Upload audio file</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="block w-full text-sm cursor-pointer rounded border border-[#002147]/20 px-3 py-2 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#C56A35] file:text-white hover:file:bg-[#A0501F]"
                />
              </label>
              {uploadStatus !== 'idle' && (
                <div className={`mt-3 flex items-start gap-2 text-sm ${
                  uploadStatus === 'success' ? 'text-green-600' : uploadStatus === 'error' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {uploadStatus === 'loading' && <Loader2 size={16} className="animate-spin shrink-0 mt-0.5" />}
                  {uploadStatus === 'success' && <CheckCircle size={16} className="shrink-0 mt-0.5" />}
                  {uploadStatus === 'error' && <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                  <span className="break-words">{statusMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Upload Manuscript Image */}
          <div className="rounded-lg border border-[#002147]/15 bg-white p-8">
            <div className="flex size-12 items-center justify-center rounded-lg bg-[#C56A35]/20 mb-4">
              <Upload size={24} className="text-[#C56A35]" />
            </div>
            <h3 className="text-lg font-semibold">Upload Manuscript Pages</h3>
            <p className="mt-2 text-sm opacity-75">
              Upload PDF pages or manuscript images for the digital reader
            </p>
            <div className="mt-4">
              <label className="block">
                <span className="sr-only">Upload manuscript file</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="block w-full text-sm cursor-pointer rounded border border-[#002147]/20 px-3 py-2 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#C56A35] file:text-white hover:file:bg-[#A0501F]"
                />
              </label>
            </div>
          </div>

          {/* OCR Processing */}
          <div className="rounded-lg border border-[#002147]/15 bg-white p-8">
            <div className="flex size-12 items-center justify-center rounded-lg bg-[#C56A35]/20 mb-4">
              <Upload size={24} className="text-[#C56A35]" />
            </div>
            <h3 className="text-lg font-semibold">Process OCR</h3>
            <p className="mt-2 text-sm opacity-75">
              Extract text from manuscript images using OCR
            </p>
            <button className="mt-4 w-full rounded bg-[#C56A35] px-4 py-2 text-xs font-bold text-[#F9F8F3] transition-all duration-200 hover:bg-[#A0501F] active:scale-95">
              Coming Soon
            </button>
          </div>
        </div>

        <div className="mt-16 rounded-lg border border-[#002147]/15 bg-white p-8">
          <h2 className="text-2xl font-semibold mb-6">Setup Instructions</h2>
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">1. Vercel Blob Storage Setup</h3>
              <ol className="list-decimal list-inside space-y-1 opacity-75">
                <li>Go to your Vercel project dashboard</li>
                <li>Navigate to Storage → Blob</li>
                <li>Click "Create" and give it a name (e.g., "ambedkar-storage")</li>
                <li>Environment variables will be automatically added</li>
                <li>Redeploy your application</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Firebase/MongoDB Setup (Optional)</h3>
              <ol className="list-decimal list-inside space-y-1 opacity-75">
                <li>Create a Firebase project at console.firebase.google.com</li>
                <li>Create Firestore database in test mode</li>
                <li>Add SDK configuration to your app</li>
                <li>Or use MongoDB Atlas at mongodb.com</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Environment Variables</h3>
              <code className="block bg-[#002147]/5 p-3 rounded font-mono text-xs whitespace-pre-wrap">
{`# .env.local
BLOB_READ_WRITE_TOKEN=<from-vercel-dashboard>
NEXT_PUBLIC_BLOB_URL=https://<your-blob-id>.blob.vercel-storage.com

# Firebase (if using)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...`}
              </code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. Upload Files</h3>
              <ol className="list-decimal list-inside space-y-1 opacity-75">
                <li>Use the upload panels above to add audio and manuscript files</li>
                <li>Files will be stored in Vercel Blob Storage</li>
                <li>Get the URL and update manuscript metadata</li>
                <li>Reference URLs in your manifest database</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <p className="text-sm text-blue-900">
            <strong>ℹ️ Note:</strong> To fully enable file uploads, you need to configure Vercel Blob Storage.
            Go to your Vercel dashboard, enable Blob Storage for this project, and redeploy.
          </p>
        </div>
      </section>
    </main>
  )
}
