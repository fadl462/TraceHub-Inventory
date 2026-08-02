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
    title: 'Repair or Replace? A Practical Framework for the Decision Every Asset Manager Eventually Faces',
    slug: 'repair-or-replace-decision-framework',
    excerpt: 'Most "repair or replace" calls are made on gut feel and whoever shouts loudest in the meeting. Here\u2019s a framework that replaces the guesswork with numbers you can actually defend.',
    authorName: 'TraceHub Team',
    publishedAt: new Date('2026-08-02'),
    isPublished: true,
    coverImageUrl: '/blog/repair-replace-cover.svg',
    bodyHtml: `
      <p>Somewhere in every organization with physical equipment, there's a generator, a forklift, or
      a fleet vehicle sitting in a repair queue right now while someone decides whether it's worth
      fixing again. The decision usually gets made one of three ways: whoever's loudest in the
      meeting wins, the maintenance team fixes it because that's their job and nobody told them not
      to, or it gets punted another quarter because nobody wants to own the capital expense. None of
      those are actually a decision \u2014 they're a default.</p>

      <p>This is a genuinely hard problem to reason about by gut feel, because the real answer
      depends on combining numbers that live in different departments and rarely end up in the same
      spreadsheet: what the asset is actually worth today, how much it's cost you in repairs so far,
      how likely it is to fail again soon, and what a replacement would cost. This post walks through
      a framework for combining those numbers properly \u2014 the same one we ended up building directly
      into TraceHub's Disposal Intelligence Engine, because we kept doing this calculation by hand
      for our own equipment and got tired of rebuilding the spreadsheet every time.</p>

      <h3>Why "it still runs" is the wrong question</h3>
      <p>The instinct with aging equipment is to ask "does it still work?" and keep repairing as long
      as the answer is yes. That's the wrong question, for a simple reason: almost anything can be
      kept running with enough money and enough downtime. The right question is whether continuing
      to repair it is a good use of money compared to the alternative \u2014 and that requires comparing
      real numbers, not vibes.</p>

      <p>There are five inputs that actually matter, and gut-feel decisions typically only weigh one
      or two of them:</p>

      <p><strong>1. Age relative to expected useful life.</strong> A five-year-old forklift with a
      seven-year expected life is in a very different position than the same forklift at year nine.
      This sounds obvious, but it's frequently ignored in practice \u2014 maintenance teams often don't
      have easy access to what "expected life" even is for a given asset category, so the number
      never enters the conversation.</p>

      <p><strong>2. Cumulative maintenance and repair spend, measured against replacement cost \u2014 not
      against the original purchase price.</strong> This is the single most common mistake we see.
      An asset bought for $8,000 five years ago might cost $12,000 to replace today after inflation
      and currency movement. If you've already spent $6,000 keeping the old one running, comparing
      that $6,000 to the original $8,000 price tag makes it look almost break-even. Comparing it to
      the real $12,000 replacement cost tells a very different story: you're halfway to a brand-new
      unit's price, on a machine that's already old.</p>

      <p><strong>3. Repair frequency, not just repair cost.</strong> A machine that's needed three
      repairs in the last six months is telling you something a total-dollars figure doesn't
      capture: it's entering a failure pattern, not absorbing one-off bad luck. Frequency is a
      leading indicator; cumulative cost is a lagging one. By the time the lagging indicator looks
      bad, you've usually already had the leading one flashing for a while.</p>

      <p><strong>4. Current health and condition</strong> \u2014 not just age and repair history, but
      an actual assessment of the equipment's present state: inspection scores, technician
      ratings, operating environment (a generator running in a dusty, high-corrosion coastal site
      wears faster than an identical unit in a climate-controlled warehouse, regardless of age).</p>

      <p><strong>5. How critical the asset is to operations.</strong> A backup generator that's rarely
      used tolerates a slower repair-vs-replace decision than the single delivery vehicle a small
      logistics operation depends on daily. Criticality doesn't change the math on cost, but it
      changes how much repair-cycle risk you can tolerate while the decision gets made.</p>

      <h3>A worked example</h3>
      <p>Take a mid-sized pickup truck used for field deliveries, purchased four years ago for
      $28,000, with a typical useful life of 8 years for that vehicle class. Over the past year it's
      needed three unscheduled repairs totalling $4,200. Today's replacement cost for an equivalent
      new vehicle is $34,000 (prices for that class have risen since the original purchase). Its
      current book value, after four years of depreciation, sits around $14,000.</p>

      <p>Run the five factors: it's at 50% of its expected life (not yet a strong signal on its own),
      but $4,200 in repairs in a single year against a $34,000 replacement cost is 12% of replacement
      value spent in twelve months \u2014 a meaningful number on its own, and a concerning trend if it
      repeats. Three repairs in six months is a frequency pattern, not a one-off. If a recent
      inspection also flagged declining condition, that's four of the five factors pointing the same
      direction. The conclusion isn't "it still runs, so keep going" \u2014 it's "the pattern says this
      is the year to plan the replacement, not wait for a roadside failure to force the decision."</p>

      <p>Notice what made this possible: not a single dramatic red flag, but several moderate signals
      converging. That's exactly the kind of pattern gut-feel decisions miss, because no one number
      looks alarming enough to raise on its own.</p>

      <h3>Turning this into a repeatable score, not a one-off analysis</h3>
      <img src="/blog/disposal-score-breakdown.svg" alt="Pie chart breakdown of the Disposal Readiness Score: Age 25%, Maintenance cost 20%, Depreciation 15%, Repair frequency 15%, Health 10%, Market value 10%, Criticality 5%" style="width:100%;border-radius:16px;margin:1.5rem 0;background:#fff;" />
      <p>The framework above works fine as a one-time exercise for a single asset. It breaks down at
      scale \u2014 nobody re-runs a five-factor manual analysis every time an asset needs a repair
      across a fleet of 200 vehicles and machines. That's the actual reason we built TraceHub's
      Disposal Intelligence Engine as a standing score rather than a report you generate on demand:
      every asset gets a live Disposal Readiness Score (0\u2013100), recalculated automatically as new
      maintenance records, repairs, and inspections come in, weighted across age (25%), depreciation
      (15%), maintenance cost relative to replacement value (20%), repair frequency (15%), health
      score (10%), current market value (10%), and business criticality (5%).</p>

      <p>The weights aren't arbitrary \u2014 they reflect that maintenance cost relative to replacement
      value and age are the two heaviest signals in practice, with repair frequency close behind,
      which matches what the worked example above actually showed. When the score crosses a
      threshold, the system doesn't just flag the asset \u2014 it recommends a specific action (repair,
      sell, or scrap) and a realistic timeframe, and the executive summary is written in plain
      language rather than a raw score: "Repair cost exceeds expected operational benefit; replace
      within 3 months" is a sentence a non-technical manager can act on immediately.</p>

      <h3>The part most frameworks skip: did the recommendation actually hold up?</h3>
      <p>Every scoring model eventually gets ignored sometimes \u2014 a manager decides to keep repairing
      an asset the system flagged, for reasons that might be perfectly good (cash flow timing, a
      planned fleet refresh next quarter, a vehicle that's genuinely still reliable despite the
      numbers). That's a legitimate business decision, not a system failure. But it's worth actually
      tracking what happens next: did the asset go on to fail shortly after the recommendation was
      ignored, or did it keep running fine for another year?</p>

      <p>We built this feedback loop directly into TraceHub rather than leaving it as an unanswered
      question: every time a disposal recommendation is rejected, the system quietly notes the
      asset's incident count at that moment, and checks back later to see whether a real failure
      followed. Over time, that builds an honest, company-specific answer to "how reliable are these
      recommendations for us, specifically" \u2014 not a marketing claim about AI accuracy, but a real,
      auditable number derived from what actually happened after past decisions, which then feeds
      back into how much weight future recommendations get.</p>

      <h3>The takeaway</h3>
      <p>You don't need a sophisticated system to make better repair-vs-replace decisions \u2014 you need
      to consistently look at replacement cost (not original price), repair frequency (not just
      total spend), and current condition together, instead of defaulting to "it still runs." The
      system just makes that consistent and automatic instead of something someone has to remember
      to do properly every time, for every asset, across an entire fleet.</p>
    `,
  },
];
