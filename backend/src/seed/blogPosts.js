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
  {
    title: 'The Right-to-Repair Wave Is Changing the Math on Repair vs. Replace',
    slug: 'right-to-repair-wave-2026',
    locale: 'en',
    excerpt: "Over thirty right-to-repair bills, a new Colorado law, and two federal bills are reshaping repair access in 2026 - here's what that actually means for the repair-or-replace decision.",
    authorName: 'TraceHub Team',
    publishedAt: new Date('2026-08-10T09:00:00Z'),
    isPublished: false,
    coverImageUrl: '/blog/right-to-repair-cover.svg',
    bodyHtml: `
      <p>If you manage physical equipment for a living, a quiet legislative shift happening across
      the United States in 2026 is worth your attention \u2014 not because of politics, but because it
      changes the actual arithmetic behind one of the decisions we write about most:
      <a href="/blog/repair-or-replace-decision-framework">repair or replace</a>.</p>

      <p>More than thirty right-to-repair bills were introduced across thirteen states in the first
      few weeks of this year alone. Colorado's right-to-repair law took effect in January, covering
      everything from HVAC systems to IT equipment. A federal bill, the REPAIR Act, has been
      advancing through committee for vehicles. A separate federal bill, the FARM Act, targets
      agricultural equipment specifically, after research suggested farmers lose billions of dollars
      annually to manufacturer repair restrictions. None of this is settled law everywhere yet, and
      coverage varies sharply by state and equipment category \u2014 but the direction is
      unmistakable.</p>

      <h3>What "right to repair" actually requires</h3>
      <p>Strip away the politics and the core of these laws is simple: manufacturers have to make
      parts, diagnostic tools, and repair documentation available to owners and independent repair
      shops, not just their own authorized network. A growing number of newer bills go further and
      explicitly ban "parts pairing" \u2014 software locks that refuse to recognize a replacement part
      unless it was purchased through the manufacturer, even when the part itself is functionally
      identical.</p>

      <p>If that sounds like a narrow consumer-electronics issue, the equipment categories already in
      scope or under active legislative discussion say otherwise: HVAC systems, powered wheelchairs,
      agricultural equipment, and vehicles over 14,000 lbs are all part of the current wave, not just
      phones and laptops.</p>

      <h3>Why this actually matters for the repair-vs-replace decision</h3>
      <p>Our own framework for that decision weighs repair cost against replacement cost, current
      condition, and how much of an asset's useful life is genuinely left. Two of those inputs move
      when repair access improves:</p>
      <ul>
        <li><strong>Repair cost tends to fall.</strong> When independent shops can access the same
        parts and documentation as an authorized dealer, competition on labor rates and parts pricing
        increases \u2014 the "we're the only ones who can fix this" premium shrinks.</li>
        <li><strong>Repair becomes viable later into an asset's life.</strong> A big driver of
        replacing equipment that's technically still repairable is that authorized service becomes
        slow, expensive, or simply unavailable as a model ages out of a manufacturer's support
        window. Independent repair access extends the window where repair is genuinely a live
        option, not just a theoretical one.</li>
      </ul>
      <p>Neither of these changes the physics of a worn-out asset \u2014 a generator with a cracked
      block is still a generator with a cracked block. But for the large middle category of
      equipment that's aging but not actually failing, better repair access can genuinely tip a
      close call from replace to repair.</p>

      <h3>What to actually do about it right now</h3>
      <p>You don't need to become a policy expert to benefit from this. Two practical steps are
      worth taking regardless of how the legislation in your specific state or country settles:</p>
      <p><strong>Revisit repair cost assumptions on equipment you wrote off as "too expensive to
      fix" in the past year or two.</strong> If that judgment was based on authorized-dealer-only
      pricing, it may be worth re-quoting against an independent shop now, particularly for HVAC,
      vehicles, and IT equipment where repair access is expanding fastest.</p>
      <p><strong>Keep your own repair and maintenance records current and complete</strong> \u2014
      the better your documented maintenance history, the stronger your position when negotiating
      with either an authorized dealer or an independent shop, and the more accurate your own
      <a href="/docs/disposal-intelligence-engine">disposal readiness scoring</a> stays regardless of
      who ends up doing the work. This is exactly the kind of thing a real, current
      <a href="/docs/the-audit-log">audit trail</a> is for \u2014 not compliance theater, but leverage
      you can actually use.</p>

      <p>Legislative momentum in this space has moved fast in 2026 and shows no sign of slowing.
      Whatever your position on the underlying policy debate, the practical asset-management
      takeaway is straightforward: repair is quietly becoming a stronger option than it's been in
      years, and the companies keeping clean records are the ones positioned to actually take
      advantage of that when a close call comes up.</p>
    `,
  },
  {
    title: 'AI Is Turning Asset Management From a Recording System Into a Decision-Making System',
    slug: 'ai-shift-recording-to-decision-making',
    locale: 'en',
    excerpt: 'The real industry shift in 2026 is reactive to predictive to prescriptive - and the honest questions worth asking any platform claiming to do this, including us.',
    authorName: 'TraceHub Team',
    publishedAt: new Date('2026-08-12T09:00:00Z'),
    isPublished: false,
    coverImageUrl: '/blog/ai-shift-cover.svg',
    bodyHtml: `
      <p>For most of the history of asset management software, a "system of record" is exactly what
      it sounds like: something that records what happened. An asset broke, someone logged it. A
      part got replaced, someone logged that too. The software's job was to remember things
      accurately, not to think about them.</p>

      <p>That's changing faster than most operations teams have had time to absorb. Across the
      enterprise asset management industry in 2026, the consistent theme \u2014 echoed by
      independent market analysts and platform vendors alike \u2014 is a shift from systems that
      record what already happened to systems that anticipate what's about to happen and recommend
      what to do about it. It's worth understanding what's actually driving that shift, and being
      honest about where the real substance is versus where it's still mostly a slide in a sales
      deck.</p>

      <h3>The real shift: reactive to predictive to prescriptive</h3>
      <p>There's a useful three-stage way to think about how maintenance has evolved:</p>
      <ul>
        <li><strong>Reactive.</strong> Something breaks, you fix it. No prediction involved.</li>
        <li><strong>Predictive.</strong> Sensor data and usage patterns are used to forecast that
        something is likely to fail before it does \u2014 giving you a window to act on your own
        schedule instead of the equipment's.</li>
        <li><strong>Prescriptive.</strong> The system doesn't just flag a likely failure, it
        recommends a specific action \u2014 repair, replace, adjust a maintenance interval \u2014
        based on the actual economics of that specific asset, not a generic rule of thumb.</li>
      </ul>
      <p>Industry adoption of predictive maintenance in some form is now genuinely mainstream rather
      than experimental \u2014 most manufacturers surveyed across recent industry reports say they're
      already applying some form of it. The more interesting frontier for 2026 is the move toward
      the prescriptive layer: not just "this will probably fail," but "here's what it will cost you
      to keep going versus stop now, specifically for this unit."</p>

      <h3>Where TraceHub sits in this shift, honestly</h3>
      <p>We'd rather be specific than claim a buzzword. TraceHub's
      <a href="/docs/failure-prediction-engine">Failure Prediction Engine</a> forecasts failure
      probability across four time horizons using real inputs \u2014 age relative to expected life,
      maintenance history, usage intensity \u2014 not a black box. The
      <a href="/docs/disposal-intelligence-engine">Disposal Intelligence Engine</a> is the
      prescriptive layer on top of that: a specific Keep, Repair, Sell, Scrap, or Replace
      recommendation with a plain-language reason attached, weighted most heavily on repair cost
      relative to current replacement cost rather than the original purchase price. And the
      <a href="/docs/ai-confidence-score-and-learning-loop">confidence scoring and learning
      loop</a> underneath both is deliberately conservative \u2014 it tells you honestly when a
      recommendation is backed by thin data, and it tracks whether ignoring past recommendations
      actually led to real failures for your specific fleet, not a generic industry benchmark.</p>

      <p>That last part matters more than it might sound. A lot of "AI-powered" positioning in this
      space amounts to a dashboard that looks sophisticated but can't tell you how confident to
      actually be in what it's showing you. A prediction without an honest confidence signal
      attached is just a guess wearing a lab coat.</p>

      <h3>What this means for how you should evaluate any platform, including ours</h3>
      <p>If you're looking at asset management or maintenance software in 2026, "has AI" has stopped
      being a meaningfully differentiating claim \u2014 nearly everyone says it now. The questions
      worth actually asking a vendor are more specific:</p>
      <ul>
        <li>What real inputs feed the prediction, and can you see them broken down per asset, or is
        it a single opaque score?</li>
        <li>Does the system tell you how confident to be, or does every recommendation sound equally
        certain regardless of how much data actually backs it?</li>
        <li>Does the economics behind a repair-or-replace recommendation use current replacement
        cost, or is it quietly still comparing against the original purchase price from years ago?</li>
      </ul>
      <p>The underlying shift toward prescriptive, decision-ready asset intelligence is real and
      still accelerating. The gap between that and marketing copy that merely mentions AI is where
      it's worth spending your evaluation time.</p>
    `,
  },
  {
    title: 'How to Run Your First Physical Asset Audit Without Losing a Week',
    slug: 'running-a-physical-asset-audit',
    locale: 'en',
    excerpt: "A physical asset audit doesn't have to mean frozen operations and a clipboard army. Here's how to actually run one, step by step.",
    authorName: 'TraceHub Team',
    publishedAt: new Date('2026-08-15T09:00:00Z'),
    isPublished: false,
    coverImageUrl: '/blog/audit-guide-cover.svg',
    bodyHtml: `
      <p>Every operations manager eventually gets the same request from someone above them: "when
      did we last actually verify that everything on our asset list still exists, is where we think
      it is, and is in the condition we think it's in?" If the honest answer is "not recently," you
      need an audit \u2014 and if the thought of running one makes you tired before you've started,
      you're picturing the wrong kind of audit.</p>

      <p>A physical asset audit doesn't have to be a week of frozen operations and a clipboard army.
      Here's how to actually run one without it consuming your month.</p>

      <h3>Step 1: Decide what "done" looks like before you start</h3>
      <p>The most common way audits balloon out of control is starting without a clear finish line.
      Before anyone picks up a scanner, decide exactly what you're trying to answer: Does every
      asset on the books still physically exist? Is each one where the system says it is? Is the
      recorded condition still accurate? You don't need to answer all three every time \u2014 a
      quarterly "does it exist and is it here" pass is far faster than a full condition review, and
      both are legitimate audits.</p>

      <h3>Step 2: Audit by location, not by asset list</h3>
      <p>Working through a spreadsheet top to bottom means constant backtracking between buildings
      and floors. Working through one physical <a href="/docs/setting-up-locations">location</a>
      at a time \u2014 scanning everything actually present, then reconciling against what the system
      expects to be there \u2014 means you touch each area exactly once. Two lists come out the other
      end: assets found but not expected (something moved without being logged), and assets expected
      but not found (something moved, or is genuinely gone).</p>

      <h3>Step 3: Let scanning do the reconciliation, not memory</h3>
      <p>This is the actual time sink in a manual audit: someone squinting at a printed list, trying
      to match serial numbers by eye, in a warehouse, from a clipboard. A phone camera scanning each
      asset's <a href="/docs/qr-codes-and-printing-tags">QR code</a> as you walk a location does the
      matching for you and updates location history the instant it happens \u2014 no separate
      reconciliation step needed afterward, no risk of a data-entry transcription error introducing
      a new mistake while you're busy fixing an old one.</p>

      <h3>Step 4: Investigate discrepancies in a batch, at the end</h3>
      <p>Don't stop the walk-through every time something doesn't match \u2014 you'll never finish a
      location. Note it, keep moving, and investigate the full discrepancy list once the physical
      walk is done. Most "missing" assets turn out to be sitting in a different location because an
      assignment or transfer never got scanned \u2014 checking recent
      <a href="/docs/assigning-assets-to-people">assignment history</a> for anything expected in that
      location usually resolves the majority of your list before you have to treat anything as
      genuinely lost.</p>

      <h3>Step 5: Fix the record, don't just note the problem</h3>
      <p>An audit that produces a list of discrepancies but doesn't actually correct anything is a
      report, not an audit. Update location for anything found somewhere unexpected. Mark anything
      genuinely unaccounted for and start whatever your organization's process is for a
      confirmed loss \u2014 don't leave it sitting in limbo on the books indefinitely, quietly
      distorting your fleet value and depreciation numbers for assets that no longer exist.</p>

      <h3>How often is "often enough"</h3>
      <p>There's no universal answer, but a reasonable default: a full walk-through per major
      location once a quarter, with high-value or highly mobile categories (vehicles, specialized
      tools that move between job sites) checked more frequently. The real signal that you're
      auditing too rarely isn't a calendar date \u2014 it's when an audit surfaces more than a small
      handful of genuine discrepancies per location. That's not a reason to audit less because it's
      annoying; it's a sign the gap between your records and reality has already gotten wider than
      you'd want it to, and the next audit should happen sooner, not later.</p>

      <p>The organizations that dread audits are almost always the ones still doing them with a
      printed list and a pen. The mechanics above work whether you're checking ten assets or ten
      thousand \u2014 the walk-through gets longer, but it never gets more complicated.</p>
    `,
  },
  {
    title: 'Multi-Location Operations: What Changes When Your Equipment Lives in Five Different Places',
    slug: 'multi-location-operations',
    locale: 'en',
    excerpt: "What used to be common knowledge at a single site becomes nobody's specific responsibility the moment a second location exists. Here's what to fix before it becomes a real problem.",
    authorName: 'TraceHub Team',
    publishedAt: new Date('2026-08-17T09:00:00Z'),
    isPublished: false,
    coverImageUrl: '/blog/multi-location-cover.svg',
    bodyHtml: `
      <p>Something breaks the first time a company opens a second location: not the equipment
      itself, but the shared understanding of where everything is. When there was one building,
      "the drill press is by the loading dock" was a complete sentence. Once there are three
      buildings, it isn't \u2014 and the informal systems that worked fine for one site quietly stop
      working the moment a second one exists.</p>

      <p>Here's what actually changes operationally when equipment lives in more than one place, and
      what to put in place before it becomes a real problem rather than after.</p>

      <h3>"Where is it" stops being a shared assumption</h3>
      <p>At a single site, everyone roughly knows where the good ladder is, even without a system
      telling them. Across multiple sites, that shared mental map disappears \u2014 nobody at
      Location B has any intuition about what's sitting at Location A. The fix isn't asking people to
      remember more; it's giving every piece of equipment a real, current
      <a href="/docs/setting-up-locations">location record</a> that updates the moment something
      actually moves, so "where is it" has one authoritative answer instead of three different
      guesses from three different people.</p>

      <h3>Transfers between locations need to be a real, logged event</h3>
      <p>The single most common way multi-location asset records drift from reality: someone
      borrows a piece of equipment from another site "just for a week" with a verbal agreement and
      no system record. Six months later nobody remembers which site actually has it, and it shows
      up as a discrepancy in whichever location's next audit catches it first. Treating a transfer
      between locations as a real scan-based event \u2014 checked out from where it's leaving,
      checked in at where it's arriving \u2014 costs about ten seconds more than a verbal handoff and
      eliminates this specific failure mode almost entirely.</p>

      <h3>Depreciation and maintenance costs should roll up by location, not just company-wide</h3>
      <p>A single combined number across every site can hide a real problem: one location's
      equipment might be depreciating and breaking down far faster than the rest of the fleet,
      whether from harsher conditions, heavier use, or maintenance that's quietly slipping at that
      specific site. That pattern is invisible in a company-wide average and obvious the moment you
      can filter reporting by location \u2014 which is exactly why per-location visibility matters
      more, not less, as you add sites.</p>

      <h3>Permissions need to match how responsibility is actually distributed</h3>
      <p>A ten-person single-site operation can reasonably have everyone see everything. Across
      multiple locations with different site managers, that stops being appropriate \u2014 a manager
      at one site generally shouldn't need to (or want to) wade through another site's equipment to
      find their own. <a href="/docs/roles-and-permissions">Role-based access</a> that scales with
      the organization rather than against it means each site's team sees what's actually relevant
      to them without a company-wide free-for-all or, at the other extreme, everything routed
      through one overwhelmed central administrator.</p>

      <h3>The pattern underneath all four of these</h3>
      <p>Every one of these problems has the same root cause: something that used to be common
      knowledge at a single site becomes nobody's specific responsibility once there's more than
      one. The fix in each case isn't more discipline or better memory \u2014 it's making the record
      update itself as part of doing the work (scanning a transfer, filtering a report by site)
      rather than depending on someone remembering to write it down separately afterward.</p>

      <p>None of this requires a different system for each additional location \u2014 it requires the
      first system to have been built assuming more than one location would eventually exist. If
      you're about to open a second site and you're currently tracking equipment in a way that
      quietly assumes there's only ever going to be one, that assumption is worth revisiting before
      the opening, not six months after.</p>
    `,
  },
];

const frenchPosts = require('./blogPosts.fr');
const spanishPosts = require('./blogPosts.es');

module.exports = [...englishPosts, ...frenchPosts, ...spanishPosts];