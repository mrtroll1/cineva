import { useState, useEffect } from 'react'
import { fetchMatches, type Match } from '@/lib/api'

export function useMatches(userId: string) {
  const [data, setData] = useState<Match[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    fetchMatches(userId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [userId])

  return { data, loading, error }
}
