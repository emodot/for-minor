'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Lock, Music } from 'lucide-react'

const iconMap = {
  heart: Heart,
  lock: Lock,
  music: Music,
} as const

export type NavCardIcon = keyof typeof iconMap

export interface NavCard {
  title: string
  description: string
  href: string
  color: string
  icon: NavCardIcon
}

const navCards: NavCard[] = [
  {
    title: 'Memory Vault',
    description: 'Photos, voice notes, and letters',
    href: '/memories',
    icon: 'heart',
    color: 'from-pink-500 to-rose-500',
  },
  {
    title: 'Open When',
    description: 'Messages for special moments',
    href: '/open-when',
    icon: 'lock',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Music',
    description: 'Songs that tell our story',
    href: '/music',
    icon: 'music',
    color: 'from-blue-500 to-purple-500',
  },
  {
    title: 'Final',
    description: 'Something special',
    href: '/final',
    icon: 'heart',
    color: 'from-red-500 to-pink-500',
  },
]

export default function HomeContent() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black sm:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-2 text-3xl font-light text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Welcome back
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Choose where you'd like to go
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {navCards.map((card, index) => {
            const Icon = iconMap[card.icon]
            return (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link href={card.href}>
                  <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-zinc-900">
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 transition-opacity group-hover:opacity-5`} />
                    <div className="relative">
                      <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${card.color} p-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                        {card.title}
                      </h2>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
