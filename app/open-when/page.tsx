'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { OpenWhen } from '@/types/database'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Unlock } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function OpenWhenPage() {
  const [messages, setMessages] = useState<OpenWhen[]>([])
  const [openedMessages, setOpenedMessages] = useState<Set<string>>(new Set())
  const [selectedMessage, setSelectedMessage] = useState<OpenWhen | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('open_when')
        .select('*')
        .order('unlock_date', { ascending: true })

      if (error) {
        console.error('Error fetching messages:', error)
      } else {
        setMessages(data || [])
      }
      setLoading(false)
    }

    // Load opened messages from localStorage
    const stored = localStorage.getItem('openedMessages')
    if (stored) {
      setOpenedMessages(new Set(JSON.parse(stored)))
    }

    fetchMessages()
  }, [supabase])

  const isUnlocked = (message: OpenWhen) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const unlockDate = new Date(message.unlock_date)
    unlockDate.setHours(0, 0, 0, 0)
    return unlockDate <= today
  }

  const handleOpen = (message: OpenWhen) => {
    if (!isUnlocked(message)) return

    const isFirstOpen = !openedMessages.has(message.id)
    setOpenedMessages((prev) => {
      const newSet = new Set(prev)
      newSet.add(message.id)
      localStorage.setItem('openedMessages', JSON.stringify(Array.from(newSet)))
      return newSet
    })

    setSelectedMessage(message)

    if (isFirstOpen) {
      // Confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
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
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-2 text-3xl font-light text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Open When
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Messages for special moments
          </p>
        </motion.div>

        {messages.length === 0 ? (
          <div className="text-center text-zinc-600 dark:text-zinc-400">
            No messages yet
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {messages.map((message, index) => {
              const unlocked = isUnlocked(message)
              const opened = openedMessages.has(message.id)

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleOpen(message)}
                    disabled={!unlocked}
                    className={`group relative w-full overflow-hidden rounded-2xl bg-white p-6 text-left shadow-sm transition-all dark:bg-zinc-900 ${
                      unlocked
                        ? 'cursor-pointer hover:shadow-md'
                        : 'cursor-not-allowed opacity-60'
                    }`}
                  >
                    {!unlocked && (
                      <div className="absolute inset-0 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-zinc-900/40" />
                      </div>
                    )}
                    <div className="relative">
                      <div className="mb-4 flex items-center justify-between">
                        <div
                          className={`rounded-lg p-2 ${
                            unlocked
                              ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                              : 'bg-zinc-300 dark:bg-zinc-700'
                          }`}
                        >
                          {unlocked ? (
                            <Unlock className="h-5 w-5 text-white" />
                          ) : (
                            <Lock className="h-5 w-5 text-white" />
                          )}
                        </div>
                        {opened && (
                          <span className="text-xs text-zinc-500 dark:text-zinc-500">
                            Opened
                          </span>
                        )}
                      </div>
                      <h3
                        className={`mb-2 text-lg font-semibold ${
                          unlocked
                            ? 'text-zinc-900 dark:text-zinc-50'
                            : 'text-zinc-500 dark:text-zinc-400'
                        }`}
                      >
                        {message.title || 'Untitled'}
                      </h3>
                      {message.unlock_date && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-500">
                          {unlocked
                            ? 'Ready to open'
                            : `Unlocks ${new Date(message.unlock_date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                              })}`}
                        </p>
                      )}
                    </div>
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 dark:bg-zinc-900 sm:p-12"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMessage(null)}
                className="absolute right-4 top-4 rounded-full bg-zinc-100 p-2 text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              >
                <Unlock className="h-5 w-5" />
              </button>
              {selectedMessage.title && (
                <h2 className="mb-6 pr-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                  {selectedMessage.title}
                </h2>
              )}
              {selectedMessage.content && (
                <div
                  className="prose prose-zinc max-w-none dark:prose-invert prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: selectedMessage.content.replace(/\n/g, '<br />'),
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
