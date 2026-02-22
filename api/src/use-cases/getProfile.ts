import { userRepository } from '../repositories/userRepository.js'
import { visitRepository } from '../repositories/visitRepository.js'

const PLACEHOLDER_CINEMA_GENRES = ['Arthouse', 'Drama', 'Sci-Fi', 'Documentary', 'Thriller']
const PLACEHOLDER_MUSEUM_CATEGORIES = ['Modern Art', 'Photography', 'Old Masters', 'Design', 'Contemporary']
const PLACEHOLDER_PERFORMING_ARTS_GENRES = ['Theater', 'Jazz', 'Contemporary Dance', 'Spoken Word', 'Indie']

export async function getProfile(userId: string) {
  const user = await userRepository.findById(userId)
  if (!user) return null

  const providers = (user.linkedProviders ?? {}) as Record<string, string>
  const hasCineville = 'cineville' in providers
  const hasMuseumkaart = 'museumkaart' in providers
  let cinemaStats = null
  let museumStats = null
  let performingArtsStats = null

  if (hasCineville) {
    const stats = await visitRepository.getStatsByUserIdAndVenueType(userId, 'CINEMA')
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
    const stats = await visitRepository.getStatsByUserIdAndVenueType(userId, 'MUSEUM')
    museumStats = {
      visitsCount: stats.visitsCount,
      monthlyAverage: stats.monthlyAverage,
      topVenues: stats.topVenues,
      favoriteCategories: PLACEHOLDER_MUSEUM_CATEGORIES,
      favoriteArtist: 'Vermeer',
      recentFavorite: 'Dalí Surreal at Stedelijk',
    }
  }

  // Always compute — client controls visibility via localStorage (demo-friendly)
  const paStats = await visitRepository.getStatsByUserIdAndVenueType(userId, 'PERFORMING_ARTS')
  if (paStats.visitsCount > 0) {
    performingArtsStats = {
      visitsCount: paStats.visitsCount,
      monthlyAverage: paStats.monthlyAverage,
      topVenues: paStats.topVenues,
      favoriteGenres: PLACEHOLDER_PERFORMING_ARTS_GENRES,
      favoriteArtist: 'Internationaal Theater Amsterdam',
      recentFavorite: 'Cate Le Bon at Paradiso',
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
    performingArtsStats,
  }
}
