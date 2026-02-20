import { useState, useEffect } from 'react'
import { fetchMatches, type Match } from '@/lib/api'

export function useMatches(userId: string) {
  const [data, setData] = useState<Match[] | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchMatches(userId)
      .then((result) => { if (!cancelled) setData(result) })
      .catch((err) => { if (!cancelled) setError(err) })
    return () => { cancelled = true }
  }, [userId])

  return { data, loading: data === null && error === null, error }
}
