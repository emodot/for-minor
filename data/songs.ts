export interface Song {
  id: string
  title: string
  artist: string
  albumArt: string // URL or path to image
  note: string // Emotional note about the song
}

export interface SongSection {
  title: string
  songs: Song[]
}

export const songSections: SongSection[] = [
  {
    title: 'Songs That Feel Like You',
    songs: [
      // Add your songs here
      // Example:
      // {
      //   id: '1',
      //   title: 'Song Title',
      //   artist: 'Artist Name',
      //   albumArt: '/path/to/album-art.jpg',
      //   note: 'Why this song reminds me of you...'
      // }
    ],
  },
  {
    title: 'Songs That Feel Like Us',
    songs: [
      // Add your songs here
    ],
  },
  {
    title: 'Songs For Our Future',
    songs: [
      // Add your songs here
    ],
  },
]
