import { useEffect, useState } from "react"

export function useMobile(maxWidth = 768) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${maxWidth}px)`)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener("change", handler)
    setIsMobile(mql.matches)
    return () => mql.removeEventListener("change", handler)
  }, [maxWidth])
  return isMobile
}
