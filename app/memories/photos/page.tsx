'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Memory } from '@/types/database'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Image from 'next/image'

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Memory[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Memory | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('type', 'photo')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching photos:', error)
      } else {
        setPhotos(data || [])
      }
      setLoading(false)
    }

    fetchPhotos()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black sm:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 text-3xl font-light text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Photos
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </p>
        </motion.div>

        {photos.length === 0 ? (
          <div className="text-center text-zinc-600 dark:text-zinc-400">
            No photos yet
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800"
              >
                {photo.file_url && (
                  <Image
                    src={photo.file_url}
                    alt={photo.title || 'Photo'}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </button>
              {selectedPhoto.file_url && (
                <Image
                  src={selectedPhoto.file_url}
                  alt={selectedPhoto.title || 'Photo'}
                  width={1200}
                  height={1200}
                  className="max-h-[90vh] w-auto rounded-lg object-contain"
                />
              )}
              {selectedPhoto.title && (
                <div className="mt-4 text-center text-white">
                  <h2 className="text-xl font-semibold">{selectedPhoto.title}</h2>
                  {selectedPhoto.content && (
                    <p className="mt-2 text-zinc-300">{selectedPhoto.content}</p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
