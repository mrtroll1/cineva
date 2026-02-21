import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface StatBadgeProps {
  icon: LucideIcon
  label: string
  value: string | number
  delay?: number
}

export function StatBadge({ icon: Icon, label, value, delay = 0 }: StatBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="flex items-center gap-2.5 rounded-xl bg-white border border-stone-100 px-3 py-2.5"
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100">
        <Icon className="h-3.5 w-3.5 text-amber-600" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-stone-800 truncate">{value}</p>
        <p className="text-[11px] font-medium text-stone-400 uppercase tracking-wide">{label}</p>
      </div>
    </motion.div>
  )
}
