import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Landing } from "@/pages/Landing"
import { Profile } from "@/pages/Profile"
import { Feed } from "@/pages/Feed"

type View = "landing" | "profile" | "feed"

function App() {
  const [view, setView] = useState<View>("landing")

  return (
    <div className="w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {view === "landing" && (
          <Landing key="landing" onConnect={() => setView("profile")} />
        )}
        {view === "profile" && (
          <Profile key="profile" onFindMatches={() => setView("feed")} />
        )}
        {view === "feed" && (
          <Feed key="feed" onBack={() => setView("profile")} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
