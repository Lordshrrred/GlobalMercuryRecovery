import Link from 'next/link'
import BrandLockup from './BrandLockup'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/technology', label: 'Technology' },
  { href: '/impact', label: 'Impact' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/funding', label: 'Funding' },
  { href: '/contact', label: 'Contact' },
]

const services = [
  { label: 'Mercury Remediation', href: '/technology#pillar-A' },
  { label: 'Soil Regeneration', href: '/technology#pillar-D' },
  { label: 'Water Infrastructure', href: '/technology#pillar-B' },
  { label: 'Aquifer Protection', href: '/technology#pillar-E' },
  { label: 'Subsurface Intelligence', href: '/technology#pillar-C' },
  { label: 'Hydrogeological Infrastructure', href: '/technology#pillar-E' },
]

const serviceSummary = ['Mercury Remediation', 'Water Infrastructure', 'Land Regeneration', 'Soil Regeneration']

export default function Footer() {
  return (
    <footer className="bg-navy-mid border-t border-navy-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <BrandLockup context="footer" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Transforming environmental liabilities into lasting community value through science-driven
              remediation, resource recovery, and community infrastructure.
            </p>
            <p className="text-gold font-display text-lg italic">
              "From Liability to Legacy."
            </p>
            <p className="text-gray-600 text-xs mt-4 uppercase tracking-wider">
              GeoNano R&D LLC
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 mb-5">
              Platform
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.href + s.label}>
                  <Link
                    href={s.href}
                    className="text-sm text-gray-400 hover:text-gold transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-gray-600 text-xs leading-relaxed">
            &copy; {new Date().getFullYear()} GeoNano R&D LLC. All rights reserved.
          </p>
          <div className="flex max-w-[20rem] flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs leading-relaxed tracking-wide text-gray-700 sm:max-w-none sm:justify-end sm:text-right">
            {serviceSummary.map((item, index) => (
              <span key={item} className="inline-flex items-center gap-x-2 whitespace-nowrap">
                {index > 0 && <span className="text-gray-800" aria-hidden="true">|</span>}
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
