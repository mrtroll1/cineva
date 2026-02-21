import { useState, useEffect, useCallback } from 'react'
import { fetchProfile, type ProfileResponse } from '@/lib/api'

export function useProfile(userId: string) {
  const [data, setData] = useState<ProfileResponse | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchProfile(userId)
      .then((result) => { if (!cancelled) setData(result) })
      .catch((err) => { if (!cancelled) setError(err) })
    return () => { cancelled = true }
  }, [userId, version])

  const refetch = useCallback(() => setVersion((v) => v + 1), [])

  return { data, loading: data === null && error === null, error, refetch }
}
