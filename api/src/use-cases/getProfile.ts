import { userRepository } from '../repositories/userRepository.js'
import { visitRepository } from '../repositories/visitRepository.js'

const PLACEHOLDER_GENRES = ['Arthouse', 'Drama', 'Sci-Fi', 'Documentary', 'Thriller']

export async function getProfile(userId: string) {
  const user = await userRepository.findById(userId)
  if (!user) return null

  const stats = await visitRepository.getStatsByUserId(userId)

  return {
    user: {
      id: user.id,
      name: `${user.name} ${user.lastName}`,
      photo: user.photoUrl,
      email: user.email,
      city: stats.topCinemas[0]?.name ? undefined : undefined, // city not in user table yet
      linkedProviders: user.linkedProviders,
    },
    stats: {
      filmsWatched: stats.filmsWatched,
      monthlyAverage: stats.monthlyAverage,
      topCinemas: stats.topCinemas,
      // Genres require film metadata — placeholder for now
      favoriteGenres: PLACEHOLDER_GENRES,
      mostWatchedDirector: 'Denis Villeneuve',
      recentFavorite: 'Past Lives',
    },
  }
}
