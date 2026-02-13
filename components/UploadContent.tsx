'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Image, Mic, FileText, Upload, Check, AlertCircle } from 'lucide-react'
import heic2any from 'heic2any'
import imageCompression from 'browser-image-compression'

type UploadType = 'photo' | 'voice' | 'letter'

const IMAGE_COMPRESS_THRESHOLD_BYTES = 1024 * 1024 // 1 MB – only compress above this
const IMAGE_COMPRESS_MAX_SIZE_MB = 1
const IMAGE_COMPRESS_MAX_WIDTH_OR_HEIGHT = 1920

function isHeic(file: File): boolean {
  const name = file.name.toLowerCase()
  const type = file.type?.toLowerCase() ?? ''
  return name.endsWith('.heic') || name.endsWith('.heif') || type === 'image/heic' || type === 'image/heif'
}

function isImage(file: File): boolean {
  return file.type.startsWith('image/')
}

async function convertHeicToJpg(file: File): Promise<File> {
  const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 })
  const blob = Array.isArray(result) ? result[0] : result
  const newName = file.name.replace(/\.(heic|heif)$/i, '.jpg')
  return new File([blob as Blob], newName, { type: 'image/jpeg' })
}

async function compressImageIfNeeded(file: File): Promise<File> {
  if (!isImage(file) || file.size <= IMAGE_COMPRESS_THRESHOLD_BYTES) {
    return file
  }
  const name = file.name.replace(/\.[^.]+$/, '.jpg')
  const compressed = await imageCompression(file, {
    maxSizeMB: IMAGE_COMPRESS_MAX_SIZE_MB,
    maxWidthOrHeight: IMAGE_COMPRESS_MAX_WIDTH_OR_HEIGHT,
    useWebWorker: true,
    fileType: 'image/jpeg' as unknown as string,
  })
  return compressed instanceof File ? compressed : new File([compressed], name, { type: 'image/jpeg' })
}

export default function UploadContent() {
  const supabase = createClient()
  const photoInputRef = useRef<HTMLInputElement>(null)
  const voiceInputRef = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState<UploadType>('photo')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [voiceFiles, setVoiceFiles] = useState<File[]>([])
  const [photoTitle, setPhotoTitle] = useState('')
  const [photoCaption, setPhotoCaption] = useState('')
  const [voiceTitle, setVoiceTitle] = useState('')
  const [voiceCaption, setVoiceCaption] = useState('')
  const [letterTitle, setLetterTitle] = useState('')
  const [letterContent, setLetterContent] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const clearMessage = () => setMessage(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setPhotoFiles((prev) => [...prev, ...files])
    e.target.value = ''
  }
  const handleVoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setVoiceFiles((prev) => [...prev, ...files])
    e.target.value = ''
  }

  const removePhoto = (index: number) => setPhotoFiles((prev) => prev.filter((_, i) => i !== index))
  const removeVoice = (index: number) => setVoiceFiles((prev) => prev.filter((_, i) => i !== index))

  const uploadPhotos = async () => {
    if (photoFiles.length === 0) {
      setMessage({ type: 'error', text: 'Select at least one photo.' })
      return
    }
    setUploading(true)
    setMessage(null)
    try {
      const bucket = 'photos'
      let inserted = 0
      for (let i = 0; i < photoFiles.length; i++) {
        let file = photoFiles[i]
        if (isHeic(file)) {
          file = await convertHeicToJpg(file)
        }
        file = await compressImageIfNeeded(file)
        const ext = file.name.split('.').pop() || 'jpg'
        const path = `${Date.now()}-${i}.${ext}`
        const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
        const title = photoFiles.length === 1 && photoTitle ? photoTitle : photoTitle || file.name.replace(/\.[^.]+$/, '')
        const { error: insertError } = await supabase.from('memories').insert({
          type: 'photo',
          title: title || file.name,
          content: photoCaption || null,
          file_url: urlData.publicUrl,
        })
        if (insertError) throw insertError
        inserted++
      }
      setMessage({ type: 'success', text: `${inserted} photo(s) uploaded.` })
      setPhotoFiles([])
      setPhotoTitle('')
      setPhotoCaption('')
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Upload failed.' })
    } finally {
      setUploading(false)
    }
  }

  const uploadVoiceNotes = async () => {
    if (voiceFiles.length === 0) {
      setMessage({ type: 'error', text: 'Select at least one audio file.' })
      return
    }
    setUploading(true)
    setMessage(null)
    try {
      const bucket = 'voice-notes'
      let inserted = 0
      for (let i = 0; i < voiceFiles.length; i++) {
        const file = voiceFiles[i]
        const ext = file.name.split('.').pop() || 'mp3'
        const path = `${Date.now()}-${i}.${ext}`
        const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
        const title = voiceFiles.length === 1 && voiceTitle ? voiceTitle : voiceTitle || file.name.replace(/\.[^.]+$/, '')
        const { error: insertError } = await supabase.from('memories').insert({
          type: 'voice',
          title: title || file.name,
          content: voiceCaption || null,
          file_url: urlData.publicUrl,
        })
        if (insertError) throw insertError
        inserted++
      }
      setMessage({ type: 'success', text: `${inserted} voice note(s) uploaded.` })
      setVoiceFiles([])
      setVoiceTitle('')
      setVoiceCaption('')
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Upload failed.' })
    } finally {
      setUploading(false)
    }
  }

  const uploadLetter = async () => {
    if (!letterTitle.trim() || !letterContent.trim()) {
      setMessage({ type: 'error', text: 'Title and content are required.' })
      return
    }
    setUploading(true)
    setMessage(null)
    try {
      const { error } = await supabase.from('memories').insert({
        type: 'letter',
        title: letterTitle.trim(),
        content: letterContent.trim(),
        file_url: null,
      })
      if (error) throw error
      setMessage({ type: 'success', text: 'Letter saved.' })
      setLetterTitle('')
      setLetterContent('')
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save letter.' })
    } finally {
      setUploading(false)
    }
  }

  const tabs: { id: UploadType; label: string; icon: typeof Image }[] = [
    { id: 'photo', label: 'Photos', icon: Image },
    { id: 'voice', label: 'Voice notes', icon: Mic },
    { id: 'letter', label: 'Letter', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black sm:px-8">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-2xl font-light text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Upload memories
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Add photos, voice notes, or letters. Multiple files supported for photos and voice.
          </p>
        </motion.div>

        <div className="mb-6 flex gap-2 rounded-xl bg-white p-1 shadow-sm dark:bg-zinc-900">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveTab(tab.id); clearMessage(); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}
          >
            {message.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {message.text}
          </motion.div>
        )}

        {activeTab === 'photo' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900"
          >
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*,.heic,.heif"
              multiple
              className="hidden"
              onChange={handlePhotoChange}
            />
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Title (optional, for all)</label>
              <input
                type="text"
                value={photoTitle}
                onChange={(e) => setPhotoTitle(e.target.value)}
                placeholder="e.g. Beach day"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Caption (optional)</label>
              <input
                type="text"
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                placeholder="Short caption"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 py-6 text-zinc-600 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
            >
              <Upload className="h-5 w-5" />
              Choose photos (multiple)
            </button>
            {photoFiles.length > 0 && (
              <ul className="mb-4 space-y-2">
                {photoFiles.map((f, i) => (
                  <li key={`${f.name}-${i}`} className="flex items-center justify-between rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                    <span className="truncate text-sm text-zinc-700 dark:text-zinc-300">{f.name}</span>
                    <button type="button" onClick={() => removePhoto(i)} className="text-zinc-500 hover:text-red-600 dark:hover:text-red-400">Remove</button>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={uploadPhotos}
              disabled={uploading || photoFiles.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 py-3 font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {uploading ? 'Uploading…' : `Upload ${photoFiles.length} photo(s)`}
            </button>
          </motion.div>
        )}

        {activeTab === 'voice' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900"
          >
            <input
              ref={voiceInputRef}
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={handleVoiceChange}
            />
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Title (optional)</label>
              <input
                type="text"
                value={voiceTitle}
                onChange={(e) => setVoiceTitle(e.target.value)}
                placeholder="e.g. Message for you"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Note (optional)</label>
              <input
                type="text"
                value={voiceCaption}
                onChange={(e) => setVoiceCaption(e.target.value)}
                placeholder="Short note"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>
            <button
              type="button"
              onClick={() => voiceInputRef.current?.click()}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 py-6 text-zinc-600 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
            >
              <Upload className="h-5 w-5" />
              Choose audio files (multiple)
            </button>
            {voiceFiles.length > 0 && (
              <ul className="mb-4 space-y-2">
                {voiceFiles.map((f, i) => (
                  <li key={`${f.name}-${i}`} className="flex items-center justify-between rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                    <span className="truncate text-sm text-zinc-700 dark:text-zinc-300">{f.name}</span>
                    <button type="button" onClick={() => removeVoice(i)} className="text-zinc-500 hover:text-red-600 dark:hover:text-red-400">Remove</button>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={uploadVoiceNotes}
              disabled={uploading || voiceFiles.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 py-3 font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {uploading ? 'Uploading…' : `Upload ${voiceFiles.length} file(s)`}
            </button>
          </motion.div>
        )}

        {activeTab === 'letter' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900"
          >
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Title</label>
              <input
                type="text"
                value={letterTitle}
                onChange={(e) => setLetterTitle(e.target.value)}
                placeholder="e.g. Letter 1"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Content</label>
              <textarea
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
                placeholder="Write your letter…"
                rows={8}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>
            <button
              type="button"
              onClick={uploadLetter}
              disabled={uploading || !letterTitle.trim() || !letterContent.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 py-3 font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {uploading ? 'Saving…' : 'Save letter'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
