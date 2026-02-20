import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Landing } from "@/pages/Landing"
import { Profile } from "@/pages/Profile"
import { Feed } from "@/pages/Feed"

type View = "landing" | "profile" | "feed"

function App() {
  const [view, setView] = useState<View>("landing")
  const [userId, setUserId] = useState<string | null>(null)

  const handleConnect = (connectedUserId: string) => {
    setUserId(connectedUserId)
    setView("profile")
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {view === "landing" && (
          <Landing key="landing" onConnect={handleConnect} />
        )}
        {view === "profile" && userId && (
          <Profile key="profile" userId={userId} onFindMatches={() => setView("feed")} />
        )}
        {view === "feed" && userId && (
          <Feed key="feed" userId={userId} onBack={() => setView("profile")} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
