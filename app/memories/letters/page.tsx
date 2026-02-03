'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Memory } from '@/types/database'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function LettersPage() {
  const [letters, setLetters] = useState<Memory[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchLetters = async () => {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('type', 'letter')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching letters:', error)
      } else {
        setLetters(data || [])
      }
      setLoading(false)
    }

    fetchLetters()
  }, [supabase])

  const nextLetter = () => {
    setCurrentIndex((prev) => (prev + 1) % letters.length)
  }

  const prevLetter = () => {
    setCurrentIndex((prev) => (prev - 1 + letters.length) % letters.length)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    )
  }

  if (letters.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-zinc-600 dark:text-zinc-400">
          No letters yet
        </div>
      </div>
    )
  }

  const currentLetter = letters[currentIndex]

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black sm:px-8">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 text-3xl font-light text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Letters
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {currentIndex + 1} of {letters.length}
          </p>
        </motion.div>

        <div className="relative">
          {letters.length > 1 && (
            <>
              <button
                onClick={prevLetter}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full bg-white p-2 shadow-lg transition-transform hover:scale-110 dark:bg-zinc-900"
              >
                <ChevronLeft className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
              </button>
              <button
                onClick={nextLetter}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full bg-white p-2 shadow-lg transition-transform hover:scale-110 dark:bg-zinc-900"
              >
                <ChevronRight className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
              </button>
            </>
          )}

          <motion.div
            key={currentLetter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900 sm:p-12"
          >
            {currentLetter.title && (
              <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                {currentLetter.title}
              </h2>
            )}
            {currentLetter.content && (
              <div
                className="prose prose-zinc max-w-none dark:prose-invert prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentLetter.content.replace(/\n/g, '<br />') }}
              />
            )}
            <div className="mt-8 text-sm text-zinc-500 dark:text-zinc-500">
              {new Date(currentLetter.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
