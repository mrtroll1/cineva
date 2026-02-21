import { fetchCinevilleHistory } from '../providers/cineville.js'
import { fetchMuseumkaartHistory } from '../providers/museumkaart.js'
import { ventureRepository } from '../repositories/ventureRepository.js'
import { visitRepository } from '../repositories/visitRepository.js'
import { userRepository } from '../repositories/userRepository.js'

export async function ingestCinevilleVisits(userId: string, passNumber: string) {
  const user = await userRepository.findById(userId)
  if (!user) throw new Error('User not found')

  const history = await fetchCinevilleHistory(passNumber)

  // Resolve cinema names to venture IDs
  const allVentures = await ventureRepository.findAll()
  const ventureMap = new Map(allVentures.map((v) => [v.name, v.id]))

  const visits = history
    .map((record) => {
      const ventureId = ventureMap.get(record.cinemaName)
      if (!ventureId) return null
      return {
        userId,
        ventureId,
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

  const allVentures = await ventureRepository.findAll()
  const ventureMap = new Map(allVentures.map((v) => [v.name, v.id]))

  const visits = history
    .map((record) => {
      const ventureId = ventureMap.get(record.museumName)
      if (!ventureId) return null
      return {
        userId,
        ventureId,
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
