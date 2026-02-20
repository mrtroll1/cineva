/**
 * Mock Cineville provider adapter.
 * Simulates what a real Cineville API would return — a JSON payload of a user's visit history.
 * In production, this would make HTTP calls to Cineville's OAuth-protected API.
 */

export interface CinevilleVisitRecord {
  externalUserId: string
  cinemaName: string
  date: string // ISO date
}

const CINEMA_NAMES = [
  'Eye Filmmuseum', 'Kriterion', 'De Uitkijk', 'LantarenVenster',
  'Filmhuis Den Haag', 'Forum Groningen', "'t Hoogt", 'Lab111',
  'FC Hyena', 'Kino Rotterdam',
]

function generateRandomVisits(passNumber: string, count = 50): CinevilleVisitRecord[] {
  const visits: CinevilleVisitRecord[] = []
  const startDate = new Date('2023-01-01')
  const range = Date.now() - startDate.getTime()

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate.getTime() + Math.random() * range)
    visits.push({
      externalUserId: passNumber,
      cinemaName: CINEMA_NAMES[Math.floor(Math.random() * CINEMA_NAMES.length)],
      date: date.toISOString().split('T')[0],
    })
  }

  return visits.sort((a, b) => a.date.localeCompare(b.date))
}

export async function fetchCinevilleHistory(passNumber: string): Promise<CinevilleVisitRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  return generateRandomVisits(passNumber)
}
