import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Image, Mic, FileText } from 'lucide-react'

export default async function MemoriesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const sections = [
    {
      title: 'Photos',
      description: 'Captured moments',
      href: '/memories/photos',
      icon: Image,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Voice Notes',
      description: 'Words from the heart',
      href: '/memories/voice-notes',
      icon: Mic,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Letters',
      description: 'Written thoughts',
      href: '/memories/letters',
      icon: FileText,
      color: 'from-amber-500 to-orange-500',
    },
  ]

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
            Memory Vault
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Choose a category to explore
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-3">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link href={section.href}>
                  <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-zinc-900">
                    <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 transition-opacity group-hover:opacity-5`} />
                    <div className="relative">
                      <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${section.color} p-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                        {section.title}
                      </h2>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {section.description}
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
