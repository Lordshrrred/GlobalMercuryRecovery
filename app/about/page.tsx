'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { fadeUp } from '@/lib/animations'
import { MaskedTeamCard, RestructuringNotice } from '@/components/RestructuringNotice'

const advisors = [
  {
    name: '[Advisory Member]',
    affiliation: 'Environmental Policy ~ International',
    role: 'Minamata Convention compliance and sovereign government engagement strategy.',
  },
  {
    name: '[Advisory Member]',
    affiliation: 'Finance & Impact Investing',
    role: 'Impact fund structure design and development finance institution relationships.',
  },
  {
    name: '[Advisory Member]',
    affiliation: 'Community Development',
    role: 'Indigenous community engagement, benefit-sharing frameworks, and rights-based approaches.',
  },
  {
    name: '[Advisory Member]',
    affiliation: 'Geoscience & Hydrogeology',
    role: 'Technical validation of subsurface mapping and primary water detection methodologies.',
  },
]

const credentials = [
  { value: '20+', label: 'Years in Development', sub: 'Field-tested across active ASGM regions' },
  { value: '2026', label: 'Pilot Launch', sub: 'Costa Rica ~ Phase 1' },
  { value: '5', label: 'Integrated Pillars', sub: 'One deployable platform' },
  { value: '4', label: 'Strategic Partners', sub: 'Research, standards and field bodies' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-44 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-20%,rgba(201,168,76,0.06),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-3xl">
            <p className="section-label">Who We Are</p>
            <h1 className="section-heading mb-6">
              Built by Field Scientists. Driven by Outcomes.
            </h1>
            <div className="gold-line" />
            <p className="text-gray-400 text-lg leading-relaxed">
              Global Mercury Removal & Water Security operates as the commercial deployment vehicle for
              GeoNano R&D LLC's proprietary environmental remediation and resource recovery
              technology stack ~ over 20 years in development through field trials across
              three continents.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-14 bg-navy-mid border-y border-navy-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:divide-x divide-navy-border">
            {credentials.map((c) => (
              <div key={c.label} className="text-center px-4">
                <p className="text-4xl font-display font-bold text-gradient-gold mb-1">{c.value}</p>
                <p className="text-white text-sm font-semibold mb-1">{c.label}</p>
                <p className="text-gray-500 text-xs">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-24 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="section-label">Our Story</p>
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                Science at the Intersection of Justice and Economics
              </h2>
              <div className="space-y-5 text-gray-400 leading-relaxed">
                <p>
                  The world's mining-affected regions ~ from the Amazon basin to West Africa
                  to the islands of Southeast Asia ~ share a common tragedy: the tools used to
                  extract wealth from the earth have poisoned the land, water, and bodies of the
                  communities living atop it. Mercury, the primary toxin in artisanal and
                  small-scale mining, does not stay where it is placed. It moves through
                  watersheds, bioaccumulates in fish, and enters the bloodstreams of children who
                  were never part of any extraction decision.
                </p>
                <p>
                  GMRWS was founded on a single conviction: that the science capable of
                  diagnosing this contamination is also capable of reversing it ~ and that
                  reversing it creates assets worth more than the damage it repairs. Mercury
                  capture restores water safety. Water infrastructure delivers sovereignty.
                  Soil remediation returns the land. Subsurface intelligence finds the source
                  and protects the aquifer. These are not separate programs ~ they are one
                  integrated system.
                </p>
                <p>
                  The platform we have built is not a theoretical model. It has been developed
                  through 20+ years of applied field science, iteratively refined in active
                  mining environments, and validated against some of the most challenging
                  geochemical conditions on Earth.
                </p>
                <p>
                  GeoNano R&D LLC holds the intellectual property, protocols, and technical
                  methodologies behind the GMRWS platform. Global Mercury Removal & Water Security is the
                  global deployment and partnership entity ~ the interface between the science
                  and the capital, governments, and communities that can scale it.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {[
                {
                  title: 'Science-First',
                  desc: 'Every protocol is grounded in peer-reviewed chemistry and field-validated geophysics. We do not deploy what we have not tested.',
                  accent: 'gold',
                },
                {
                  title: 'Community Sovereignty',
                  desc: 'Infrastructure we build is designed to be owned, operated, and governed by the communities it serves ~ not retained as leverage.',
                  accent: 'teal',
                },
                {
                  title: 'Self-Financing by Design',
                  desc: 'We believe that remediation which depends perpetually on grant funding will always be outpaced by extraction. The GMRWS model breaks that cycle.',
                  accent: 'gold',
                },
                {
                  title: 'Transparent Accountability',
                  desc: 'All environmental and social metrics are designed for third-party verification, regulatory reporting, and development finance compliance.',
                  accent: 'teal',
                },
              ].map((v) => (
                <div
                  key={v.title}
                  className={`p-6 border-l-4 ${
                    v.accent === 'gold' ? 'border-gold bg-gold/5' : 'border-teal bg-teal/5'
                  } rounded-r-sm`}
                >
                  <h3
                    className={`font-display font-bold text-lg mb-2 ${
                      v.accent === 'gold' ? 'text-gold' : 'text-teal'
                    }`}
                  >
                    {v.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-navy-mid border-t border-navy-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="section-label">Leadership</p>
            <h2 className="section-heading">Leadership Structure</h2>
            <div className="gold-line" />
            <p className="text-gray-500 text-sm max-w-xl">
              Current leadership information is being updated as the organization completes its restructuring.
            </p>
          </motion.div>

          <div className="relative">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                >
                  <MaskedTeamCard />
                </motion.div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-navy-mid/20 p-4 sm:flex">
              <RestructuringNotice />
            </div>
          </div>
        </div>
      </section>

      {/* Advisory */}
      <section className="py-24 bg-navy border-t border-navy-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="section-label">Advisory Structure</p>
            <h2 className="section-heading">Technical & Strategic Advisors</h2>
            <div className="gold-line" />
            <p className="text-gray-500 text-sm">
              Advisory board structure ~ members to be confirmed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {advisors.map((advisor, i) => (
              <motion.div
                key={`${advisor.affiliation}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="card border border-navy-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-none rounded-full bg-navy-border flex items-center justify-center">
                    <span className="text-teal text-sm font-bold">?</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">{advisor.name}</p>
                    <p className="text-teal text-xs font-medium uppercase tracking-wider mb-3">
                      {advisor.affiliation}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed">{advisor.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal entity note */}
      <section className="py-12 bg-navy-mid border-t border-navy-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div>
            <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Legal Entity</p>
            <p className="text-gray-300 font-medium">GeoNano R&D LLC</p>
            <p className="text-gray-500 text-sm">
              IP holder and R&D entity behind the GMRWS technology platform.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact" className="btn-gold text-xs">
              Contact the Team
            </Link>
            <Link href="/funding" className="btn-outline text-xs">
              Funding & Partnerships
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
