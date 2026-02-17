import { motion } from "framer-motion"
import { MapPin, Film, Clapperboard } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MatchCardProps {
  match: {
    id: number
    name: string
    age: number
    photo: string
    city: string
    sharedGenres: string[]
    favoriteFilm: string
    bio: string
    filmsWatched: number
    topCinema: string
  }
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <motion.div
      key={match.id}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.2 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute inset-0 flex flex-col overflow-hidden rounded-3xl bg-white shadow-xl border border-stone-100"
    >
      {/* Photo with warm tint */}
      <div className="relative h-[55%] overflow-hidden">
        <img
          src={match.photo}
          alt={match.name}
          className="h-full w-full object-cover"
          style={{ filter: 'saturate(0.92) sepia(0.06) brightness(1.02)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-amber-900/5" />

        {/* Name overlay */}
        <div className="absolute bottom-4 left-5 right-5">
          <h2 className="font-serif text-3xl text-white">
            {match.name}, {match.age}
          </h2>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="h-3.5 w-3.5 text-white/80" />
            <span className="text-sm text-white/90">{match.city}</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-4 p-5 overflow-y-auto">
        <p className="text-sm text-stone-600 leading-relaxed italic">{match.bio}</p>

        <div className="flex items-center gap-2 text-sm text-stone-500">
          <Clapperboard className="h-4 w-4 text-amber-500" />
          <span className="font-medium">{match.filmsWatched} films</span>
          <span className="text-stone-300">|</span>
          <span>{match.topCinema}</span>
        </div>

        <div className="flex items-center gap-2">
          <Film className="h-4 w-4 text-cineva-500 shrink-0" />
          <span className="text-sm text-stone-500">Favorite:</span>
          <span className="text-sm font-medium text-stone-700 truncate">{match.favoriteFilm}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {match.sharedGenres.slice(0, 3).map((genre) => (
            <Badge key={genre} variant="default">
              {genre}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
