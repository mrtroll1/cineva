import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { Landing } from "@/pages/Landing"
import { Profile } from "@/pages/Profile"
import { Feed } from "@/pages/Feed"

function App() {
  return (
    <BrowserRouter>
      <div className="w-full max-w-lg mx-auto">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/match" element={<Feed />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
