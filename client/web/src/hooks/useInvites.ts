import { useState, useEffect } from 'react'
import { fetchInvites, type Invite } from '@/lib/api'

export function useInvites(userId: string) {
  const [data, setData] = useState<Invite[] | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchInvites(userId)
      .then((result) => { if (!cancelled) setData(result) })
      .catch((err) => { if (!cancelled) setError(err) })
    return () => { cancelled = true }
  }, [userId])

  return { data, loading: data === null && error === null, error }
}
