export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus-ring disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-600 shadow-sm',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark shadow-sm',
    accent: 'bg-accent text-primary-800 hover:bg-accent-dark shadow-sm',
    ghost: 'bg-transparent text-link hover:bg-primary-50',
    outline: 'border border-primary-200 text-link bg-white hover:bg-primary-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = '', noThemeBg = false }) {
  return (
    <div
      className={`rounded-xl2 shadow-card border ${className}`}
      style={noThemeBg ? { borderColor: 'rgb(var(--th-border))' } : { background: 'rgb(var(--th-surface))', borderColor: 'rgb(var(--th-border))', color: 'rgb(var(--th-text))' }}
    >
      {children}
    </div>
  );
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium" style={{ color: 'rgb(var(--th-text-muted))' }}>{label}</span>}
      <input
        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus-ring focus:border-secondary ${error ? 'border-red-400' : ''} ${className}`}
        style={{ background: 'rgb(var(--th-surface))', color: 'rgb(var(--th-text))', borderColor: error ? undefined : 'rgb(var(--th-border))' }}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function Select({ label, className = '', children, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium" style={{ color: 'rgb(var(--th-text-muted))' }}>{label}</span>}
      <select
        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus-ring focus:border-secondary ${className}`}
        style={{ background: 'rgb(var(--th-surface))', color: 'rgb(var(--th-text))', borderColor: 'rgb(var(--th-border))' }}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function Badge({ children, tone = 'default' }) {
  const tones = {
    default: 'bg-primary-50 text-ink',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function statusTone(status) {
  const map = {
    available: 'success', assigned: 'info', in_maintenance: 'warning',
    disposed: 'default', lost: 'danger', reserved: 'warning',
    active: 'success', returned: 'default', overdue: 'danger', cancelled: 'default',
    trialing: 'info', trial: 'info', past_due: 'warning', expired: 'danger', suspended: 'danger', cancelled_sub: 'default',
  };
  return map[status] || 'default';
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
          <Icon size={26} className="text-link" />
        </div>
      )}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-ink/60">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Spinner({ size = 20 }) {
  return (
    <svg className="animate-spin text-link" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
