const BASE = '/api'

export interface UserProfile {
  id: string
  name: string
  photo: string | null
  email: string
  linkedProviders: Record<string, string>
}

export interface CinemaStats {
  visitsCount: number
  monthlyAverage: number
  topVenues: Array<{ name: string; visits: number }>
  favoriteGenres: string[]
  mostWatchedDirector: string
  recentFavorite: string
}

export interface MuseumStats {
  visitsCount: number
  monthlyAverage: number
  topVenues: Array<{ name: string; visits: number }>
  favoriteCategories: string[]
  favoriteArtist: string
  recentFavorite: string
}

export interface PerformingArtsStats {
  visitsCount: number
  monthlyAverage: number
  topVenues: Array<{ name: string; visits: number }>
  favoriteGenres: string[]
  favoriteArtist: string
  recentFavorite: string
}

export interface ProfileResponse {
  user: UserProfile
  cinemaStats: CinemaStats | null
  museumStats: MuseumStats | null
  performingArtsStats: PerformingArtsStats | null
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
  museumsVisited: number
  topCinema: string
  topMuseum: string | null
  monthlyAverage: number
  topCinemas: Array<{ name: string; visits: number }>
  museumMonthlyAverage: number
  topMuseums: Array<{ name: string; visits: number }>
}

export interface Invite {
  id: string
  whenText: string
  whereText: string
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED'
  createdAt: string
  direction: 'sent' | 'received'
  otherUser: {
    id: string
    name: string
    photo: string | null
  }
}

const profileCache = new Map<string, Promise<ProfileResponse>>()

export function prefetchProfile(userId: string): void {
  if (!profileCache.has(userId)) {
    profileCache.set(userId, fetchProfileRaw(userId))
  }
}

async function fetchProfileRaw(userId: string): Promise<ProfileResponse> {
  const res = await fetch(`${BASE}/profile/${userId}`)
  if (!res.ok) throw new Error('Failed to fetch profile')
  return res.json()
}

export async function fetchProfile(userId: string): Promise<ProfileResponse> {
  const cached = profileCache.get(userId)
  if (cached) {
    profileCache.delete(userId)
    return cached
  }
  return fetchProfileRaw(userId)
}

export async function fetchMatches(userId: string, limit = 10): Promise<Match[]> {
  const res = await fetch(`${BASE}/matches?userId=${encodeURIComponent(userId)}&limit=${limit}`)
  if (!res.ok) throw new Error('Failed to fetch matches')
  return res.json()
}

export async function fetchInvites(userId: string): Promise<Invite[]> {
  const res = await fetch(`${BASE}/invites?userId=${encodeURIComponent(userId)}`)
  if (!res.ok) throw new Error('Failed to fetch invites')
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

export async function ingestMuseumkaart(userId: string, cardNumber: string) {
  const res = await fetch(`${BASE}/ingest/museumkaart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, cardNumber }),
  })
  if (!res.ok) throw new Error('Ingest failed')
  return res.json()
}

export async function ingestWeArePublic(userId: string, memberId: string) {
  const res = await fetch(`${BASE}/ingest/wearepublic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, memberId }),
  })
  if (!res.ok) throw new Error('Ingest failed')
  return res.json()
}
