import { motion } from "framer-motion"
import { Send, Clock, CheckCircle2, XCircle } from "lucide-react"
import type { Invite } from "@/lib/api"

interface InvitesListProps {
  invites: Invite[]
}

export function InvitesList({ invites }: InvitesListProps) {
  if (invites.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-700">
        <Send className="h-4 w-4 text-cineva-500" />
        Invites
      </h3>
      <div className="space-y-2">
        {invites.map((invite) => (
          <div
            key={invite.id}
            className="rounded-2xl border border-stone-100 bg-white p-3.5 shadow-sm flex items-start gap-3"
          >
            <img
              src={invite.otherUser.photo ?? ''}
              alt={invite.otherUser.name}
              className="h-10 w-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium text-stone-800 truncate">
                  {invite.direction === 'sent' ? `You → ${invite.otherUser.name}` : `${invite.otherUser.name} → You`}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {invite.whereText} · {invite.whenText}
              </p>
            </div>
            <div className="flex-shrink-0">
              {invite.status === 'PENDING' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                  <Clock className="h-3 w-3" />
                  Pending
                </span>
              )}
              {invite.status === 'ACCEPTED' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
                  Accepted
                </span>
              )}
              {invite.status === 'DECLINED' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-500">
                  <XCircle className="h-3 w-3" />
                  Declined
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
