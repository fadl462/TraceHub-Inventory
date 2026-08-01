module.exports = [
  {
    title: 'Welcome to TraceHub Inventory',
    slug: 'welcome-to-tracehub-inventory',
    excerpt: 'Why we built an asset management platform around a simple idea: you shouldn\u2019t need expensive hardware or a spreadsheet marathon to know what you own.',
    authorName: 'TraceHub Team',
    publishedAt: new Date('2026-08-01'),
    isPublished: true,
    coverImageUrl: '/blog/welcome-cover.svg',
    bodyHtml: `
      <p>Every company that owns physical equipment eventually runs into the same problem: nobody
      can say, with confidence, exactly what they own, where it is, or what it's worth. Not out of
      negligence \u2014 out of accumulation. A spreadsheet started three years ago with forty rows
      quietly grows to four thousand, half of them unverified, some of them describing equipment
      that was sold, lost, or scrapped a year ago without anyone updating the sheet.</p>

      <p>TraceHub Inventory exists because we think that problem is solvable without buying
      hardware, without hiring a full-time asset administrator, and without treating depreciation
      like a once-a-year accounting chore. This post is an introduction to how we think about the
      problem, and a plain-language walkthrough of how the platform actually works.</p>

      <h3>The three failure points of traditional asset tracking</h3>
      <p>Almost every organization we've spoken with about equipment tracking runs into the same
      three walls, usually in this order:</p>
      <p><strong>Visibility decays over time.</strong> A spreadsheet or a paper register is accurate
      the day it's created and less accurate every day after. There's no mechanism forcing an
      update when an asset moves, gets reassigned, or breaks down \u2014 so the record and reality
      drift apart until someone notices during an audit, usually the hard way.</p>
      <p><strong>Depreciation becomes a guess.</strong> Without a system doing the arithmetic
      automatically, book values either get ignored entirely or estimated once a year in a rushed
      spreadsheet formula that nobody fully trusts. Decisions about repair-versus-replace end up
      based on gut feeling rather than an actual number.</p>
      <p><strong>Tracking hardware is expensive to justify.</strong> RFID readers and GPS trackers
      solve real problems, but the upfront cost and installation effort put them out of reach for
      most small and mid-sized operations \u2014 which is precisely the segment that struggles most
      with visibility in the first place.</p>

      <h3>How TraceHub approaches each one</h3>
      <p>We didn't set out to build a smarter spreadsheet. We built the platform around three
      specific mechanisms, each aimed directly at one of those failure points.</p>

      <img src="/blog/asset-lifecycle.svg" alt="Asset lifecycle: Register, Track, Depreciate, Dispose" style="width:100%;border-radius:16px;margin:1.5rem 0;" />

      <p><strong>Real-time location, from a phone camera.</strong> Every asset gets a unique QR
      code the moment it's registered. Define your checkpoints \u2014 a warehouse, a branch office, a
      job site \u2014 and any team member can scan an asset in or out using the camera they already
      carry. No reader hardware, no installation, no per-unit tracking fee. The location history
      updates the instant a scan happens, not whenever someone remembers to update a sheet.</p>

      <p><strong>Depreciation calculated automatically, not estimated once a year.</strong> Every
      asset category carries a useful-life and scrap-value profile. The moment you enter a purchase
      price while registering an asset, TraceHub calculates straight-line depreciation on the spot:
      current book value, annual depreciation, and a suggested disposal date. As a concrete example:
      a $500 laptop with a 5-year useful life and a 10% scrap value depreciates by $90 a year \u2014
      three years in, its book value sits at $230, calculated the instant you view the asset rather
      than reconstructed at year-end.</p>

      <p><strong>Structure that scales with the organization, not against it.</strong> Super Admin,
      Company Admin, Manager, and Staff each see exactly what their role needs. Assignments track
      who currently has an asset \u2014 whether that's an employee or an outside contact \u2014 with
      automatic reminders three days before something is due back, and again on the day itself.
      Every scan, edit, and assignment lands in one audit trail, so "who had this last" stops being
      a mystery.</p>

      <h3>Who this is actually for</h3>
      <p>We built TraceHub with a specific kind of organization in mind: one with real physical
      assets \u2014 laptops, vehicles, generators, tools, networking equipment \u2014 spread across more
      than one location, managed by more than one person, where the informal system (a shared
      spreadsheet, a WhatsApp group, institutional memory) has started to strain. Logistics
      companies, field service operators, IT departments, consultancies with equipment fleets, and
      multi-branch retail operations tend to feel this most acutely.</p>

      <p>If you're currently tracking equipment on a single spreadsheet that only one person really
      understands, that's usually the moment this becomes worth solving properly \u2014 before an
      asset walks off, not after.</p>

      <h3>What's ahead</h3>
      <p>This platform is under active development. Reporting, integrations, and automation are
      areas we're continuing to build out, and we'll be writing about each meaningful addition here
      as it ships \u2014 not as a marketing exercise, but as an honest account of what's actually new
      and why we built it that way.</p>

      <p>If you're dealing with any of the problems above, the first ten assets are free for
      thirty days, with no card required to start. We'd genuinely like to know what you think.</p>
    `,
  },
  {
    title: 'Introducing AI-driven depreciation insights',
    slug: 'ai-driven-depreciation-insights',
    excerpt: 'Enter a purchase price and category, and TraceHub now estimates scrap value, useful life, and today\u2019s book value automatically.',
    authorName: 'TraceHub Team',
    publishedAt: new Date('2026-06-15'),
    isPublished: true,
    bodyHtml: `
      <p>Every asset category on TraceHub now carries a depreciation profile \u2014 an expected useful
      life and scrap value percentage refined from real-world equipment data. The moment you enter
      a purchase price while registering an asset, the platform calculates straight-line depreciation
      instantly: no separate spreadsheet, no manual formula.</p>
      <p>As a worked example: a $500 laptop with a 5-year useful life and 10% scrap value depreciates
      by $90 a year. Three years in, its book value sits at $230 \u2014 calculated the moment you view
      the asset, not just at year-end.</p>
      <p>You can override any individual asset's useful life if your business has different
      expectations for a specific piece of equipment, and re-run the estimate any time the category
      or purchase price changes.</p>
    `,
  },
  {
    title: 'QR-based location tracking, no hardware required',
    slug: 'qr-based-location-tracking',
    excerpt: 'Track equipment across warehouses, branches, and job sites using nothing but a phone camera.',
    authorName: 'TraceHub Team',
    publishedAt: new Date('2026-06-22'),
    isPublished: true,
    bodyHtml: `
      <p>We built TraceHub's tracking around a simple idea: most companies don't need RFID readers
      or GPS units to know where their equipment is \u2014 they need an easy way to record a scan.</p>
      <p>Every asset gets a unique QR code the moment it's registered. Define checkpoints for your
      warehouses, branches, or job sites, and any team member can scan an asset in or out using
      their phone's camera. Every scan is logged with a timestamp, so you get a full location
      history without buying a single piece of tracking hardware.</p>
    `,
  },
  {
    title: 'Now billing in USD, with Flutterwave under the hood',
    slug: 'usd-billing-flutterwave',
    excerpt: 'Subscription plans are now priced in US dollars, with payments processed through Flutterwave.',
    authorName: 'TraceHub Team',
    publishedAt: new Date('2026-07-30'),
    isPublished: true,
    bodyHtml: `
      <p>TraceHub's subscription tiers \u2014 Trial, Basic, Pro, and Enterprise \u2014 are now priced in USD
      across the board, with checkout and renewals handled through Flutterwave.</p>
      <p>Every plan includes the full depreciation engine, QR-based tracking, and reporting. Higher
      tiers add room for more assets and team members, plus features like API access, custom fields,
      and multi-location support.</p>
    `,
  },
];
