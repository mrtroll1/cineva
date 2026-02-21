import { userRepository } from '../repositories/userRepository.js'
import { visitRepository } from '../repositories/visitRepository.js'

const GENRE_LIST = ['Arthouse', 'Drama', 'Sci-Fi', 'Documentary', 'Thriller', 'Comedy', 'Horror', 'Romance']

const BIOS = [
  'Film programmer by day, cinephile always. Looking for someone to debate Tarkovsky over Indonesian food.',
  'Architecture student who cries at every A24 film. Seeking a fellow tissue-bringer.',
  'Sound designer. I judge people by their Letterboxd ratings. Fair warning.',
  'Museum curator & film lover. The kind of person who stays for the credits.',
  'Philosophy grad. Moved to NL for Cineville, stayed for the rain. Slow cinema enthusiast.',
  'Journalist. I have opinions about aspect ratios. Last film that changed me: Close.',
]

const FAVORITE_FILMS = [
  'Eternal Sunshine of the Spotless Mind', 'Aftersun', 'Blade Runner 2049',
  'Portrait of a Lady on Fire', 'Stalker', 'Parasite',
]

function pickRandom<T>(arr: T[], min: number, max: number): T[] {
  const count = min + Math.floor(Math.random() * (max - min + 1))
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export async function getMatches(userId: string, limit = 10) {
  const users = await userRepository.findRandomExcluding(userId, limit)

  const results = await Promise.all(
    users.map(async (u, i) => {
      const providers = (u.linkedProviders ?? {}) as Record<string, string>
      const hasMuseumkaart = 'museumkaart' in providers

      const cinemaStats = await visitRepository.getStatsByUserIdAndVenueType(u.id, 'CINEMA')

      let museumsVisited = 0
      let topMuseum: string | null = null
      let museumMonthlyAverage = 0
      let topMuseums: Array<{ name: string; visits: number }> = []

      if (hasMuseumkaart) {
        const museumStats = await visitRepository.getStatsByUserIdAndVenueType(u.id, 'MUSEUM')
        museumsVisited = museumStats.visitsCount
        topMuseum = museumStats.topVenues[0]?.name ?? null
        museumMonthlyAverage = museumStats.monthlyAverage
        topMuseums = museumStats.topVenues
      }

      return {
        id: u.id,
        name: `${u.name} ${u.lastName}`,
        photo: u.photoUrl,
        city: 'Amsterdam',
        compatibility: Math.floor(Math.random() * 25) + 75,
        sharedGenres: pickRandom(GENRE_LIST, 2, 4),
        favoriteFilm: FAVORITE_FILMS[i % FAVORITE_FILMS.length],
        bio: BIOS[i % BIOS.length],
        filmsWatched: cinemaStats.visitsCount || Math.floor(Math.random() * 300) + 100,
        museumsVisited,
        topCinema: cinemaStats.topVenues[0]?.name ?? 'Eye Filmmuseum',
        topMuseum,
        monthlyAverage: cinemaStats.monthlyAverage,
        topCinemas: cinemaStats.topVenues,
        museumMonthlyAverage,
        topMuseums,
      }
    })
  )

  return results
}
