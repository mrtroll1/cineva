import { useState } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, X, Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { MatchCard } from "@/components/MatchCard"
import { useMatches } from "@/hooks/useMatches"
import { useProfile } from "@/hooks/useProfile"
import { CURRENT_USER_ID } from "@/lib/constants"

export function Feed() {
  const navigate = useNavigate()
  const { data: matches, loading: matchesLoading } = useMatches(CURRENT_USER_ID)
  const { data: profileData } = useProfile(CURRENT_USER_ID)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMatch, setShowMatch] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  if (matchesLoading || !matches) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cineva-500" />
      </div>
    )
  }

  const currentMatch = currentIndex < matches.length ? matches[currentIndex] : null

  const advance = () => {
    setCurrentIndex((i) => i + 1)
    setIsAnimating(false)
  }

  const handleSkip = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(advance, 250)
  }

  const handleLike = () => {
    if (isAnimating) return
    setIsAnimating(true)
    const newLikeCount = likeCount + 1
    setLikeCount(newLikeCount)

    if (newLikeCount % 2 === 0) {
      setShowMatch(true)
      setTimeout(() => {
        setShowMatch(false)
        advance()
      }, 2200)
    } else {
      setTimeout(advance, 250)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-screen w-full flex-col items-center"
    >
      {/* Top bar */}
      <div className="flex w-full max-w-md items-center justify-between px-6 py-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/profile")} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Profile
        </Button>
        <h2 className="font-serif text-xl text-stone-800">Discover</h2>
        <div className="w-20" />
      </div>

      {currentMatch ? (
        <div className="mx-auto w-full max-w-md flex-1 px-6 pb-4 flex flex-col">
          {/* Card area */}
          <div className="relative flex-1 min-h-0 max-h-[520px]">
            {currentIndex + 1 < matches.length && (
              <div className="pointer-events-none absolute inset-0 top-2 rounded-3xl bg-stone-200/60 scale-[0.96]" />
            )}

            <AnimatePresence mode="wait">
              <MatchCard key={currentMatch.id} match={currentMatch} />
            </AnimatePresence>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-5 py-3">
            <button
              type="button"
              onClick={handleSkip}
              disabled={isAnimating}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-stone-200 bg-white transition-all hover:border-stone-300 hover:bg-stone-50 active:scale-95 disabled:opacity-40 cursor-pointer"
            >
              <X className="h-5 w-5 text-stone-400" />
            </button>

            <button
              type="button"
              onClick={handleLike}
              disabled={isAnimating}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cineva-400 to-cineva-600 text-white shadow-lg shadow-cineva-200 transition-all hover:shadow-xl active:scale-95 disabled:opacity-40 cursor-pointer"
            >
              <Heart className="h-6 w-6 fill-white" />
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-[60vh] flex-col items-center justify-center gap-4 px-6"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cineva-50 text-cineva-500">
            <Logo size={48} />
          </div>
          <h3 className="font-serif text-2xl text-stone-800">You've seen everyone!</h3>
          <p className="text-center text-sm text-stone-500 max-w-xs">
            Check back later for new culture lovers in your area
          </p>
          <Button onClick={() => navigate("/profile")} variant="outline" className="mt-2">
            Back to profile
          </Button>
        </motion.div>
      )}

      {/* Match overlay */}
      <AnimatePresence>
        {showMatch && currentMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-cineva-500/95 to-cineva-700/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Logo size={64} className="text-amber-300" />
              </motion.div>

              <h2 className="font-serif text-5xl text-white">It's a Match!</h2>

              <div className="flex items-center gap-4">
                <img
                  src={profileData?.user.photo ?? ''}
                  alt={profileData?.user.name ?? 'You'}
                  className="h-20 w-20 rounded-full border-[3px] border-white/80 object-cover shadow-lg"
                />
                <Heart className="h-8 w-8 text-amber-300 fill-amber-300" />
                <img
                  src={currentMatch.photo ?? ''}
                  alt={currentMatch.name}
                  className="h-20 w-20 rounded-full border-[3px] border-white/80 object-cover shadow-lg"
                />
              </div>

              <p className="text-center text-lg text-cineva-100">
                You and {currentMatch.name} share a love for film
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
