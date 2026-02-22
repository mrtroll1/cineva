export interface WeArePublicVisitRecord {
  externalUserId: string
  venueName: string
  date: string
}

/**
 * Curated (fixed) visit history for demo purposes.
 * Returns the same visits every time so stats are consistent.
 */
const CURATED_VISITS: Array<{ venueName: string; date: string }> = [
  { venueName: 'Paradiso', date: '2023-02-11' },
  { venueName: 'Melkweg', date: '2023-03-04' },
  { venueName: 'Concertgebouw', date: '2023-04-18' },
  { venueName: 'Paradiso', date: '2023-05-27' },
  { venueName: 'Stadsschouwburg', date: '2023-06-09' },
  { venueName: 'TivoliVredenburg', date: '2023-07-15' },
  { venueName: 'Carré', date: '2023-08-22' },
  { venueName: 'Paradiso', date: '2023-09-30' },
  { venueName: 'Melkweg', date: '2023-10-14' },
  { venueName: 'Concertgebouw', date: '2023-11-05' },
  { venueName: 'De Oosterpoort', date: '2023-12-01' },
  { venueName: 'Paradiso', date: '2024-01-20' },
  { venueName: 'Melkweg', date: '2024-02-14' },
  { venueName: 'Stadsschouwburg', date: '2024-03-08' },
  { venueName: 'Carré', date: '2024-03-29' },
  { venueName: 'TivoliVredenburg', date: '2024-04-12' },
  { venueName: 'Paradiso', date: '2024-05-03' },
  { venueName: 'Concertgebouw', date: '2024-06-21' },
  { venueName: 'Melkweg', date: '2024-07-07' },
  { venueName: 'Paradiso', date: '2024-08-16' },
  { venueName: 'Mezz', date: '2024-09-01' },
  { venueName: 'Carré', date: '2024-09-28' },
  { venueName: 'Paradiso', date: '2024-10-19' },
  { venueName: 'Melkweg', date: '2024-11-02' },
  { venueName: 'Concertgebouw', date: '2024-11-30' },
  { venueName: 'TivoliVredenburg', date: '2024-12-14' },
  { venueName: 'Paradiso', date: '2025-01-11' },
  { venueName: 'Stadsschouwburg', date: '2025-02-08' },
  { venueName: 'Melkweg', date: '2025-03-15' },
  { venueName: 'Carré', date: '2025-04-05' },
  { venueName: 'Paradiso', date: '2025-05-24' },
  { venueName: 'Concertgebouw', date: '2025-06-07' },
  { venueName: 'De Oosterpoort', date: '2025-07-19' },
  { venueName: 'Melkweg', date: '2025-08-30' },
  { venueName: 'Paradiso', date: '2025-10-11' },
]

export async function fetchWeArePublicHistory(memberId: string): Promise<WeArePublicVisitRecord[]> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 200))

  return CURATED_VISITS.map((v) => ({
    externalUserId: memberId,
    ...v,
  }))
}
