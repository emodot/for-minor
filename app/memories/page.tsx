import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MemoriesContent from '@/components/MemoriesContent'

export default async function MemoriesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <MemoriesContent />
}
