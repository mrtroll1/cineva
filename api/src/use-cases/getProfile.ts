import { userRepository } from '../repositories/userRepository.js'
import { visitRepository } from '../repositories/visitRepository.js'

const PLACEHOLDER_CINEMA_GENRES = ['Arthouse', 'Drama', 'Sci-Fi', 'Documentary', 'Thriller']
const PLACEHOLDER_MUSEUM_CATEGORIES = ['Modern Art', 'Photography', 'Old Masters', 'Design', 'Contemporary']

export async function getProfile(userId: string) {
  const user = await userRepository.findById(userId)
  if (!user) return null

  const providers = (user.linkedProviders ?? {}) as Record<string, string>
  const hasCineville = 'cineville' in providers
  const hasMuseumkaart = 'museumkaart' in providers

  let cinemaStats = null
  let museumStats = null

  if (hasCineville) {
    const stats = await visitRepository.getStatsByUserIdAndVentureType(userId, 'CINEMA')
    cinemaStats = {
      visitsCount: stats.visitsCount,
      monthlyAverage: stats.monthlyAverage,
      topVenues: stats.topVenues,
      favoriteGenres: PLACEHOLDER_CINEMA_GENRES,
      mostWatchedDirector: 'Denis Villeneuve',
      recentFavorite: 'Past Lives',
    }
  }

  if (hasMuseumkaart) {
    const stats = await visitRepository.getStatsByUserIdAndVentureType(userId, 'MUSEUM')
    museumStats = {
      visitsCount: stats.visitsCount,
      monthlyAverage: stats.monthlyAverage,
      topVenues: stats.topVenues,
      favoriteCategories: PLACEHOLDER_MUSEUM_CATEGORIES,
      favoriteArtist: 'Vermeer',
      recentFavorite: 'Dalí Surreal at Stedelijk',
    }
  }

  return {
    user: {
      id: user.id,
      name: `${user.name} ${user.lastName}`,
      photo: user.photoUrl,
      email: user.email,
      linkedProviders: providers,
    },
    cinemaStats,
    museumStats,
  }
}
