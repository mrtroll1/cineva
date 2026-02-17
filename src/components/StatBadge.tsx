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
      className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cineva-100">
        <Icon className="h-4 w-4 text-cineva-600" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{label}</p>
      </div>
    </motion.div>
  )
}
