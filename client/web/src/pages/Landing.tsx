import { useState } from "react"
import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import { Ticket, Landmark, Music, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ingestCineville, ingestMuseumkaart, prefetchProfile } from "@/lib/api"
import { CURRENT_USER_ID } from "@/lib/constants"

export function Landing() {
  const navigate = useNavigate()
  const [passNumber, setPassNumber] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [memberId, setMemberId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const hasInput = passNumber.trim() || cardNumber.trim() || memberId.trim()

  const handleConnect = async () => {
    if (!hasInput) return
    setIsLoading(true)

    try {
      const promises: Promise<unknown>[] = []
      if (passNumber.trim()) {
        promises.push(ingestCineville(CURRENT_USER_ID, passNumber.trim()))
      }
      if (cardNumber.trim()) {
        promises.push(ingestMuseumkaart(CURRENT_USER_ID, cardNumber.trim()))
      }
      if (memberId.trim()) {
        localStorage.setItem('cineva:wap_linked', '1')
      }
      await Promise.allSettled(promises)
    } catch {
      // Ingest failure is non-blocking for the prototype
    }

    prefetchProfile(CURRENT_USER_ID)

    setTimeout(() => {
      setIsLoading(false)
      navigate("/profile")
    }, 1800)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen w-full flex-col items-center justify-center px-6"
    >
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-cineva-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-amber-100/30 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col items-center gap-3"
        >
          <h1 className="font-serif text-6xl tracking-tight text-stone-800">
            cin<span className="text-amber-500">e</span>vá
          </h1>
          <p className="text-center text-lg text-stone-500">
            Find your events soulmate
          </p>
        </motion.div>

        {/* Input card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full rounded-2xl border border-stone-100 bg-white p-6 shadow-lg shadow-stone-100/50"
        >
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Your Cineville pass number
          </label>
          <div className="relative mb-4">
            <Ticket className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-stone-400" />
            <Input
              placeholder="e.g. $93278420387"
              value={passNumber}
              onChange={(e) => setPassNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
              className="pl-11"
            />
          </div>

          <label className="mb-2 block text-sm font-medium text-stone-700">
            Your Museumkaart number
          </label>
          <div className="relative mb-4">
            <Landmark className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-stone-400" />
            <Input
              placeholder="e.g. 3920184756"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
              className="pl-11"
            />
          </div>

          <label className="mb-2 block text-sm font-medium text-stone-700">
            Your We Are Public member ID
          </label>
          <div className="relative mb-4">
            <Music className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-stone-400" />
            <Input
              placeholder="e.g. WAP-29481"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
              className="pl-11"
            />
          </div>

          <Button
            onClick={handleConnect}
            disabled={!hasInput || isLoading}
            className="w-full"
            size="lg"
          >
            Connect me!
            <ArrowRight className="h-4 w-4" />
          </Button>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 space-y-2"
            >
              <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.6, ease: "easeInOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-cineva-500"
                />
              </div>
              <p className="text-center text-xs text-stone-400">
                Fetching your cultural history...
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Demo banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="w-full rounded-xl border border-amber-200/60 bg-amber-50/60 px-4 py-3 text-center text-xs text-amber-700/80"
        >
          <span className="font-medium">Demo mode</span> — all data is artificial and functionality is limited.
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-stone-400"
        >
          By linking an events subscription, you allow your visit history to be used by Cinevá.
        </motion.p>
      </div>
    </motion.div>
  )
}
