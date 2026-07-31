import TraceHubMark from '../components/TraceHubMark';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-surface">
      <div className="hidden lg:flex flex-col justify-between bg-primary-800 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <TraceHubMark size={56} withWordmark tone="white" className="relative z-10" />
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold leading-tight">Know where every asset is, always.</h2>
          <p className="mt-4 text-primary-100/90 text-sm leading-relaxed">
            Register equipment in seconds, let AI propose disposal timelines, assign gear to your team,
            and track it all with a simple scan &mdash; no hardware required.
          </p>
        </div>
        <div className="relative z-10 text-xs text-primary-200/70">© {new Date().getFullYear()} TraceHub Inventory. All rights reserved.</div>
      </div>
      <div className="flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <TraceHubMark size={40} withWordmark className="mb-8 lg:hidden" />
          <h1 className="text-2xl font-bold text-ink">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-ink/60">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
