'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { fadeUpHero as fadeUp, stagger } from '@/lib/animations'
import { MaskedTeamCard, RestructuringNotice } from '@/components/RestructuringNotice'

const stats = [
  { value: '2026', label: 'Pilot Launch', sub: 'Costa Rica ~ Phase 1' },
  { value: 'Minamata', label: 'Convention Aligned', sub: 'UN Mercury Treaty Compliant' },
  { value: '5', label: 'Integrated Pillars', sub: 'One deployable platform' },
]

const pillars = [
  {
    letter: 'A',
    title: 'Mercury Capture',
    desc: 'Proprietary hermetic containment systems achieving >99% capture efficiency ~ eliminating the primary toxin in artisanal mining environments and protecting watersheds for generations.',
    color: 'text-gold',
    border: 'border-gold/20',
    href: '/technology#pillar-A',
  },
  {
    letter: 'B',
    title: 'Community Water Infrastructure',
    desc: 'Solar-powered pumping systems, distribution networks, and village-scale storage delivering potable water to communities of 200-5,000 people with 20+ year operational lifespans.',
    color: 'text-teal',
    border: 'border-teal/20',
    href: '/technology#pillar-B',
  },
  {
    letter: 'C',
    title: 'Subsurface Intelligence',
    desc: 'Hyper-Spectral Plasma Detection fused with satellite imagery and AI ~ 3D environmental mapping to 50m depth for aquifer identification and contamination plume assessment.',
    color: 'text-teal',
    border: 'border-teal/20',
    href: '/technology#pillar-C',
  },
  {
    letter: 'D',
    title: 'Trident System',
    desc: 'Molecular stabilization technology that transforms toxic mine tailings into fertile agricultural substrate ~ reclaiming land and livelihoods for mining-affected communities.',
    color: 'text-gold',
    border: 'border-gold/20',
    href: '/technology#pillar-D',
  },
  {
    letter: 'E',
    title: 'Hydrogeological Infrastructure',
    desc: 'Precision aquifer mapping, source protection protocols, and basin-wide hydrological monitoring ~ defending primary water systems from surface contamination.',
    color: 'text-gold',
    border: 'border-gold/20',
    href: '/technology#pillar-E',
  },
]

const partners = [
  { name: 'Aquatron USA', role: 'Water Technology' },
  { name: 'Artisanal Mining Council', role: 'Mercury Reduction & Field Standards' },
  { name: 'University of Florida', role: 'Research Partner' },
  { name: 'Trident Agriculture Solutions', role: 'Land Regeneration' },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,212,170,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(201,168,76,0.06),transparent)]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-20 sm:pt-44 sm:pb-32">
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5 sm:space-y-8">
            <motion.p variants={fadeUp} className="section-label mx-auto max-w-[18rem] text-[0.65rem] leading-relaxed tracking-[0.16em] sm:max-w-none sm:text-xs sm:tracking-[0.2em]">
              Global Environmental Remediation Platform
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mx-auto max-w-[18rem] text-[1.75rem] font-display font-bold leading-[1.08] text-white sm:max-w-3xl sm:text-5xl md:text-6xl lg:max-w-5xl lg:text-7xl"
            >
              Transforming Environmental{' '}
              <span className="text-gradient-gold">Liabilities</span> Into{' '}
              <span className="text-gradient-teal">Recoverable Value</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto max-w-[22rem] text-[0.95rem] leading-relaxed text-gray-400 sm:max-w-2xl sm:text-lg md:max-w-3xl md:text-xl"
            >
              GMRWS deploys a five-pillar technology platform ~ mercury remediation, community water
              infrastructure, subsurface intelligence, land regeneration, and aquifer protection ~
              in mining-affected communities across Africa, South America, and Southeast Asia.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link href="/contact" className="btn-gold">
                Partner With Us
              </Link>
              <Link href="/technology" className="btn-outline">
                Explore the Platform
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-12 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
          >
            <span className="text-gray-600 text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-gray-600 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-navy-mid border-y border-navy-border py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-0 sm:divide-x divide-navy-border">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center px-8">
                <p className="text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-2">
                  {stat.value}
                </p>
                <p className="text-white font-semibold text-sm uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <p className="text-gray-500 text-xs">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Pillars */}
      <section className="py-24 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="section-label">The GMRWS Architecture</p>
            <h2 className="section-heading max-w-2xl">
              Five Pillars. One Integrated Platform.
            </h2>
            <div className="gold-line" />
            <p className="text-gray-400 max-w-2xl leading-relaxed">
              Each pillar is independently deployable and collectively self-reinforcing ~ mercury
              capture protects the water, water infrastructure sustains the community, and soil
              restoration returns the land.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.letter}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={pillar.href}
                  className={`card relative border ${pillar.border} overflow-hidden group flex flex-col h-full
                    hover:border-teal/60 hover:shadow-[0_0_20px_rgba(0,212,170,0.08)]
                    transition-all duration-300 cursor-pointer`}
                >
                  <span className={`pillar-letter ${pillar.color}`}>{pillar.letter}</span>
                  <p className={`text-xs font-bold tracking-[0.2em] uppercase mb-3 ${pillar.color}`}>
                    Pillar {pillar.letter}
                  </p>
                  <h3 className="text-xl font-display font-bold text-white mb-4 group-hover:text-teal transition-colors duration-200">
                    {pillar.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{pillar.desc}</p>
                </Link>
              </motion.div>
            ))}

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <Link
                href="/technology"
                className="card border border-teal/30 bg-gradient-to-br from-navy-card to-navy-mid flex flex-col justify-between h-full
                  hover:border-teal/60 hover:shadow-[0_0_20px_rgba(0,212,170,0.08)]
                  transition-all duration-300 cursor-pointer group"
              >
                <div>
                  <p className="text-teal text-xs font-bold tracking-[0.2em] uppercase mb-3">
                    Full Architecture
                  </p>
                  <h3 className="text-xl font-display font-bold text-white mb-4 group-hover:text-teal transition-colors duration-200">
                    Explore the Complete Platform
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Deep-dive into the physics, deployment methodology, and verified performance
                    data behind every pillar.
                  </p>
                </div>
                <span className="btn-teal mt-8 self-start text-xs">
                  View Technology
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-navy-mid border-y border-navy-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center section-label mb-10">Institutional Partners</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((p) => (
              <div
                key={p.name}
                className="flex flex-col items-center text-center py-4 px-6 border border-navy-border rounded-sm hover:border-gold/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-navy-border mb-3 flex items-center justify-center">
                  <span className="text-gold font-bold text-sm">{p.name[0]}</span>
                </div>
                <p className="text-white text-sm font-semibold group-hover:text-gold transition-colors">
                  {p.name}
                </p>
                <p className="text-gray-500 text-xs mt-1">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-24 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-6"
          >
            <div>
              <p className="section-label">Leadership</p>
              <h2 className="section-heading max-w-xl">
                Leadership Structure
              </h2>
              <div className="gold-line" />
            </div>
            <Link href="/about" className="btn-outline text-xs self-start sm:self-auto flex-none">
              View Update
            </Link>
          </motion.div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                >
                  <MaskedTeamCard compact />
                </motion.div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-navy/20 p-4 sm:flex">
              <RestructuringNotice />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(0,212,170,0.05),transparent)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-label">Get Involved</p>
            <h2 className="section-heading mb-6">
              Ready to turn a liability into an asset?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Whether you represent a government body, impact fund, grant institution, or
              mining-affected community ~ there is a role for you in the GMRWS platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/funding" className="btn-gold">
                Investor Inquiry
              </Link>
              <Link href="/funding" className="btn-outline-teal">
                Grant Partnership
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
