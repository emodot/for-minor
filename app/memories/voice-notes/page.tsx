'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Memory } from '@/types/database'
import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'

export default function VoiceNotesPage() {
  const [voiceNotes, setVoiceNotes] = useState<Memory[]>([])
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [durations, setDurations] = useState<Record<string, number>>({})
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({})
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchVoiceNotes = async () => {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('type', 'voice')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching voice notes:', error)
      } else {
        setVoiceNotes(data || [])
      }
      setLoading(false)
    }

    fetchVoiceNotes()
  }, [supabase])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = (note: Memory) => {
    const audio = audioRefs.current[note.id]
    if (!audio) return

    if (playingId === note.id) {
      audio.pause()
      setPlayingId(null)
    } else {
      // Pause all other audio
      Object.values(audioRefs.current).forEach((a) => a.pause())
      audio.play()
      setPlayingId(note.id)
    }
  }

  const handleLoadedMetadata = (noteId: string, audio: HTMLAudioElement) => {
    setDurations((prev) => ({
      ...prev,
      [noteId]: audio.duration,
    }))
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black sm:px-8">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 text-3xl font-light text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Voice Notes
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {voiceNotes.length} {voiceNotes.length === 1 ? 'voice note' : 'voice notes'}
          </p>
        </motion.div>

        {voiceNotes.length === 0 ? (
          <div className="text-center text-zinc-600 dark:text-zinc-400">
            No voice notes yet
          </div>
        ) : (
          <div className="space-y-4">
            {voiceNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handlePlayPause(note)}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white transition-transform hover:scale-105"
                  >
                    {playingId === note.id ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1">
                    {note.title && (
                      <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {note.title}
                      </h3>
                    )}
                    {note.content && (
                      <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {note.content}
                      </p>
                    )}
                    {durations[note.id] && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        {formatDuration(durations[note.id])}
                      </p>
                    )}
                  </div>
                </div>
                {note.file_url && (
                  <audio
                    ref={(el) => {
                      if (el) {
                        audioRefs.current[note.id] = el
                        el.addEventListener('loadedmetadata', () =>
                          handleLoadedMetadata(note.id, el)
                        )
                        el.addEventListener('ended', () => setPlayingId(null))
                      }
                    }}
                    src={note.file_url}
                    preload="metadata"
                    className="hidden"
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
