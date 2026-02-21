import { fetchCinevilleHistory } from '../providers/cineville.js'
import { fetchMuseumkaartHistory } from '../providers/museumkaart.js'
import { venueRepository } from '../repositories/venueRepository.js'
import { visitRepository } from '../repositories/visitRepository.js'
import { userRepository } from '../repositories/userRepository.js'

export async function ingestCinevilleVisits(userId: string, passNumber: string) {
  const user = await userRepository.findById(userId)
  if (!user) throw new Error('User not found')

  const history = await fetchCinevilleHistory(passNumber)

  // Resolve cinema names to venue IDs
  const allVenues = await venueRepository.findAll()
  const venueMap = new Map(allVenues.map((v) => [v.name, v.id]))

  const visits = history
    .map((record) => {
      const venueId = venueMap.get(record.cinemaName)
      if (!venueId) return null
      return {
        userId,
        venueId,
        date: record.date,
        providerName: 'cineville',
      }
    })
    .filter((v): v is NonNullable<typeof v> => v !== null)

  const inserted = await visitRepository.createMany(visits)

  return {
    totalRecords: history.length,
    inserted: inserted.length,
    skipped: history.length - visits.length,
  }
}

export async function ingestMuseumkaartVisits(userId: string, cardNumber: string) {
  const user = await userRepository.findById(userId)
  if (!user) throw new Error('User not found')

  const history = await fetchMuseumkaartHistory(cardNumber)

  const allVenues = await venueRepository.findAll()
  const venueMap = new Map(allVenues.map((v) => [v.name, v.id]))

  const visits = history
    .map((record) => {
      const venueId = venueMap.get(record.museumName)
      if (!venueId) return null
      return {
        userId,
        venueId,
        date: record.date,
        providerName: 'museumkaart',
      }
    })
    .filter((v): v is NonNullable<typeof v> => v !== null)

  const inserted = await visitRepository.createMany(visits)

  return {
    totalRecords: history.length,
    inserted: inserted.length,
    skipped: history.length - visits.length,
  }
}
