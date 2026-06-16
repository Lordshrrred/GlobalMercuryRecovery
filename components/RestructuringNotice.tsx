export const restructuringMessage =
  'Global Mercury Recovery & Water Security is currently undergoing a leadership restructuring. Updated team information will be published after the new operating structure is finalized.'

export function RestructuringNotice({
  compact = false,
  className = '',
}: {
  compact?: boolean
  className?: string
}) {
  return (
    <div
      className={`rounded-sm border border-gold/30 bg-navy/85 px-5 py-4 text-center shadow-[0_0_28px_rgba(0,0,0,0.32)] backdrop-blur-md ${className}`}
    >
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-teal">
        Leadership Update
      </p>
      <p
        className={`mx-auto mt-2 max-w-2xl font-medium leading-relaxed text-white ${
          compact ? 'text-xs' : 'text-sm sm:text-base'
        }`}
      >
        {restructuringMessage}
      </p>
    </div>
  )
}

export function MaskedTeamCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-sm border border-navy-border bg-navy-card">
      <div className="pointer-events-none select-none blur-md">
        <div className="aspect-square bg-gradient-to-br from-navy-border via-navy-mid to-navy-card" />
        <div className={compact ? 'space-y-2 p-3' : 'space-y-3 p-5'}>
          <div className="h-4 w-2/3 rounded-sm bg-white/16" />
          <div className="h-3 w-1/2 rounded-sm bg-gold/18" />
          {!compact && (
            <>
              <div className="h-3 w-full rounded-sm bg-white/10" />
              <div className="h-3 w-5/6 rounded-sm bg-white/10" />
              <div className="h-3 w-2/3 rounded-sm bg-white/10" />
            </>
          )}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-navy/30 p-3">
        <RestructuringNotice compact className="w-full" />
      </div>
    </div>
  )
}
