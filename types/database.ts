export type MemoryType = 'photo' | 'voice' | 'letter'

export interface Profile {
  id: string
  full_name: string | null
  created_at: string
}

export interface Memory {
  id: string
  type: MemoryType
  title: string | null
  content: string | null
  file_url: string | null
  created_at: string
}

export interface OpenWhen {
  id: string
  title: string | null
  content: string | null
  unlock_date: string
  created_at: string
}
