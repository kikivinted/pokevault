import { useState, useEffect, useRef } from 'react'

const BASE_URL = 'https://api.pokemontcg.io/v2'
const cache = new Map()

async function fetchAPI(endpoint) {
  if (cache.has(endpoint)) return cache.get(endpoint)
  const res = await fetch(`${BASE_URL}${endpoint}`)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  cache.set(endpoint, data)
  return data
}

export function useSearch(query, filters = {}, page = 1) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  useEffect(() => {
    if (!query && !filters.set && !filters.type && !filters.rarity) {
      setData(null)
      return
    }

    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const parts = []
    if (query) parts.push(`name:${query}*`)
    if (filters.set) parts.push(`set.id:${filters.set}`)
    if (filters.type) parts.push(`types:${filters.type}`)
    if (filters.rarity) parts.push(`rarity:"${filters.rarity}"`)

    const q = parts.length ? `?q=${encodeURIComponent(parts.join(' '))}&pageSize=20&page=${page}&orderBy=-set.releaseDate` : `?pageSize=20&page=${page}&orderBy=-set.releaseDate`

    setLoading(true)
    setError(null)

    fetch(`${BASE_URL}/cards${q}`, { signal: controller.signal })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(e => {
        if (e.name !== 'AbortError') { setError(e.message); setLoading(false) }
      })

    return () => controller.abort()
  }, [query, filters.set, filters.type, filters.rarity, page])

  return { data, loading, error }
}

export function useCard(id) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchAPI(`/cards/${id}`)
      .then(d => { setData(d.data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [id])

  return { data, loading, error }
}

export function useSets() {
  const [sets, setSets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAPI('/sets?orderBy=-releaseDate&pageSize=200')
      .then(d => { setSets(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return { sets, loading }
}

export function useTypes() {
  const [types, setTypes] = useState([])

  useEffect(() => {
    fetchAPI('/types')
      .then(d => setTypes(d.data || []))
      .catch(() => {})
  }, [])

  return types
}

export function useRarities() {
  const [rarities, setRarities] = useState([])

  useEffect(() => {
    fetchAPI('/rarities')
      .then(d => setRarities(d.data || []))
      .catch(() => {})
  }, [])

  return rarities
}
