import { useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { MapPin, Film, Clapperboard, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Match } from "@/lib/api"

interface MatchCardProps {
  match: Match
}

export function MatchCard({ match }: MatchCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activePage, setActivePage] = useState(0)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const page = Math.round(el.scrollLeft / el.clientWidth)
    setActivePage(page)
  }, [])

  const goToPage = (page: number) => {
    scrollRef.current?.scrollTo({ left: page * scrollRef.current.clientWidth, behavior: "smooth" })
  }

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
      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex flex-1 min-h-0 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        {/* Page 1: Photo + Info */}
        <div className="w-full flex-shrink-0 snap-start flex flex-col">
          {/* Photo with warm tint */}
          <div className="relative h-[55%] overflow-hidden">
            <img
              src={match.photo ?? ''}
              alt={match.name}
              className="h-full w-full object-cover"
              style={{ filter: 'saturate(0.92) sepia(0.06) brightness(1.02)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-amber-900/5" />

            {/* Name overlay */}
            <div className="absolute bottom-4 left-5 right-5">
              <h2 className="font-serif text-3xl text-white">
                {match.name}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="h-3.5 w-3.5 text-white/80" />
                <span className="text-sm text-white/90">{match.city}</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col gap-3 p-4 overflow-y-auto">
            <p className="text-sm text-stone-600 leading-relaxed italic">{match.bio}</p>

            <div className="flex items-center gap-2 text-sm text-stone-500">
              <Clapperboard className="h-4 w-4 text-amber-500" />
              <span className="font-medium">
                {match.filmsWatched} films
                {match.museumsVisited > 0 && ` · ${match.museumsVisited} exhibitions`}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-stone-500">
              <MapPin className="h-4 w-4 text-stone-400" />
              <span>{match.topCinema}</span>
              {match.topMuseum && (
                <>
                  <span className="text-stone-300">·</span>
                  <span>{match.topMuseum}</span>
                </>
              )}
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
        </div>

        {/* Page 2: Venue Stats */}
        <div className="w-full flex-shrink-0 snap-start flex flex-col p-5 gap-4 overflow-y-auto">
          <h3 className="font-serif text-xl text-stone-800">{match.name.split(' ')[0]}'s Stats</h3>

          {/* Top cinemas */}
          {match.topCinemas.length > 0 && (
            <div className="rounded-2xl bg-amber-50/60 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Clapperboard className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-semibold text-stone-700">Top Cinemas</span>
              </div>

              <div className="space-y-1.5">
                {match.topCinemas.map((venue) => (
                  <div key={venue.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-stone-400" />
                      <span className="text-sm text-stone-700">{venue.name}</span>
                    </div>
                    <span className="text-xs text-stone-500">{venue.visits} visits</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top museums (if applicable) */}
          {match.topMuseums.length > 0 && (
            <div className="rounded-2xl bg-cineva-50/60 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-cineva-600" />
                <span className="text-sm font-semibold text-stone-700">Top Museums</span>
              </div>

              <div className="space-y-1.5">
                {match.topMuseums.map((venue) => (
                  <div key={venue.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-stone-400" />
                      <span className="text-sm text-stone-700">{venue.name}</span>
                    </div>
                    <span className="text-xs text-stone-500">{venue.visits} visits</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-1.5 pb-3 pt-1">
        {[0, 1].map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              activePage === page
                ? "w-4 bg-cineva-500"
                : "w-1.5 bg-stone-300"
            }`}
          />
        ))}
      </div>
    </motion.div>
  )
}
