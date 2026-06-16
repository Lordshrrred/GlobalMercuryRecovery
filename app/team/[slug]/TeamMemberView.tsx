'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MaskedTeamCard, RestructuringNotice } from '@/components/RestructuringNotice'
import { fadeUp } from '@/lib/animations'

export default function TeamMemberView() {
  return (
    <>
      <section className="pt-44 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-20%,rgba(201,168,76,0.06),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gold transition-colors text-xs uppercase tracking-widest mb-12 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
              Leadership Update
            </Link>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-3xl">
            <p className="section-label">Leadership</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-4">
              Leadership Profile Under Review
            </h1>
            <div className="gold-line" />
            <RestructuringNotice />
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
            <MaskedTeamCard />
            <div className="space-y-4 rounded-sm border border-navy-border bg-navy-card p-6 blur-sm">
              <div className="h-4 w-32 rounded-sm bg-teal/20" />
              <div className="h-5 w-3/4 rounded-sm bg-white/14" />
              <div className="h-4 w-full rounded-sm bg-white/10" />
              <div className="h-4 w-11/12 rounded-sm bg-white/10" />
              <div className="h-4 w-10/12 rounded-sm bg-white/10" />
              <div className="h-4 w-full rounded-sm bg-white/10" />
              <div className="h-4 w-8/12 rounded-sm bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-navy-mid border-t border-navy-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div>
            <p className="max-w-[20rem] text-center text-xs uppercase leading-relaxed tracking-wider text-gray-500 sm:max-w-none sm:text-left">
              Global Mercury Recovery &amp; Water Security
            </p>
            <p className="text-white font-semibold">Leadership information will be updated soon.</p>
          </div>
          <Link href="/contact" className="btn-gold text-xs">
            Contact GMRWS
          </Link>
        </div>
      </section>
    </>
  )
}
