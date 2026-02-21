import { useState } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import {
  Film,
  Landmark,
  MapPin,
  Trophy,
  Clapperboard,
  TrendingUp,
  Heart,
  Loader2,
  Palette,
  Ticket,
  X,
  Link as LinkIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { StatBadge } from "@/components/StatBadge"
import { useProfile } from "@/hooks/useProfile"
import { ingestCineville, ingestMuseumkaart } from "@/lib/api"
import { CURRENT_USER_ID } from "@/lib/constants"

type ProviderTab = "cineville" | "museumkaart"

export function Profile() {
  const navigate = useNavigate()
  const { data, loading, refetch } = useProfile(CURRENT_USER_ID)
  const [activeTab, setActiveTab] = useState<ProviderTab | null>(null)
  const [linkModal, setLinkModal] = useState<ProviderTab | null>(null)
  const [linkInput, setLinkInput] = useState("")
  const [linking, setLinking] = useState(false)

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cineva-500" />
      </div>
    )
  }

  const { user, cinemaStats, museumStats } = data
  const hasCineville = 'cineville' in (user.linkedProviders ?? {})
  const hasMuseumkaart = 'museumkaart' in (user.linkedProviders ?? {})

  // Set initial active tab on first render
  if (activeTab === null) {
    if (hasCineville) setActiveTab("cineville")
    else if (hasMuseumkaart) setActiveTab("museumkaart")
  }

  const resolvedTab = activeTab ?? (hasCineville ? "cineville" : hasMuseumkaart ? "museumkaart" : null)

  const handleLink = async () => {
    if (!linkInput.trim() || !linkModal) return
    setLinking(true)
    try {
      if (linkModal === "cineville") {
        await ingestCineville(CURRENT_USER_ID, linkInput.trim())
      } else {
        await ingestMuseumkaart(CURRENT_USER_ID, linkInput.trim())
      }
      refetch()
    } catch {
      // non-blocking
    }
    setLinking(false)
    setLinkModal(null)
    setLinkInput("")
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
      className="flex w-full flex-col items-center pb-8 pt-6"
    >
      {/* Header */}
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-2 text-sm font-medium text-cineva-600"
        >
          Your Cinevá Profile
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <img
            src={user.photo ?? ''}
            alt={user.name}
            className="h-24 w-24 rounded-full border-4 border-amber-100 object-cover shadow-lg shadow-stone-200"
            style={{ filter: 'saturate(0.92) sepia(0.06) brightness(1.02)' }}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-3 font-serif text-2xl text-stone-800"
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
            Amsterdam
          </span>
        </motion.div>

        {/* Provider tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 flex items-center gap-2"
        >
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
              onClick={() => setLinkModal("cineville")}
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
              onClick={() => setLinkModal("museumkaart")}
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-stone-300 px-3 py-1 text-xs font-medium text-stone-400 transition-all hover:border-cineva-300 hover:text-cineva-500 cursor-pointer"
            >
              <LinkIcon className="h-3 w-3" />
              Link Museumkaart
            </button>
          )}
        </motion.div>
      </div>

      {/* Content */}
      <div className="mx-auto mt-5 w-full max-w-md px-6">
        <AnimatePresence mode="wait">
          {resolvedTab === "cineville" && cinemaStats && (
            <motion.div
              key="cinema"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <StatBadge icon={Film} label="Films Watched" value={cinemaStats.visitsCount} delay={0.1} />
                <StatBadge icon={TrendingUp} label="Monthly Avg" value={cinemaStats.monthlyAverage} delay={0.15} />
                <StatBadge icon={Trophy} label="Top Director" value={cinemaStats.mostWatchedDirector} delay={0.2} />
                <StatBadge icon={Clapperboard} label="Recent Fave" value={cinemaStats.recentFavorite} delay={0.25} />
              </div>

              {/* Favorite genres */}
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

              {/* Top cinemas */}
              <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm mb-5">
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
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <StatBadge icon={Landmark} label="Exhibitions" value={museumStats.visitsCount} delay={0.1} />
                <StatBadge icon={TrendingUp} label="Monthly Avg" value={museumStats.monthlyAverage} delay={0.15} />
                <StatBadge icon={Palette} label="Fav Artist" value={museumStats.favoriteArtist} delay={0.2} />
                <StatBadge icon={Clapperboard} label="Recent Fave" value={museumStats.recentFavorite} delay={0.25} />
              </div>

              {/* Favorite categories */}
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

              {/* Top museums */}
              <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm mb-5">
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

          {!resolvedTab && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 p-8 text-center mb-5"
            >
              <p className="text-sm text-stone-400">Link a provider to see your stats</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button onClick={() => navigate("/match")} size="lg" className="w-full">
            Find Matches
          </Button>
        </motion.div>
      </div>

      {/* Link provider modal */}
      <AnimatePresence>
        {linkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6"
            onClick={() => { setLinkModal(null); setLinkInput("") }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-stone-800">
                  Link {linkModal === "cineville" ? "Cineville" : "Museumkaart"}
                </h3>
                <button
                  type="button"
                  onClick={() => { setLinkModal(null); setLinkInput("") }}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <label className="mb-2 block text-sm font-medium text-stone-600">
                {linkModal === "cineville" ? "Pass number" : "Card number"}
              </label>
              <div className="relative mb-4">
                {linkModal === "cineville" ? (
                  <Ticket className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                ) : (
                  <Landmark className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                )}
                <Input
                  placeholder={linkModal === "cineville" ? "e.g. $93278420387" : "e.g. 3920184756"}
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLink()}
                  className="pl-11"
                  autoFocus
                />
              </div>

              <Button
                onClick={handleLink}
                disabled={!linkInput.trim() || linking}
                className="w-full"
              >
                {linking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Connect"
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
