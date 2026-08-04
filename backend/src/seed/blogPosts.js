const englishPosts = [
  {
    title: 'Welcome to TraceHub Inventory',
    slug: 'welcome-to-tracehub-inventory',
    locale: 'en',
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
    locale: 'en',
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
  {
    title: 'Depreciation Doesn\u2019t Have to Be a Mystery: What Your Equipment Is Actually Worth Today',
    slug: 'understanding-asset-depreciation',
    locale: 'en',
    excerpt: 'A plain-language guide to what depreciation really measures, a full worked example, and the four mistakes that quietly distort the number at most companies.',
    authorName: 'TraceHub Team',
    publishedAt: new Date('2026-08-04'),
    isPublished: true,
    coverImageUrl: '/blog/depreciation-explained-cover.svg',
    bodyHtml: `
      <p>Ask a facilities manager what their five-year-old generator is worth, and you'll usually
      get one of two answers. Either a confident number that turns out to be the original purchase
      price with no adjustment at all, or an honest shrug. Neither is really their fault \u2014
      depreciation has a reputation as an accounting formality, something that lives in a
      spreadsheet nobody opens until the auditor asks for it. That reputation is wrong, and it's
      costing companies real money.</p>

      <p>This is a plain-language walkthrough of what depreciation actually is, why it deserves more
      attention than it usually gets, and how to think about it in a way that holds up when someone
      asks you to defend the number.</p>

      <h3>Why this isn't just an accounting exercise</h3>
      <p>Depreciation gets filed under "finance's problem," which undersells what it's actually
      useful for. A current, accurate book value feeds directly into decisions that have nothing to
      do with tax season:</p>
      <ul>
        <li><strong>Budgeting.</strong> If you don't know what your fleet is genuinely worth today,
        you can't forecast next year's replacement spend \u2014 you're guessing, and guesses tend to
        be optimistic.</li>
        <li><strong>Insurance.</strong> Claims and coverage levels are argued over actual cash
        value, not sentimental value or the number on a five-year-old invoice.</li>
        <li><strong>The repair-or-replace call.</strong> You genuinely cannot make that decision well
        without knowing current value \u2014 it's the other half of the comparison, alongside repair
        cost. We wrote a full framework for that decision
        <a href="/blog/repair-or-replace-decision-framework">here</a> if you haven't seen it.</li>
        <li><strong>Selling or trading in equipment.</strong> A defensible book value is your opening
        position in that negotiation, not an afterthought once a buyer asks.</li>
      </ul>
      <p>Treat depreciation as a live number that changes what you'd do today, and it stops being
      paperwork.</p>

      <h3>The idea in one sentence</h3>
      <p>Depreciation is not "how old is this thing." It's an estimate of how much of an asset's
      economic value has already been used up, based on the assumption that value declines
      predictably from a purchase price down to a residual (scrap) value over its useful life.</p>

      <p>The simplest version of that estimate \u2014 <strong>straight-line depreciation</strong> \u2014
      spreads that decline evenly across every year. Take a $12,000 generator with an 8-year useful
      life and a residual value of 10% ($1,200 once it's fully depreciated):</p>

      <div class="not-prose" style="background:#F4F7FA;border-radius:14px;padding:1.25rem 1.5rem;margin:1.5rem 0;font-family:ui-monospace,monospace;font-size:0.92rem;">
        <div style="display:flex;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid #E2E8F0;"><span style="color:#64748B;">Depreciable base</span><span>$12,000 \u2212 $1,200 = $10,800</span></div>
        <div style="display:flex;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid #E2E8F0;"><span style="color:#64748B;">Annual depreciation</span><span>$10,800 \u00f7 8 years = <strong>$1,350 / year</strong></span></div>
        <div style="display:flex;justify-content:space-between;padding:0.4rem 0;"><span style="color:#64748B;">Book value after 3 years</span><span style="color:#1A4D8F;font-weight:700;">$12,000 \u2212 ($1,350 \u00d7 3) = $7,950</span></div>
      </div>

      <p>That's it \u2014 the entire calculation. No spreadsheet macro required. If you want to try it
      on your own numbers right now rather than take our word for the arithmetic, the
      <a href="/docs/smart-depreciation-engine">Smart Depreciation Engine documentation</a> has a
      live calculator built directly into the page using this exact formula.</p>

      <h3>Where straight-line quietly stops being honest</h3>
      <p>Straight-line's assumption \u2014 identical wear every single year \u2014 is a reasonable
      starting point and a genuinely poor description of how most equipment actually ages. Two
      generators bought on the same day, same model, same price, can be worth very different
      amounts three years later depending on what actually happened to them:</p>

      <img src="/blog/depreciation-curves-diagram.svg" alt="Chart comparing straight-line depreciation against light-duty and heavy-duty actual usage curves" style="width:100%;border-radius:16px;margin:1.5rem 0;" />

      <p>A unit run lightly, serviced on schedule, kept somewhere dry and climate-controlled holds
      more value than the straight-line estimate predicts. A unit run hard, exposed to salt air or
      dust, with maintenance that slipped a few times \u2014 loses value faster than a straight line
      admits. Both are described identically by a spreadsheet that only knows "purchase price" and
      "years owned."</p>

      <p>This is exactly the gap TraceHub's <a href="/docs/ai-adaptive-depreciation-in-depth">AI
      Adaptive depreciation method</a> is built to close \u2014 it adjusts the depreciation rate using
      real usage intensity, maintenance history, environmental conditions, and (when you have it)
      current market value, rather than assuming every asset in a category ages identically. If
      you're curious about the full menu of options, including the time-based methods (straight-line,
      declining balance, double-declining, sum-of-years) and usage-based methods (units of
      production, machine hours, mileage), we've documented the math behind
      <a href="/docs/time-based-depreciation-methods">each time-based method</a> and
      <a href="/docs/usage-based-depreciation-methods">each usage-based method</a> in detail. There's
      also a genuinely useful option if none of the built-in methods fit your situation: you can
      <a href="/docs/writing-custom-depreciation-formulas">write your own depreciation formula</a>
      using your organization's own variables.</p>

      <h3>Four mistakes we see constantly</h3>
      <p>None of these are exotic \u2014 they're just easy to drift into once depreciation becomes a
      once-a-year chore instead of a live number.</p>
      <p><strong>1. Using the original purchase price forever.</strong> If an asset's real market
      value has moved meaningfully \u2014 up or down \u2014 and nobody updates the input, every
      downstream calculation quietly inherits a stale assumption.</p>
      <p><strong>2. Ignoring residual value entirely.</strong> Assuming an asset depreciates to zero
      overstates the loss and can distort a repair-versus-replace comparison in the wrong
      direction \u2014 most equipment is still worth something even fully depreciated on paper.</p>
      <p><strong>3. Treating "depreciated" and "worthless" as the same thing.</strong> A fully
      depreciated asset on the books can still be doing real, valuable work. Book value and
      operational value are related, not identical.</p>
      <p><strong>4. Only thinking about it once a year.</strong> By the time an annual review
      surfaces a problem asset, you've usually already absorbed months of a bad decision \u2014 a
      repair that shouldn't have been approved, a replacement that got delayed too long. A number
      that updates the moment new data arrives catches this while there's still time to act on it.</p>

      <h3>The bigger picture: depreciation feeds everything else</h3>
      <p>Book value isn't just a number that sits quietly in a report. In TraceHub, it's one of the
      seven inputs behind the <a href="/docs/disposal-intelligence-engine">Disposal Intelligence
      Engine's</a> Keep/Repair/Sell/Scrap/Replace recommendation, and it rolls up into your fleet's
      overall <a href="/docs/fleet-intelligence-formulas-explained">Capital at Risk</a> figure on the
      dashboard \u2014 the real dollar exposure sitting in equipment that's already in poor
      condition. Get the underlying number right, and everything built on top of it gets more
      trustworthy along with it.</p>

      <p>If you're currently estimating this once a year in a spreadsheet, or not at all, the first
      ten assets are free to register and track for thirty days \u2014 no card required. Depreciation
      calculates itself the moment you enter a purchase price.</p>
    `,
  },
];

const frenchPosts = require('./blogPosts.fr');
const spanishPosts = require('./blogPosts.es');

module.exports = [...englishPosts, ...frenchPosts, ...spanishPosts];