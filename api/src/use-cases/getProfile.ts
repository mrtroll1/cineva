import { userRepository } from '../repositories/userRepository.js'
import { visitRepository } from '../repositories/visitRepository.js'

const PLACEHOLDER_CINEMA_GENRES = ['Arthouse', 'Drama', 'Sci-Fi', 'Documentary', 'Thriller']
const PLACEHOLDER_MUSEUM_CATEGORIES = ['Modern Art', 'Photography', 'Old Masters', 'Design', 'Contemporary']
const PLACEHOLDER_PERFORMING_ARTS_GENRES = ['Theater', 'Jazz', 'Contemporary Dance', 'Spoken Word', 'Indie']

export async function getProfile(userId: string) {
  const user = await userRepository.findById(userId)
  if (!user) return null

  let cinemaStats = null
  let museumStats = null
  let performingArtsStats = null

  // Always compute stats if visits exist — client controls visibility via localStorage
  const cStats = await visitRepository.getStatsByUserIdAndVenueType(userId, 'CINEMA')
  if (cStats.visitsCount > 0) {
    cinemaStats = {
      visitsCount: cStats.visitsCount,
      monthlyAverage: cStats.monthlyAverage,
      topVenues: cStats.topVenues,
      favoriteGenres: PLACEHOLDER_CINEMA_GENRES,
      mostWatchedDirector: 'Denis Villeneuve',
      recentFavorite: 'Past Lives',
    }
  }

  const mStats = await visitRepository.getStatsByUserIdAndVenueType(userId, 'MUSEUM')
  if (mStats.visitsCount > 0) {
    museumStats = {
      visitsCount: mStats.visitsCount,
      monthlyAverage: mStats.monthlyAverage,
      topVenues: mStats.topVenues,
      favoriteCategories: PLACEHOLDER_MUSEUM_CATEGORIES,
      favoriteArtist: 'Vermeer',
      recentFavorite: 'Dalí Surreal at Stedelijk',
    }
  }

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
    },
    cinemaStats,
    museumStats,
    performingArtsStats,
  }
}
