import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { MatchCard } from "@/components/MatchCard"
import mockData from "@/data/mockData.json"

interface FeedProps {
  onBack: () => void
}

export function Feed({ onBack }: FeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMatch, setShowMatch] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const matches = mockData.matches
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
      <div className="flex w-full max-w-md items-center justify-between px-6 py-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Profile
        </Button>
        <h2 className="text-lg font-semibold text-slate-900">Discover</h2>
        <div className="w-20" />
      </div>

      {currentMatch ? (
        <div className="mx-auto w-full max-w-md flex-1 px-6 pb-6 flex flex-col">
          {/* Card area */}
          <div className="relative flex-1 min-h-0 max-h-[600px]">
            {/* Background depth card — pointer-events-none so it never blocks clicks */}
            {currentIndex + 1 < matches.length && (
              <div className="pointer-events-none absolute inset-0 top-2 rounded-3xl bg-slate-100 scale-[0.96] opacity-60" />
            )}

            <AnimatePresence mode="wait">
              <MatchCard key={currentMatch.id} match={currentMatch} />
            </AnimatePresence>
          </div>

          {/* Action buttons — always accessible */}
          <div className="flex items-center justify-center gap-6 py-5">
            <button
              type="button"
              onClick={handleSkip}
              disabled={isAnimating}
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-200 bg-white transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95 disabled:opacity-40 cursor-pointer"
            >
              <X className="h-6 w-6 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={handleLike}
              disabled={isAnimating}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-coral-400 to-coral-500 text-white shadow-lg shadow-coral-200 transition-all hover:shadow-xl active:scale-95 disabled:opacity-40 cursor-pointer"
            >
              <Heart className="h-7 w-7 fill-white" />
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
          <h3 className="text-xl font-semibold text-slate-800">You've seen everyone!</h3>
          <p className="text-center text-sm text-slate-500 max-w-xs">
            Check back later for new cinema lovers in your area.
          </p>
          <Button onClick={onBack} variant="outline" className="mt-2">
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

              <h2 className="text-4xl font-bold text-white">It's a Match!</h2>

              <div className="flex items-center gap-4">
                <img
                  src={mockData.user.photo}
                  alt={mockData.user.name}
                  className="h-20 w-20 rounded-full border-[3px] border-white object-cover shadow-lg"
                />
                <Heart className="h-8 w-8 text-coral-400 fill-coral-400" />
                <img
                  src={currentMatch.photo}
                  alt={currentMatch.name}
                  className="h-20 w-20 rounded-full border-[3px] border-white object-cover shadow-lg"
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
