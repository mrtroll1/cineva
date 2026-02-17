import { motion } from "framer-motion"
import {
  Film,
  Calendar,
  MapPin,
  Trophy,
  Clapperboard,
  TrendingUp,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatBadge } from "@/components/StatBadge"
import mockData from "@/data/mockData.json"

interface ProfileProps {
  onFindMatches: () => void
}

export function Profile({ onFindMatches }: ProfileProps) {
  const { user, userStats } = mockData

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
      className="flex w-full flex-col items-center pb-12 pt-10"
    >
      {/* Header */}
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-sm font-medium text-cineva-600"
        >
          Your Cinevá Profile
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <img
            src={user.photo}
            alt={user.name}
            className="h-28 w-28 rounded-full border-4 border-amber-100 object-cover shadow-lg shadow-stone-200"
            style={{ filter: 'saturate(0.92) sepia(0.06) brightness(1.02)' }}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 font-serif text-3xl text-stone-800"
        >
          {user.name}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-2 flex items-center gap-4 text-sm text-stone-500"
        >
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {user.city}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Since {user.memberSince}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3"
        >
          <Badge variant="secondary">
            Pass: {user.passNumber}
          </Badge>
        </motion.div>
      </div>

      {/* Content */}
      <div className="mx-auto mt-8 w-full max-w-md px-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatBadge icon={Film} label="Films Watched" value={userStats.filmsWatched} delay={0.3} />
          <StatBadge icon={TrendingUp} label="Monthly Avg" value={userStats.monthlyAverage} delay={0.4} />
          <StatBadge icon={Trophy} label="Top Director" value={userStats.mostWatchedDirector} delay={0.5} />
          <StatBadge icon={Clapperboard} label="Recent Fave" value={userStats.recentFavorite} delay={0.6} />
        </div>

        {/* Favorite genres */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm mb-4"
        >
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-700">
            <Heart className="h-4 w-4 text-cineva-500" />
            Favorite Genres
          </h3>
          <div className="flex flex-wrap gap-2">
            {userStats.favoriteGenres.slice(0, 3).map((genre, i) => (
              <Badge key={genre} variant={i === 0 ? "warm" : "secondary"}>
                {genre}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Top cinemas */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm mb-8"
        >
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-700">
            <MapPin className="h-4 w-4 text-cineva-500" />
            Top Cinemas
          </h3>
          <div className="space-y-2">
            {userStats.topCinemas.map((cinema, i) => (
              <div key={cinema.name} className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-xs font-bold text-amber-600">
                  {i + 1}
                </span>
                <span className="flex-1 text-stone-600">{cinema.name}</span>
                <span className="text-xs font-medium text-stone-400">{cinema.visits} visits</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button onClick={onFindMatches} size="lg" className="w-full">
            Find Matches
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
