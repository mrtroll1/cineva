/**
 * Mock Museumkaart provider adapter.
 * Simulates what a real Museumkaart API would return — a JSON payload of a user's visit history.
 * In production, this would make HTTP calls to Museumkaart's API.
 */

export interface MuseumkaartVisitRecord {
  externalUserId: string
  museumName: string
  date: string // ISO date
}

const MUSEUM_NAMES = [
  'Rijksmuseum', 'Van Gogh Museum', 'Stedelijk Museum', 'FOAM',
  'Mauritshuis', 'Bonnefanten', 'Groninger Museum', 'Centraal Museum',
]

function generateRandomVisits(cardNumber: string, count = 30): MuseumkaartVisitRecord[] {
  const visits: MuseumkaartVisitRecord[] = []
  const startDate = new Date('2023-01-01')
  const range = Date.now() - startDate.getTime()

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate.getTime() + Math.random() * range)
    visits.push({
      externalUserId: cardNumber,
      museumName: MUSEUM_NAMES[Math.floor(Math.random() * MUSEUM_NAMES.length)],
      date: date.toISOString().split('T')[0],
    })
  }

  return visits.sort((a, b) => a.date.localeCompare(b.date))
}

export async function fetchMuseumkaartHistory(cardNumber: string): Promise<MuseumkaartVisitRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  return generateRandomVisits(cardNumber)
}
