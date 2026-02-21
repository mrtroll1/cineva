import { useState } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  Loader2,
  Ticket,
  Landmark,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VenueStats } from "@/components/VenueStats"
import { InvitesList } from "@/components/InvitesList"
import { useProfile } from "@/hooks/useProfile"
import { useInvites } from "@/hooks/useInvites"
import { ingestCineville, ingestMuseumkaart } from "@/lib/api"
import { CURRENT_USER_ID } from "@/lib/constants"

type ProviderTab = "cineville" | "museumkaart"

export function Profile() {
  const navigate = useNavigate()
  const { data, loading, refetch } = useProfile(CURRENT_USER_ID)
  const { data: invites } = useInvites(CURRENT_USER_ID)
  const [linkModal, setLinkModal] = useState<ProviderTab | null>(null)
  const [linkInput, setLinkInput] = useState("")
  const [linking, setLinking] = useState(false)

  if (loading || !data) return null

  const { user, cinemaStats, museumStats } = data
  const hasCineville = 'cineville' in (user.linkedProviders ?? {})
  const hasMuseumkaart = 'museumkaart' in (user.linkedProviders ?? {})
  const hasInvites = invites && invites.length > 0

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
      </div>

      {/* Content */}
      <div className="mx-auto mt-5 w-full px-6 flex justify-center">
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-md md:max-w-none md:w-auto">
          {/* Venue stats — always max-w-md */}
          <div className="w-full md:w-[28rem] md:flex-shrink-0">
            <VenueStats
              hasCineville={hasCineville}
              hasMuseumkaart={hasMuseumkaart}
              cinemaStats={cinemaStats}
              museumStats={museumStats}
              invites={invites}
              onLinkProvider={setLinkModal}
            />
          </div>

          {/* Invites — separate column on desktop only */}
          {hasInvites && (
            <div className="hidden md:block w-[28rem]">
              <InvitesList invites={invites} />
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto mt-5 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button onClick={() => navigate("/match")} size="lg" className="w-full">
            Find Dates
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
