'use client'

import { songSections } from '@/data/songs'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Image from 'next/image'

export default function MusicPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black sm:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-2 text-3xl font-light text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Our Soundtrack
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Songs that tell our story
          </p>
        </motion.div>

        {songSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.2 }}
            className="mb-16"
          >
            <h2 className="mb-8 text-2xl font-light text-zinc-900 dark:text-zinc-50">
              {section.title}
            </h2>
            {section.songs.length === 0 ? (
              <div className="text-center text-zinc-500 dark:text-zinc-500">
                No songs added yet
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {section.songs.map((song, songIndex) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.2 + songIndex * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md dark:bg-zinc-900"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      {song.albumArt ? (
                        <Image
                          src={song.albumArt}
                          alt={`${song.title} by ${song.artist}`}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-pink-500 to-rose-500">
                          <Heart className="h-12 w-12 text-white/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          background: [
                            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)',
                            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 70%)',
                            'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.1) 0%, transparent 70%)',
                            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)',
                          ],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {song.title}
                      </h3>
                      <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {song.artist}
                      </p>
                      {song.note && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-500">
                          {song.note}
                        </p>
                      )}
                    </div>
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
