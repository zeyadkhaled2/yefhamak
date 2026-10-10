'use client'

import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useGsapScroll(rootRef: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const context = gsap.context(() => {
      gsap.set('[data-reveal]', { opacity: 0, y: 24 })
      gsap.set('[data-phone]', { opacity: 0, y: 40, rotate: 2 })

      gsap.to('[data-reveal]', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-reveal]', start: 'top 88%', once: true },
      })

      gsap.to('[data-phone]', {
        opacity: 1,
        y: 0,
        rotate: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-phone]', start: 'top 82%', once: true },
      })

      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        gsap.from(group.children, {
          opacity: 0,
          y: 28,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 82%', once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-float]').forEach((item) => {
        gsap.to(item, {
          y: -10,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })
    }, root)

    return () => context.revert()
  }, [rootRef])
}

export default useGsapScroll
