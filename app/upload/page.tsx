import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UploadContent from '@/components/UploadContent'

export default async function UploadPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <UploadContent />
}
