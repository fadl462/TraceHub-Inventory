import { Link } from 'react-router-dom';
import { BookOpen, Zap, MessageCircleQuestion, Newspaper } from 'lucide-react';

export default function DocsHome() {
  return (
    <div>
      <div className="bg-gradient-to-br from-primary-800 to-primary px-6 sm:px-10 py-14 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">Welcome to</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">TraceHub Inventory Documentation</h1>
        <p className="text-white/70 max-w-xl">The comprehensive reference guide for every part of the TraceHub platform \u2014 from your first asset to the AI engines running underneath it.</p>
      </div>

      <div className="px-6 sm:px-10 py-14 grid sm:grid-cols-2 gap-10">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink mb-2">Get to know <span className="text-primary">TraceHub</span></h2>
          <p className="text-ink/60 mb-5">Start from the beginning \u2014 what TraceHub is, how it's organized, and who does what.</p>
          <Link to="/docs/what-is-tracehub-inventory" className="inline-flex items-center gap-2 bg-primary-800 text-white font-semibold px-5 py-3 rounded-lg hover:bg-primary-900 transition-colors">
            <BookOpen size={16} /> GET TO KNOW TRACEHUB
          </Link>
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-ink mb-2"><span className="text-primary">Quick-start</span> guide</h2>
          <p className="text-ink/60 mb-5">Don't have time? Follow the checklist to get a fully working workspace fast.</p>
          <Link to="/docs/quick-start-checklist" className="inline-flex items-center gap-2 bg-primary-800 text-white font-semibold px-5 py-3 rounded-lg hover:bg-primary-900 transition-colors">
            <Zap size={16} /> QUICK-START GUIDE
          </Link>
        </div>
      </div>

      <div className="bg-primary text-white px-6 sm:px-10 py-14 text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Don't have a TraceHub account yet?</h2>
        <p className="text-white/80 mb-6 max-w-xl mx-auto">Sign up and get started for free \u2014 every workspace starts with a 30-day trial, first 10 assets included, no card required.</p>
        <Link to="/register" className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors">
          TRY TRACEHUB TODAY
        </Link>
      </div>

      <div className="px-6 sm:px-10 py-14">
        <h2 className="font-display text-2xl font-bold text-ink text-center mb-8">Other resources</h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="border border-ink/10 rounded-xl overflow-hidden">
            <div className="bg-primary-50/50 px-5 py-3 flex items-center gap-2 font-semibold text-primary text-sm">
              <MessageCircleQuestion size={16} /> AI ASSISTANT
            </div>
            <p className="p-5 text-sm text-ink/60">Click the chat bubble in the corner \u2014 grounded in this same documentation, and, once logged in, your own live fleet data too.</p>
          </div>
          <div className="border border-ink/10 rounded-xl overflow-hidden">
            <div className="bg-primary-50/50 px-5 py-3 flex items-center gap-2 font-semibold text-primary text-sm">
              <Newspaper size={16} /> BLOG &amp; UPDATES
            </div>
            <p className="p-5 text-sm text-ink/60">
              <Link to="/blog" className="text-link hover:underline">Read our latest posts</Link> for deeper dives into how the AI engines work and what's new on the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
