const BASE = '/api'

export interface UserProfile {
  id: string
  name: string
  photo: string | null
  email: string
  linkedProviders: Record<string, string>
}

export interface UserStats {
  filmsWatched: number
  monthlyAverage: number
  topCinemas: Array<{ name: string; visits: number }>
  favoriteGenres: string[]
  mostWatchedDirector: string
  recentFavorite: string
}

export interface ProfileResponse {
  user: UserProfile
  stats: UserStats
}

export interface Match {
  id: string
  name: string
  photo: string | null
  city: string
  compatibility: number
  sharedGenres: string[]
  favoriteFilm: string
  bio: string
  filmsWatched: number
  topCinema: string
}

export async function fetchProfile(userId: string): Promise<ProfileResponse> {
  const res = await fetch(`${BASE}/profile/${userId}`)
  if (!res.ok) throw new Error('Failed to fetch profile')
  return res.json()
}

export async function fetchMatches(userId: string, limit = 10): Promise<Match[]> {
  const res = await fetch(`${BASE}/matches?userId=${encodeURIComponent(userId)}&limit=${limit}`)
  if (!res.ok) throw new Error('Failed to fetch matches')
  return res.json()
}

export async function ingestCineville(userId: string, passNumber: string) {
  const res = await fetch(`${BASE}/ingest/cineville`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, passNumber }),
  })
  if (!res.ok) throw new Error('Ingest failed')
  return res.json()
}
