'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function FinalPage() {
  const router = useRouter()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Slow cinematic fade-in
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const triggerConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff6b9d', '#ff8fab', '#ffa8c5', '#ffc4d6'],
    })
  }

  const handleYes = () => {
    triggerConfetti()
    setTimeout(() => {
      router.push('/home')
    }, 2000)
  }

  const handleYesLouder = () => {
    // Multiple confetti bursts
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 120,
          origin: { y: 0.6 },
          colors: ['#ff6b9d', '#ff8fab', '#ffa8c5', '#ffc4d6'],
        })
      }, i * 200)
    }
    setTimeout(() => {
      router.push('/home')
    }, 3000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 2 }}
        className="max-w-2xl text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="mb-8 text-2xl font-light text-white sm:text-3xl"
        >
          Loving you is my lifetime subscription.
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="mb-12 text-4xl font-light text-white sm:text-5xl"
        >
          Will you be my Valentine?
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ delay: 1.5, duration: 1.5 }}
          className="flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleYes}
            className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-4 text-lg font-medium text-white transition-all hover:shadow-lg hover:shadow-pink-500/50"
          >
            YES 💖
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleYesLouder}
            className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-8 py-4 text-lg font-medium text-white transition-all hover:shadow-lg hover:shadow-red-500/50"
          >
            YES BUT LOUDER 😭
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
