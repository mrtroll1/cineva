import { useState } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, X, Send, MapPin, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/Logo"
import { MatchCard } from "@/components/MatchCard"
import { useMatches } from "@/hooks/useMatches"
import { CURRENT_USER_ID } from "@/lib/constants"

export function Feed() {
  const navigate = useNavigate()
  const { data: matches, loading: matchesLoading } = useMatches(CURRENT_USER_ID)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [whereText, setWhereText] = useState("")
  const [whenText, setWhenText] = useState("")

  if (matchesLoading || !matches) return null

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

  const handleInviteOpen = () => {
    if (isAnimating) return
    setShowInviteModal(true)
  }

  const handleInviteSend = () => {
    setShowInviteModal(false)
    setWhereText("")
    setWhenText("")
    setIsAnimating(true)
    setTimeout(advance, 250)
  }

  const handleInviteClose = () => {
    setShowInviteModal(false)
    setWhereText("")
    setWhenText("")
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
              onClick={handleInviteOpen}
              disabled={isAnimating}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cineva-400 to-cineva-600 text-white shadow-lg shadow-cineva-200 transition-all hover:shadow-xl active:scale-95 disabled:opacity-40 cursor-pointer"
            >
              <Send className="h-5 w-5" />
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

      {/* Invite modal */}
      <AnimatePresence>
        {showInviteModal && currentMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6"
            onClick={handleInviteClose}
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
                  Invite {currentMatch.name.split(' ')[0]}
                </h3>
                <button
                  type="button"
                  onClick={handleInviteClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <label className="mb-2 block text-sm font-medium text-stone-600">Where</label>
              <div className="relative mb-3">
                <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input
                  placeholder="e.g. Eye Filmmuseum"
                  value={whereText}
                  onChange={(e) => setWhereText(e.target.value)}
                  className="pl-11"
                  autoFocus
                />
              </div>

              <label className="mb-2 block text-sm font-medium text-stone-600">When</label>
              <div className="relative mb-4">
                <CalendarDays className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input
                  placeholder="e.g. This Saturday evening"
                  value={whenText}
                  onChange={(e) => setWhenText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && whereText.trim() && whenText.trim() && handleInviteSend()}
                  className="pl-11"
                />
              </div>

              <Button
                onClick={handleInviteSend}
                disabled={!whereText.trim() || !whenText.trim()}
                className="w-full"
              >
                Send Invite
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
