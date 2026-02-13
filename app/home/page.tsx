import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import HomeContent from '@/components/HomeContent'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <HomeContent />
}
