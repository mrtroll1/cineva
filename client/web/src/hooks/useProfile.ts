import { useState, useEffect } from 'react'
import { fetchProfile, type ProfileResponse } from '@/lib/api'

export function useProfile(userId: string) {
  const [data, setData] = useState<ProfileResponse | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchProfile(userId)
      .then((result) => { if (!cancelled) setData(result) })
      .catch((err) => { if (!cancelled) setError(err) })
    return () => { cancelled = true }
  }, [userId])

  return { data, loading: data === null && error === null, error }
}
