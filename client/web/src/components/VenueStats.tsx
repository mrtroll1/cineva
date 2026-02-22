import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Film,
  Landmark,
  MapPin,
  Trophy,
  Clapperboard,
  TrendingUp,
  Heart,
  Palette,
  Ticket,
  Music,
  Send,
  Link as LinkIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StatBadge } from "@/components/StatBadge"
import { InvitesList } from "@/components/InvitesList"
import type { CinemaStats, MuseumStats, PerformingArtsStats, Invite } from "@/lib/api"

type ProviderTab = "cineville" | "museumkaart" | "wearepublic"
type Tab = ProviderTab | "invites"

interface VenueStatsProps {
  hasCineville: boolean
  hasMuseumkaart: boolean
  hasWeArePublic: boolean
  cinemaStats: CinemaStats | null
  museumStats: MuseumStats | null
  performingArtsStats: PerformingArtsStats | null
  invites: Invite[] | null
  forceTab: ProviderTab | null
  onLinkProvider: (provider: ProviderTab) => void
}

export function VenueStats({ hasCineville, hasMuseumkaart, hasWeArePublic, cinemaStats, museumStats, performingArtsStats, invites, forceTab, onLinkProvider }: VenueStatsProps) {
  const [activeTab, setActiveTab] = useState<Tab | null>(null)

  if (forceTab && activeTab !== forceTab) {
    setActiveTab(forceTab)
  } else if (activeTab === null) {
    if (hasCineville) setActiveTab("cineville")
    else if (hasMuseumkaart) setActiveTab("museumkaart")
    else if (hasWeArePublic) setActiveTab("wearepublic")
  }

  const resolvedTab = activeTab ?? (hasCineville ? "cineville" : hasMuseumkaart ? "museumkaart" : hasWeArePublic ? "wearepublic" : null)

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {/* Invites tab — first on mobile, hidden on desktop */}
        {invites && invites.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("invites")}
            className={`md:hidden inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
              resolvedTab === "invites"
                ? "bg-cineva-100 text-cineva-800 shadow-sm"
                : "bg-stone-50 text-stone-500 hover:bg-stone-100"
            }`}
          >
            <Send className="h-3 w-3" />
            Invites
          </button>
        )}

        {hasCineville ? (
          <button
            type="button"
            onClick={() => setActiveTab("cineville")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
              resolvedTab === "cineville"
                ? "bg-cineva-100 text-cineva-800 shadow-sm"
                : "bg-stone-50 text-stone-500 hover:bg-stone-100"
            }`}
          >
            <Ticket className="h-3 w-3" />
            Cineville
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onLinkProvider("cineville")}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-stone-300 px-3 py-1 text-xs font-medium text-stone-400 transition-all hover:border-cineva-300 hover:text-cineva-500 cursor-pointer"
          >
            <LinkIcon className="h-3 w-3" />
            Link Cineville
          </button>
        )}

        {hasMuseumkaart ? (
          <button
            type="button"
            onClick={() => setActiveTab("museumkaart")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
              resolvedTab === "museumkaart"
                ? "bg-cineva-100 text-cineva-800 shadow-sm"
                : "bg-stone-50 text-stone-500 hover:bg-stone-100"
            }`}
          >
            <Landmark className="h-3 w-3" />
            Museumkaart
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onLinkProvider("museumkaart")}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-stone-300 px-3 py-1 text-xs font-medium text-stone-400 transition-all hover:border-cineva-300 hover:text-cineva-500 cursor-pointer"
          >
            <LinkIcon className="h-3 w-3" />
            Link Museumkaart
          </button>
        )}

        {hasWeArePublic ? (
          <button
            type="button"
            onClick={() => setActiveTab("wearepublic")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
              resolvedTab === "wearepublic"
                ? "bg-cineva-100 text-cineva-800 shadow-sm"
                : "bg-stone-50 text-stone-500 hover:bg-stone-100"
            }`}
          >
            <Music className="h-3 w-3" />
            We Are Public
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onLinkProvider("wearepublic")}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-stone-300 px-3 py-1 text-xs font-medium text-stone-400 transition-all hover:border-cineva-300 hover:text-cineva-500 cursor-pointer"
          >
            <LinkIcon className="h-3 w-3" />
            Link We Are Public
          </button>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {resolvedTab === "cineville" && cinemaStats && (
          <motion.div
            key="cinema"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-2 gap-2 mb-4">
              <StatBadge icon={Film} label="Films Watched" value={cinemaStats.visitsCount} delay={0.1} />
              <StatBadge icon={TrendingUp} label="Monthly Avg" value={cinemaStats.monthlyAverage} delay={0.15} />
              <StatBadge icon={Trophy} label="Top Director" value={cinemaStats.mostWatchedDirector} delay={0.2} />
              <StatBadge icon={Clapperboard} label="Recent Fave" value={cinemaStats.recentFavorite} delay={0.25} />
            </div>

            <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm mb-3">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-700">
                <Heart className="h-4 w-4 text-cineva-500" />
                Favorite Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {cinemaStats.favoriteGenres.slice(0, 3).map((genre: string, i: number) => (
                  <Badge key={genre} variant={i === 0 ? "warm" : "secondary"}>
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-700">
                <MapPin className="h-4 w-4 text-cineva-500" />
                Top Cinemas
              </h3>
              <div className="space-y-2">
                {cinemaStats.topVenues.map((cinema, i) => (
                  <div key={cinema.name} className="flex items-center gap-3 text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-xs font-bold text-amber-600">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-stone-600">{cinema.name}</span>
                    <span className="text-xs font-medium text-stone-400">{cinema.visits} visits</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {resolvedTab === "museumkaart" && museumStats && (
          <motion.div
            key="museum"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-2 gap-2 mb-4">
              <StatBadge icon={Landmark} label="Exhibitions" value={museumStats.visitsCount} delay={0.1} />
              <StatBadge icon={TrendingUp} label="Monthly Avg" value={museumStats.monthlyAverage} delay={0.15} />
              <StatBadge icon={Palette} label="Fav Artist" value={museumStats.favoriteArtist} delay={0.2} />
              <StatBadge icon={Clapperboard} label="Recent Fave" value={museumStats.recentFavorite} delay={0.25} />
            </div>

            <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm mb-3">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-700">
                <Heart className="h-4 w-4 text-cineva-500" />
                Favorite Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {museumStats.favoriteCategories.slice(0, 3).map((cat: string, i: number) => (
                  <Badge key={cat} variant={i === 0 ? "warm" : "secondary"}>
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-700">
                <MapPin className="h-4 w-4 text-cineva-500" />
                Top Museums
              </h3>
              <div className="space-y-2">
                {museumStats.topVenues.map((museum, i) => (
                  <div key={museum.name} className="flex items-center gap-3 text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-xs font-bold text-amber-600">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-stone-600">{museum.name}</span>
                    <span className="text-xs font-medium text-stone-400">{museum.visits} visits</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {resolvedTab === "wearepublic" && performingArtsStats && (
          <motion.div
            key="performingarts"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-2 gap-2 mb-4">
              <StatBadge icon={Music} label="Events" value={performingArtsStats.visitsCount} delay={0.1} />
              <StatBadge icon={TrendingUp} label="Monthly Avg" value={performingArtsStats.monthlyAverage} delay={0.15} />
              <StatBadge icon={Trophy} label="Fav Artist" value={performingArtsStats.favoriteArtist} delay={0.2} />
              <StatBadge icon={Clapperboard} label="Recent Fave" value={performingArtsStats.recentFavorite} delay={0.25} />
            </div>

            <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm mb-3">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-700">
                <Heart className="h-4 w-4 text-cineva-500" />
                Favorite Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {performingArtsStats.favoriteGenres.slice(0, 3).map((genre: string, i: number) => (
                  <Badge key={genre} variant={i === 0 ? "warm" : "secondary"}>
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-700">
                <MapPin className="h-4 w-4 text-cineva-500" />
                Top Venues
              </h3>
              <div className="space-y-2">
                {performingArtsStats.topVenues.map((venue, i) => (
                  <div key={venue.name} className="flex items-center gap-3 text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-xs font-bold text-amber-600">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-stone-600">{venue.name}</span>
                    <span className="text-xs font-medium text-stone-400">{venue.visits} visits</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {resolvedTab === "invites" && invites && (
          <motion.div
            key="invites"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
          >
            <InvitesList invites={invites} />
          </motion.div>
        )}

        {!resolvedTab && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 p-8 text-center"
          >
            <p className="text-sm text-stone-400">Link a provider to see your stats</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
