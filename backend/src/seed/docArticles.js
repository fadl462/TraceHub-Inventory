/**
 * Full documentation content for TraceHub Inventory - genuinely comprehensive,
 * organized into categories matching the docs portal's sidebar. Every
 * article describes real, built functionality (cross-checked against the
 * actual codebase, not aspirational copy).
 */

// ===================== GETTING STARTED =====================
const gettingStarted = [
  {
    title: 'What is TraceHub Inventory?',
    slug: 'what-is-tracehub-inventory',
    category: 'Getting Started', categorySortOrder: 0, sortOrder: 0,
    excerpt: 'A quick tour of what TraceHub does and who it\u2019s for.',
    bodyHtml: `
      <p>TraceHub Inventory is a multi-tenant asset and inventory management platform built for
      organizations that own physical equipment \u2014 laptops, vehicles, generators, tools, furniture,
      anything with a purchase price and a useful life \u2014 and need to know where it is, what it's
      worth, who has it, and when it needs attention.</p>

      <p>What sets it apart from a spreadsheet or a basic asset register is the
      <strong>Asset Intelligence Engine</strong>: six real, deterministic scoring engines that run
      continuously in the background on every asset you register, computing depreciation, a health
      score, failure risk, a maintenance schedule, and a disposal recommendation \u2014 all without
      you doing anything beyond entering the data once.</p>

      <h3>Who it's for</h3>
      <ul>
        <li><strong>Operations teams</strong> tracking equipment across warehouses, branches, or job sites.</li>
        <li><strong>Finance teams</strong> who need accurate, automatic depreciation instead of a
        manually-maintained spreadsheet.</li>
        <li><strong>IT/asset managers</strong> deciding, asset by asset, whether to repair or replace.</li>
        <li><strong>Executives</strong> who want a portfolio-level view \u2014 fleet health, capital at
        risk, projected savings \u2014 without digging into individual records.</li>
      </ul>

      <h3>How it's organized</h3>
      <p>Everything in TraceHub is scoped to your company's workspace. Within that workspace:</p>
      <ul>
        <li><strong>Assets</strong> are the individual pieces of equipment you register.</li>
        <li><strong>Locations</strong> are checkpoints (a warehouse, a branch) that assets get scanned into and out of.</li>
        <li><strong>Assignments</strong> track which staff member or outside contact currently has an asset.</li>
        <li><strong>Disposal cases</strong> follow a formal six-stage approval workflow when an asset's
        time is up.</li>
        <li><strong>Team</strong> is where you invite colleagues and set their role (Company Admin,
        Manager, or Staff).</li>
      </ul>

      <p>Every one of those areas has the Intelligence Engine feeding into it \u2014 you'll see health
      scores on the Assets list, a Fleet Intelligence panel on the Dashboard, and disposal
      recommendations driving the Disposal workflow.</p>
    `,
  },
  {
    title: 'Creating your workspace',
    slug: 'creating-your-workspace',
    category: 'Getting Started', categorySortOrder: 0, sortOrder: 1,
    excerpt: 'Signing up, your free trial, and what happens on day one.',
    bodyHtml: `
      <p>Click <strong>"Get started free"</strong> on the homepage to create your workspace. You'll
      provide your name, email, a password, and your company's name \u2014 that's it. There's no card
      required, and you're automatically the first <strong>Company Admin</strong> for your new
      workspace.</p>

      <h3>Your trial</h3>
      <p>Every new workspace starts on a 30-day trial with a 10-asset limit. You can register up to
      10 assets and use every feature at full depth \u2014 the Intelligence Engine, scanning,
      assignments, disposal workflow, reports \u2014 none of it is gated during the trial. When you're
      ready to add more than 10 assets or need more team seats, upgrade from
      <strong>Billing</strong> to a paid plan (Basic, Pro, or Enterprise).</p>

      <h3>What to do first</h3>
      <ol>
        <li>Go to <strong>Assets \u2192 Add asset</strong> and register your first piece of equipment.
        Enter a purchase price and category and the depreciation engine immediately estimates its
        current value, useful life, and scrap value.</li>
        <li>Go to <strong>Locations</strong> and add your first checkpoint (a warehouse, an office) \u2014
        this is what your team will scan assets into.</li>
        <li>Go to <strong>Team</strong> and invite your first colleague if you're not working solo.</li>
      </ol>

      <p>See the <a href="/pages/documentation">Quick-start checklist</a> for the fastest path from
      zero to a fully set-up workspace.</p>
    `,
  },
  {
    title: 'Quick-start checklist',
    slug: 'quick-start-checklist',
    category: 'Getting Started', categorySortOrder: 0, sortOrder: 2,
    excerpt: 'The fastest path from signing up to a fully working workspace.',
    bodyHtml: `
      <p>If you'd rather move fast than read every article first, here's the shortest real path to
      a working setup.</p>

      <h3>1. Set up your categories and locations (5 minutes)</h3>
      <p>Check <strong>Assets \u2192 Categories</strong> for the default categories (Laptops &amp;
      Computers, Vehicles, Office Furniture, and so on) and adjust the useful-life/scrap-value
      profile for each if your equipment ages differently than the defaults assume. Then add your
      real checkpoints under <strong>Locations</strong> \u2014 a warehouse, each branch, each job site.</p>

      <h3>2. Register your real assets (however long your list is)</h3>
      <p>For each asset: name, category, purchase price, purchase date. That's the minimum for the
      depreciation engine to work. If you want richer health/failure scoring immediately, also open
      the "Asset Intelligence Engine data" section on the form and fill in usage intensity,
      maintenance history, and environment \u2014 the more you provide, the more confident the AI's
      scores are from day one.</p>

      <h3>3. Print or display your QR codes</h3>
      <p>Every asset gets a QR code the moment it's created \u2014 open the asset and click
      <strong>Download QR</strong>. Print it onto a label or just display it on a screen near the
      equipment for now.</p>

      <h3>4. Invite your team</h3>
      <p>Go to <strong>Team \u2192 Add team member</strong>. Each invited person gets a temporary
      password by email and is required to set their own password (with an optional 2FA setup)
      before they can access anything else.</p>

      <h3>5. Do one real scan</h3>
      <p>From <strong>Scan</strong>, use your phone's camera to scan one asset's QR code and check
      it into a location. This confirms your whole pipeline \u2014 QR generation, scanning, location
      tracking \u2014 works end to end.</p>

      <p>That's it \u2014 everything else (assignments, disposal workflow, reports) builds on this same
      foundation and you can pick it up as you need it.</p>
    `,
  },
  {
    title: 'Roles and permissions',
    slug: 'roles-and-permissions',
    category: 'Getting Started', categorySortOrder: 0, sortOrder: 3,
    excerpt: 'What Company Admin, Manager, and Staff can each do.',
    bodyHtml: `
      <p>Every person in your workspace has one of three roles. There's no custom/granular
      permission system beyond these three \u2014 they're designed to map cleanly onto how most
      operations teams are actually structured.</p>

      <table style="width:100%;border-collapse:collapse;margin:1rem 0;">
        <thead><tr style="text-align:left;border-bottom:2px solid #E2E8F0;">
          <th style="padding:0.5rem;">Role</th><th style="padding:0.5rem;">Can do</th>
        </tr></thead>
        <tbody>
          <tr style="border-bottom:1px solid #EDF2F7;">
            <td style="padding:0.5rem;vertical-align:top;"><strong>Company Admin</strong></td>
            <td style="padding:0.5rem;">Everything \u2014 including billing, inviting/removing team
            members, and final approval in the disposal workflow. The person who signs up first is
            automatically a Company Admin; you can have more than one.</td>
          </tr>
          <tr style="border-bottom:1px solid #EDF2F7;">
            <td style="padding:0.5rem;vertical-align:top;"><strong>Manager</strong></td>
            <td style="padding:0.5rem;">Assets, assignments, the disposal workflow (manager-review
            stage), locations, and reports. Cannot access Billing or Team management.</td>
          </tr>
          <tr>
            <td style="padding:0.5rem;vertical-align:top;"><strong>Staff</strong></td>
            <td style="padding:0.5rem;">Day-to-day operational access: register and scan assets,
            view and create assignments. Cannot approve disposals, manage the team, or see billing.</td>
          </tr>
        </tbody>
      </table>

      <p>Roles are set when you invite someone from <strong>Team \u2192 Add team member</strong>, and
      a Company Admin can change anyone's role later from the same page.</p>
    `,
  },
];

// ===================== MANAGING ASSETS =====================
const managingAssets = [
  {
    title: 'Registering an asset',
    slug: 'registering-an-asset',
    category: 'Managing Assets', categorySortOrder: 1, sortOrder: 0,
    excerpt: 'Every field on the Add Asset form, and what each one actually affects.',
    bodyHtml: `
      <p>Go to <strong>Assets \u2192 Add asset</strong>. Only <strong>Asset name</strong> is required
      \u2014 everything else is optional, but the more you fill in, the more the Intelligence Engine
      can do with it.</p>

      <h3>Core fields</h3>
      <ul>
        <li><strong>Category</strong> \u2014 determines the default useful-life and scrap-value
        assumptions used for depreciation. You can override these per-asset if needed.</li>
        <li><strong>Condition</strong> \u2014 a simple starting condition (Excellent/Good/Fair/Poor),
        distinct from the AI-computed Health Score, which updates over time as real data comes in.</li>
        <li><strong>Brand, Model, Color, Serial number</strong> \u2014 identifying details. Color is a
        searchable field populated from a real, comprehensive color list \u2014 start typing and pick
        from suggestions, or type a color that isn't listed.</li>
        <li><strong>Manufacture year / Purchase date / Purchase price</strong> \u2014 purchase date and
        price are what the depreciation engine actually calculates from; manufacture year is used as
        a fallback age reference if purchase date is missing.</li>
        <li><strong>Current location</strong> \u2014 which checkpoint the asset starts at. Can be
        updated later via scanning.</li>
      </ul>

      <h3>Purchase price and currency</h3>
      <p>Purchase price is always stored in USD. If you paid in a different currency, use the
      currency conversion helper directly below the price field: pick the currency, enter the local
      amount, either fetch a live exchange rate or type one in yourself, and it computes the USD
      equivalent for you.</p>

      <h3>Asset Intelligence Engine data (optional, but valuable)</h3>
      <p>Click to expand this collapsible section for fields that directly feed the Health Score,
      Failure Prediction, and Disposal engines: operational history (hours used, maintenance count,
      repair count, failure count, latest inspection score), usage intensity, financial details
      (current market value, replacement cost), and environmental/condition factors (corrosion risk,
      dust exposure, operating environment). None of this is required to register an asset, but an
      asset with zero data here will have a lower AI Confidence Score simply because there's less
      for the engine to work with \u2014 see <a href="/pages/documentation">AI Confidence Score</a>.</p>
    `,
  },
  {
    title: 'Categories and custom fields',
    slug: 'categories-and-custom-fields',
    category: 'Managing Assets', categorySortOrder: 1, sortOrder: 1,
    excerpt: 'How categories drive depreciation, and adding your own fields.',
    bodyHtml: `
      <p>Every asset belongs to a category (Laptops &amp; Computers, Vehicles, Generators, Office
      Furniture, and so on). Categories aren't just labels \u2014 each one carries a
      <strong>depreciation profile</strong>: an assumed useful life in years and a scrap value
      percentage, used automatically whenever you register an asset in that category without
      manually overriding those numbers.</p>

      <p>You can adjust a category's profile from <strong>Assets \u2192 Categories</strong> if your
      real equipment ages faster or slower than the default assumption \u2014 for example, if your
      vehicles are used in a harsh environment and genuinely have a shorter useful life than the
      default 8 years, lower it there rather than manually correcting every individual vehicle.</p>

      <h3>Custom fields</h3>
      <p>If your organization tracks something specific to your equipment that isn't already a
      built-in field \u2014 a project code, an internal barcode format, a compliance certificate
      number \u2014 a Company Admin can add a custom field from Settings. Custom fields appear on the
      Add Asset form automatically and are stored per-asset.</p>
    `,
  },
  {
    title: 'Understanding asset status',
    slug: 'understanding-asset-status',
    category: 'Managing Assets', categorySortOrder: 1, sortOrder: 2,
    excerpt: 'Available, Assigned, In maintenance, Reserved, Disposed, Lost.',
    bodyHtml: `
      <p>Every asset has a status, shown on the Assets list and Asset Detail page:</p>
      <ul>
        <li><strong>Available</strong> \u2014 not currently assigned to anyone, sitting at its
        current location.</li>
        <li><strong>Assigned</strong> \u2014 set automatically when you create an active assignment
        for this asset, and cleared automatically when it's marked returned.</li>
        <li><strong>In maintenance</strong> \u2014 set manually when an asset is pulled out of service
        for repair.</li>
        <li><strong>Reserved</strong> \u2014 held for a specific upcoming use without being formally
        assigned yet.</li>
        <li><strong>Disposed</strong> \u2014 set automatically when a disposal case for this asset
        reaches the final "Disposed" stage.</li>
        <li><strong>Lost</strong> \u2014 set manually if an asset genuinely can't be located.</li>
      </ul>
      <p>Status feeds directly into the Dashboard's Asset Availability metric (the % of your fleet
      currently Available) and the Fleet Intelligence panel's portfolio-level view.</p>
    `,
  },
  {
    title: 'QR codes and printing tags',
    slug: 'qr-codes-and-printing-tags',
    category: 'Managing Assets', categorySortOrder: 1, sortOrder: 3,
    excerpt: 'How the QR code is generated, and the actual URL it encodes.',
    bodyHtml: `
      <p>The moment an asset is registered, TraceHub generates a unique QR code for it \u2014 visible
      on the Asset Detail page with a <strong>Download QR</strong> button. Print this onto a label
      and attach it to the physical asset, or display it on a screen nearby if a physical label
      isn't practical yet.</p>

      <h3>What the code actually encodes</h3>
      <p>The QR code is a real URL (<code>yourapp.com/scan/&#123;token&#125;</code>), not a proprietary
      format \u2014 which means it works with an ordinary phone camera app, not just TraceHub's own
      scanner. Scanning it with any camera app opens that URL directly: if you're not logged in, it
      takes you to log in first and then continues automatically to the right place; if you're
      already logged in, it goes straight to the in-app scanner with that asset pre-loaded.</p>

      <h3>Using the in-app scanner instead</h3>
      <p>From <strong>Scan</strong> inside the app, you can use a live camera-based scanner (works on
      phone or laptop with a webcam) to scan any asset's code directly, or manually type/paste a
      token if a camera isn't available. See
      <a href="/pages/documentation">Scanning assets</a> for the full check-in/check-out flow.</p>
    `,
  },
  {
    title: 'Archiving and deleting assets',
    slug: 'archiving-and-deleting-assets',
    category: 'Managing Assets', categorySortOrder: 1, sortOrder: 4,
    excerpt: 'The difference between archiving and permanent deletion.',
    bodyHtml: `
      <p>From an Asset Detail page, Company Admins and Managers can <strong>archive</strong> an
      asset \u2014 this removes it from the active Assets list and all dashboard counts, but keeps its
      full history (inspections, assignments, location scans, disposal records) intact and
      restorable. Archiving is the right move for equipment you no longer track day-to-day but want
      to keep records for.</p>
      <p>Permanent deletion isn't offered as a routine action \u2014 asset history is valuable for
      audit and depreciation records, and archiving covers the "I don't need to see this anymore"
      use case without losing anything.</p>
    `,
  },
];

// ===================== THE ASSET INTELLIGENCE ENGINE =====================
const intelligenceEngine = [
  {
    title: 'Overview of the six engines',
    slug: 'ai-engine-overview',
    category: 'The Asset Intelligence Engine', categorySortOrder: 2, sortOrder: 0,
    excerpt: 'What runs automatically on every asset, and how the pieces fit together.',
    bodyHtml: `
      <p>The Asset Intelligence Engine (sometimes called TAIE internally) is six real, deterministic
      scoring engines that recalculate automatically whenever an asset is created, updated, or
      inspected. "Deterministic" matters here: these are documented weighted formulas, not a
      trained machine-learning model producing an unexplainable number \u2014 every score can be
      traced back to the real inputs that produced it.</p>

      <ol>
        <li><strong>Smart Depreciation Engine</strong> \u2014 nine methods, from straight-line to a
        custom formula you write yourself.</li>
        <li><strong>Asset Health Score (0-100)</strong> \u2014 a weighted composite across age,
        maintenance, repairs, usage, inspection, and environment.</li>
        <li><strong>Failure Prediction Engine</strong> \u2014 probability of failure at 30/60/90/180 days.</li>
        <li><strong>Maintenance Scheduling Engine</strong> \u2014 a real predicted next-service date.</li>
        <li><strong>Disposal Intelligence Engine</strong> \u2014 a KEEP/REPAIR/SELL/SCRAP/REPLACE
        recommendation with a plain-language executive summary.</li>
        <li><strong>AI Confidence Score</strong> \u2014 how much real evidence backs up everything
        above, for this specific asset.</li>
      </ol>

      <p>On top of these, an <strong>AI Learning Loop</strong> tracks whether ignoring a disposal
      recommendation was later followed by a real failure, and feeds that back into future
      confidence scores \u2014 specific to your company's own history, not a generic industry figure.</p>

      <p>Every one of these scores is visible in three places: on the <strong>Asset Detail</strong>
      page (full breakdown, per asset), on the <strong>Assets list</strong> (Health/Failure
      Risk/Recommendation columns, so you can scan your whole fleet at once), and aggregated on the
      <strong>Dashboard's Fleet Intelligence panel</strong> (portfolio-level: average health,
      capital at risk, an A-F fleet grade).</p>
    `,
  },
  {
    title: 'Smart Depreciation Engine',
    slug: 'smart-depreciation-engine',
    category: 'The Asset Intelligence Engine', categorySortOrder: 2, sortOrder: 1,
    excerpt: 'All nine methods, including how to write your own custom formula.',
    bodyHtml: `
      <p>Set an asset's depreciation method in the "Asset Intelligence Engine data" section of the
      Add/Edit Asset form. If you don't choose one, <strong>Straight Line</strong> is used by
      default.</p>

      <table style="width:100%;border-collapse:collapse;margin:1rem 0;font-size:0.9rem;">
        <thead><tr style="text-align:left;border-bottom:2px solid #E2E8F0;">
          <th style="padding:0.5rem;">Method</th><th style="padding:0.5rem;">How it works</th>
        </tr></thead>
        <tbody>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Straight Line</strong></td><td style="padding:0.5rem;">Equal depreciation each year across the useful life.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Reducing Balance</strong></td><td style="padding:0.5rem;">A fixed percentage of the remaining book value each year \u2014 faster depreciation early on.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Double Declining Balance</strong></td><td style="padding:0.5rem;">An accelerated version of reducing balance, common for equipment that loses most value in its first few years.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Sum of Years' Digits</strong></td><td style="padding:0.5rem;">Another accelerated method, weighting early years more heavily using a digit-sum formula.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Units of Production</strong></td><td style="padding:0.5rem;">Depreciates based on actual usage (units produced) rather than time \u2014 set the asset's expected total capacity.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Machine Hours</strong></td><td style="padding:0.5rem;">Same idea, based on operating hours instead of units.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Mileage Based</strong></td><td style="padding:0.5rem;">For vehicles \u2014 depreciates against odometer mileage against expected total mileage.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>AI Adaptive</strong></td><td style="padding:0.5rem;">A multiplicative model combining usage intensity, maintenance history, environment, market conditions, and reliability into one adjusted depreciation rate \u2014 the most data-hungry method, and the most responsive to an asset's real condition rather than just its age.</td></tr>
          <tr><td style="padding:0.5rem;"><strong>Custom Formula</strong></td><td style="padding:0.5rem;">Write your own arithmetic expression \u2014 see below.</td></tr>
        </tbody>
      </table>

      <h3>Writing a custom formula</h3>
      <p>Basic arithmetic only (<code>+ - * / ^</code> and parentheses, no functions). Available
      variables: <code>cost, residual, lifeYears, age, hoursUsed, mileage, operatingCycles,
      repairCount, maintenanceCount, maintenanceCostTotal, repairCostTotal</code>.</p>
      <p><strong>Example:</strong> <code>cost - (repairCount * 25) - (age * 100)</code> \u2014 starts
      at full cost, subtracts $25 per repair and $100 per year of age. An invalid formula safely
      falls back to straight-line rather than breaking the asset's record.</p>
    `,
  },
  {
    title: 'Asset Health Score',
    slug: 'asset-health-score',
    category: 'The Asset Intelligence Engine', categorySortOrder: 2, sortOrder: 2,
    excerpt: 'The exact weights behind the 0-100 score, and what each tier means.',
    bodyHtml: `
      <p>Every asset gets a Health Score from 0-100, recalculated automatically as new data comes
      in. It's a weighted composite of six factors:</p>
      <ul>
        <li><strong>Age</strong> relative to expected useful life \u2014 20%</li>
        <li><strong>Maintenance</strong> compliance and history \u2014 25%</li>
        <li><strong>Repairs</strong> (frequency and cost) \u2014 15%</li>
        <li><strong>Usage</strong> intensity \u2014 15%</li>
        <li><strong>Inspection</strong> score (most recent) \u2014 15%</li>
        <li><strong>Environment</strong> (corrosion risk, dust exposure, operating conditions) \u2014 10%</li>
      </ul>

      <h3>Tier bands</h3>
      <p>The same five bands are used consistently everywhere in the app \u2014 the Assets list, the
      Dashboard's Executive Heat Map, and the score itself:</p>
      <ul>
        <li><strong>Excellent</strong> \u2014 90-100</li>
        <li><strong>Healthy</strong> \u2014 75-89</li>
        <li><strong>Needs Attention</strong> \u2014 60-74</li>
        <li><strong>High Risk</strong> \u2014 40-59</li>
        <li><strong>Critical</strong> \u2014 below 40</li>
      </ul>

      <p>On the Asset Detail page, you'll see the full breakdown \u2014 not just the final number \u2014
      as a set of individual score bars for each of the six factors, so you can see exactly what's
      dragging a score down (for example, an asset with excellent maintenance but poor age-adjusted
      standing will show that clearly rather than hiding it behind one composite number).</p>
    `,
  },
  {
    title: 'Failure Prediction Engine',
    slug: 'failure-prediction-engine',
    category: 'The Asset Intelligence Engine', categorySortOrder: 2, sortOrder: 3,
    excerpt: 'How the 30/60/90/180-day probabilities are calculated.',
    bodyHtml: `
      <p>Alongside the Health Score, every asset gets a failure probability at four horizons: 30,
      60, 90, and 180 days. These are derived from the same underlying risk factors as the Health
      Score (age, maintenance gaps, repair frequency, usage intensity) but expressed as a genuine
      probability curve rather than a single point-in-time score \u2014 an asset can have a
      reasonable current Health Score while still showing a rising failure probability over the next
      six months if its maintenance is falling behind.</p>

      <p>Each asset also shows its specific <strong>failure reasons</strong> \u2014 plain-language
      explanations like "approaching or past its expected useful life" or "maintenance overdue" \u2014
      so the probability number is never just a bare figure with no explanation behind it.</p>

      <p>A related, separately-stored number is the <strong>Risk Score</strong>, visible on the
      Asset Detail page \u2014 the overall risk index the Failure Prediction Engine computes
      internally to derive the four probabilities above.</p>
    `,
  },
  {
    title: 'Maintenance Scheduling Engine',
    slug: 'maintenance-scheduling-engine',
    category: 'The Asset Intelligence Engine', categorySortOrder: 2, sortOrder: 4,
    excerpt: 'How TraceHub predicts when an asset is actually due for service.',
    bodyHtml: `
      <p>Every asset gets a real predicted <strong>next service date</strong>, shown on its Asset
      Detail page with the reasoning behind it \u2014 not a generic "service annually" reminder.</p>

      <h3>How it's calculated</h3>
      <p>The base interval comes from usage intensity: Light usage defaults to a 365-day interval,
      Normal to 180 days, Heavy to 90 days, and Extreme to 45 days. You can override this with a
      specific interval for an asset that doesn't fit those defaults.</p>
      <p>That interval is then <strong>pulled forward as health declines</strong> \u2014 an asset with
      a lower Health Score gets a sooner predicted service date than an identical asset in excellent
      condition on the same nominal schedule, capped so it can never recommend service more than
      twice as often as the base interval.</p>
      <p>The schedule is anchored from the asset's last logged maintenance date, or its purchase
      date if no maintenance has ever been logged. <strong>Important:</strong> if an asset has never
      had maintenance logged despite being purchased years ago, its predicted next-service date will
      correctly show as significantly overdue \u2014 this is accurate, not a bug, and is exactly the
      kind of gap the Dashboard's "Due maintenance" count is designed to surface.</p>
    `,
  },
  {
    title: 'Disposal Intelligence Engine',
    slug: 'disposal-intelligence-engine',
    category: 'The Asset Intelligence Engine', categorySortOrder: 2, sortOrder: 5,
    excerpt: 'How KEEP/REPAIR/SELL/SCRAP/REPLACE recommendations are made.',
    bodyHtml: `
      <p>Every asset gets a Disposal Readiness Score (0-100) and a specific recommendation \u2014
      KEEP, REPAIR, SELL, SCRAP, or REPLACE \u2014 weighted across seven real factors:</p>
      <ul>
        <li>Age relative to useful life \u2014 25%</li>
        <li>Maintenance cost relative to replacement value \u2014 20%</li>
        <li>Depreciation \u2014 15%</li>
        <li>Repair frequency \u2014 15%</li>
        <li>Health score \u2014 10%</li>
        <li>Current market value \u2014 10%</li>
        <li>Business criticality \u2014 5%</li>
      </ul>

      <p>The heaviest weight is deliberately on <strong>maintenance cost relative to replacement
      value</strong>, not the original purchase price \u2014 comparing what you've spent keeping an
      asset running against what a brand-new equivalent costs <em>today</em> is a far more honest
      signal than comparing it to a price you paid years ago.</p>

      <h3>The executive recommendation</h3>
      <p>Alongside the score, every asset gets a plain-language summary you can act on immediately \u2014
      for example, <em>"Repair cost exceeds expected operational benefit; replace within 3
      months."</em> This is generated from the same real data as the score itself, not a separate
      guess.</p>

      <h3>Flagging an asset</h3>
      <p>When the engine recommends REPAIR, SELL, SCRAP, or REPLACE, a <strong>"Flag for
      disposal"</strong> button appears on the Asset Detail page, which opens a formal disposal case
      \u2014 see <a href="/pages/documentation">The six-stage disposal workflow</a>.</p>
    `,
  },
  {
    title: 'AI Confidence Score and the Learning Loop',
    slug: 'ai-confidence-score-and-learning-loop',
    category: 'The Asset Intelligence Engine', categorySortOrder: 2, sortOrder: 6,
    excerpt: 'How much to trust a given score, and how the system genuinely learns.',
    bodyHtml: `
      <p>Every recommendation comes with a Confidence Score \u2014 not a vague "trust me," but a
      transparent breakdown of exactly what it's based on: how many of the relevant data fields are
      populated for this asset, how many maintenance records exist, whether current market-value
      data is available, and (see below) a bounded adjustment from your own company's disposal
      history.</p>
      <p>An asset with almost no data filled in \u2014 no maintenance history, no inspections, no
      market value entered \u2014 will honestly show a lower confidence score, because there's
      genuinely less evidence behind its numbers. Filling in more of the "Asset Intelligence Engine
      data" fields when you register or edit an asset directly raises this over time.</p>

      <h3>The AI Learning Loop</h3>
      <p>This is the part that makes TraceHub's recommendations get more reliable specifically for
      <em>your</em> company over time, not just in the abstract. Here's exactly how it works:</p>
      <ol>
        <li>When a disposal recommendation is <strong>rejected</strong> (the case is opened but a
        manager decides not to proceed), the system quietly notes the asset's incident count
        (failures + accidents) at that moment.</li>
        <li>30 days later, it checks back: did a real failure happen since then?</li>
        <li>Over time, this builds a real, auditable <strong>reliability rate</strong> \u2014 of the
        recommendations your company has chosen to ignore, what fraction were later followed by an
        actual failure.</li>
        <li>That rate feeds back into future confidence scores as a small, bounded (\u00b110)
        adjustment \u2014 if your history shows ignoring flags here usually leads to real failures,
        future confidence goes up slightly; if ignored flags usually turn out fine, it's nudged down.</li>
      </ol>
      <p>This only kicks in once there's a real sample size (at least 5 evaluated rejections) \u2014
      before that, the adjustment stays at zero rather than guessing from too little data. This
      isn't a marketing claim about "AI that learns" \u2014 it's a specific, bounded, auditable number
      computed from your own company's actual decisions and their actual outcomes.</p>
    `,
  },
];

// ===================== ADDITIONAL: AI ASSISTANT =====================
const aiAssistant = [
  {
    title: 'The AI Assistant',
    slug: 'the-ai-assistant',
    category: 'The Asset Intelligence Engine', categorySortOrder: 2, sortOrder: 7,
    excerpt: 'What the chat widget can and can\u2019t answer.',
    bodyHtml: `
      <p>The chat bubble in the bottom-right corner is a real AI assistant, not a scripted FAQ bot.
      On the public marketing site, it answers questions about TraceHub itself \u2014 pricing,
      features, how things work \u2014 grounded in the published FAQ content.</p>

      <p>When you're logged in, it gets real, current data about <em>your own</em> company: your
      Portfolio Health, Capital Risk, and Fleet Grade; the specific assets currently flagged for
      repair or replacement (by name, with their real health scores and upkeep costs); assets
      nearing their suggested disposal date; overdue assignment counts; and the same rule-based
      fleet insights shown on your Dashboard. Try asking something like <em>"which assets need
      replacing?"</em> or <em>"what's our biggest maintenance risk right now?"</em> and it will
      answer with your actual data, not a generic response.</p>

      <p>It's honest about its limits: the data it has is a bounded summary (your top ~10 flagged
      assets, aggregate counts), not literally every asset in your fleet. If you ask about a
      specific asset that isn't in that summary, it will say so and point you to that asset's own
      page rather than guessing.</p>
    `,
  },
];

// ===================== TRACKING & SCANNING =====================
const trackingScanning = [
  {
    title: 'Setting up locations',
    slug: 'setting-up-locations',
    category: 'Tracking & Scanning', categorySortOrder: 3, sortOrder: 0,
    excerpt: 'Checkpoints, addresses, and the live map.',
    bodyHtml: `
      <p>Locations are the checkpoints your assets get scanned into and out of \u2014 a warehouse, a
      branch office, a job site. Add one from <strong>Locations \u2192 Add location</strong> with a
      name and, optionally, an address and coordinates.</p>

      <h3>Setting coordinates</h3>
      <p>You can type latitude/longitude directly, or click the interactive map in the form to drop
      a pin \u2014 no separate geocoding service or API key needed. Once a location has coordinates,
      it appears on the live map alongside the location list, which defaults to a world view since
      TraceHub makes no assumption about where your operations are.</p>

      <h3>Editing and deleting</h3>
      <p>Use the pencil icon on any location to update its details, or the trash icon to remove it.
      Deleting a location doesn't delete the history of assets that were once scanned there \u2014 it
      only removes it as a future scan destination.</p>
    `,
  },
  {
    title: 'Scanning assets',
    slug: 'scanning-assets',
    category: 'Tracking & Scanning', categorySortOrder: 3, sortOrder: 1,
    excerpt: 'Two ways to scan, and what actually happens when you do.',
    bodyHtml: `
      <p>There are two ways to scan an asset into or out of a location:</p>
      <ol>
        <li><strong>Scan a physical QR tag with any phone camera.</strong> This opens the real URL
        encoded in the tag, logs you in if needed, and lands you on the in-app scanner with that
        asset already looked up.</li>
        <li><strong>Use the in-app scanner directly.</strong> Go to <strong>Scan</strong>, and either
        use your device's camera live (works on a phone or a laptop with a webcam) or manually type
        a token if you don't have camera access.</li>
      </ol>

      <p>Once an asset is found, pick the location from the dropdown and confirm \u2014 this updates
      the asset's <strong>current location</strong> immediately and logs a real, timestamped
      location event.</p>

      <h3>Important: this is checkpoint tracking, not GPS</h3>
      <p>An asset's "current location" is wherever it was <em>last scanned into</em> \u2014 it does
      not update continuously and there's no GPS hardware involved. If nobody scans an asset for
      three weeks, it will still show the location from three weeks ago. This is a deliberate,
      cost-effective design choice (no hardware to install or maintain), not a limitation to work
      around \u2014 see <a href="/pages/documentation">Location history and the asset timeline</a> for
      how to see the full scan history for any asset.</p>
    `,
  },
  {
    title: 'Location history and the asset timeline',
    slug: 'location-history-and-timeline',
    category: 'Tracking & Scanning', categorySortOrder: 3, sortOrder: 2,
    excerpt: 'Where to see everywhere an asset has been.',
    bodyHtml: `
      <p>Every asset's own page has a real <strong>Timeline</strong> \u2014 a single chronological
      history merged from every dated record that actually exists for it: purchase date,
      assignment/return history, location scans, inspections, and disposal workflow stage changes.
      Nothing here is invented \u2014 if an asset has no purchase date on record, the timeline
      correctly omits that entry rather than guessing one.</p>

      <p>For a company-wide view across every asset, go to <strong>Reports \u2192 Location
      activity</strong>, which lists every scan event across your whole fleet with location and
      event-type filters, exportable to CSV, PDF, or PowerPoint.</p>
    `,
  },
];

// ===================== ASSIGNMENTS =====================
const assignments = [
  {
    title: 'Assigning assets to people',
    slug: 'assigning-assets-to-people',
    category: 'Assignments', categorySortOrder: 4, sortOrder: 0,
    excerpt: 'Internal staff and external contacts, expected return dates, and hire fees.',
    bodyHtml: `
      <p>Go to <strong>Assignments \u2192 New assignment</strong>. You can assign an asset to a
      teammate already in your workspace, or to an external contact by name (with optional email and
      phone) if you're lending equipment to someone outside your organization \u2014 a contractor, a
      renter.</p>

      <h3>Expected return date</h3>
      <p>Setting an expected return date is what powers the reminder system \u2014 see
      <a href="/pages/documentation">Return reminders and overdue alerts</a>. Leaving it blank means
      the asset is assigned indefinitely with no reminder tracking.</p>

      <h3>Hire fees</h3>
      <p>If you're renting equipment out for a fee (common for machinery, generators, vehicles), set
      a hire fee amount and currency on the assignment. It shows up in the Assignments list with a
      Paid/Unpaid toggle a Manager or Company Admin can click to mark payment received.</p>
    `,
  },
  {
    title: 'Return reminders and overdue alerts',
    slug: 'return-reminders-and-overdue-alerts',
    category: 'Assignments', categorySortOrder: 4, sortOrder: 1,
    excerpt: 'Exactly when emails go out, and to whom.',
    bodyHtml: `
      <p>TraceHub sends real, automatic email reminders tied to an assignment's expected return
      date \u2014 nothing here requires you to remember to chase anyone manually.</p>
      <ol>
        <li><strong>3 days before</strong> the expected return date: a reminder to the person
        holding the asset.</li>
        <li><strong>On the due date itself</strong>: another reminder, and the assignment's status
        flips to "overdue" if it hasn't been returned.</li>
        <li><strong>Every day it remains overdue</strong>: a fresh alert goes out \u2014 not just
        once \u2014 to <em>both</em> the person holding the asset and <em>every</em> Company Admin in
        your workspace, with a real running day-count ("Overdue 4 days") rather than a vague nag.</li>
      </ol>
      <p>On the Assignments list and the Dashboard's "Assets currently assigned" panel, an overdue
      item shows in bold red with the exact number of days held and days overdue \u2014 no need to do
      the math yourself.</p>
    `,
  },
  {
    title: 'Marking an asset returned',
    slug: 'marking-an-asset-returned',
    category: 'Assignments', categorySortOrder: 4, sortOrder: 2,
    excerpt: 'Closing out an assignment and what happens automatically.',
    bodyHtml: `
      <p>From the Assignments list, click <strong>Mark returned</strong> on any active or overdue
      assignment. This immediately: sets the assignment's status to "returned," clears the asset's
      status back to "available," stops any further overdue alerts for that assignment, and logs a
      real, timestamped "Returned" entry on the asset's Timeline.</p>
    `,
  },
];

// ===================== DISPOSAL WORKFLOW =====================
const disposalWorkflow = [
  {
    title: 'The six-stage disposal workflow',
    slug: 'six-stage-disposal-workflow',
    category: 'Disposal Workflow', categorySortOrder: 5, sortOrder: 0,
    excerpt: 'Flagged through Disposed, with real approval gates and audit logging.',
    bodyHtml: `
      <p>When an asset reaches the end of its useful life, TraceHub follows a formal, six-stage
      workflow rather than a single "mark as disposed" button \u2014 appropriate for organizations
      that need a real approval trail for capital equipment decisions.</p>
      <ol>
        <li><strong>Flagged</strong> \u2014 a disposal case is opened, either manually or by clicking
        "Flag for disposal" when the Disposal Engine recommends it.</li>
        <li><strong>Manager review</strong> \u2014 a Manager or Company Admin reviews the case.</li>
        <li><strong>Finance review</strong> \u2014 a financial sign-off stage.</li>
        <li><strong>Approved</strong> \u2014 cleared to proceed.</li>
        <li><strong>Auction / Sale / Donation / Scrap / Recycle</strong> \u2014 the actual disposal
        method, recorded with a final sale amount if applicable.</li>
        <li><strong>Disposed</strong> \u2014 final stage; the asset's status automatically updates
        to "Disposed."</li>
      </ol>
      <p>A case can also be <strong>rejected</strong> at any stage with a required reason \u2014 this
      feeds directly into the AI Learning Loop (see
      <a href="/pages/documentation">AI Confidence Score and the Learning Loop</a>), which checks
      back later on whether a real failure followed the decision to keep the asset in service.</p>
      <p>Every transition is logged in the audit trail with a real timestamp, and also appears on
      the asset's own Timeline.</p>
    `,
  },
  {
    title: 'Flagging an asset and role gates',
    slug: 'flagging-and-role-gates',
    category: 'Disposal Workflow', categorySortOrder: 5, sortOrder: 1,
    excerpt: 'Who can do what at each stage.',
    bodyHtml: `
      <p>Any team member with Staff access or above can flag an asset for disposal from its detail
      page. From there, stage transitions require the appropriate role: Managers can move a case
      through Manager review; Finance-level sign-off and final approval require Company Admin
      access. This ensures a single person can't unilaterally push equipment through disposal
      without the right people weighing in.</p>
      <p>Track all open cases from <strong>Disposal cases</strong>, filterable by stage.</p>
    `,
  },
];

// ===================== TEAM & SECURITY =====================
const teamSecurity = [
  {
    title: 'Inviting team members',
    slug: 'inviting-team-members',
    category: 'Team & Security', categorySortOrder: 6, sortOrder: 0,
    excerpt: 'How invites work, and what the new person sees.',
    bodyHtml: `
      <p>From <strong>Team \u2192 Add team member</strong>, enter their name, email, and role
      (Manager or Staff \u2014 Company Admin is set separately if needed). They receive an email with
      a system-generated temporary password.</p>
      <p>The Team page also shows, for every member: phone, last login, join date, 2FA status, and
      a <strong>"Pending first login"</strong> badge for anyone who hasn't completed the mandatory
      password setup yet (see next article) \u2014 useful for knowing who still needs a nudge.</p>
    `,
  },
  {
    title: 'The mandatory first-login password setup',
    slug: 'mandatory-first-login-password-setup',
    category: 'Team & Security', categorySortOrder: 6, sortOrder: 1,
    excerpt: 'Why a new team member can\u2019t just start using their temp password.',
    bodyHtml: `
      <p>A temporary password is only ever meant to get someone in the door once. When a newly
      invited person logs in with it, TraceHub blocks access to everything else in the app until
      they set their own password \u2014 this is enforced by the server itself, not just a frontend
      screen someone could skip past.</p>
      <p>Right after setting a new password, they're offered a one-minute two-factor authentication
      setup (scan a QR code with any authenticator app, enter the 6-digit code) \u2014 optional but
      strongly encouraged, and skippable if they'd rather do it later from Settings.</p>
    `,
  },
  {
    title: 'Two-factor authentication',
    slug: 'two-factor-authentication',
    category: 'Team & Security', categorySortOrder: 6, sortOrder: 2,
    excerpt: 'Turning 2FA on or off at any time.',
    bodyHtml: `
      <p>Beyond the first-login prompt, anyone can enable or disable two-factor authentication at
      any time from <strong>Settings</strong>. Enabling it walks you through scanning a QR code with
      any standard authenticator app (Google Authenticator, Authy, 1Password, and similar) and
      confirming with a 6-digit code. Disabling it requires re-entering your password, so an
      attacker who's compromised your session alone can't simply turn it off.</p>
    `,
  },
  {
    title: 'The audit log',
    slug: 'the-audit-log',
    category: 'Team & Security', categorySortOrder: 6, sortOrder: 3,
    excerpt: 'What gets logged, and where to find it.',
    bodyHtml: `
      <p>Every meaningful action in your workspace \u2014 who created, edited, or deleted what, sign-in
      activity, disposal-case transitions \u2014 is recorded with a real timestamp and the acting
      user. Super Admins can see a global audit log across the platform; within your own company,
      this history also surfaces contextually on individual asset Timelines rather than as one giant
      undifferentiated log to search through.</p>
    `,
  },
];

// ===================== REPORTS, DASHBOARD & EXPORTING =====================
const reportsExporting = [
  {
    title: 'The Dashboard, explained',
    slug: 'the-dashboard-explained',
    category: 'Reports & Exporting', categorySortOrder: 7, sortOrder: 0,
    excerpt: 'Every panel on the Dashboard and what it actually shows.',
    bodyHtml: `
      <p>Top to bottom, the Dashboard shows:</p>
      <ul>
        <li><strong>KPI cards</strong> \u2014 total assets, active assignments, overdue returns, and
        assets due for disposal within 90 days.</li>
        <li><strong>Asset status breakdown</strong> \u2014 Available/Assigned/Maintenance/Disposed counts.</li>
        <li><strong>Fleet value</strong> \u2014 total purchase value vs. current AI-estimated value.</li>
        <li><strong>Intelligence KPI chips</strong> \u2014 Healthy/Critical/Near disposal/Due
        maintenance/Warranty expiring/Idle asset counts.</li>
        <li><strong>Depreciation &amp; replacement projections</strong> \u2014 today's depreciation,
        monthly asset loss, replacement budget needed now, projected disposal cost, and a genuinely
        distinct 12-month forward-looking projected replacement cost.</li>
        <li><strong>Ranked lists</strong> \u2014 most valuable, most repaired, and most expensive-to-
        maintain assets.</li>
        <li><strong>Assets currently assigned</strong> \u2014 who has what, issued/due dates, days
        held (red once overdue), and contact info, exportable to CSV/PDF/PowerPoint.</li>
        <li><strong>Fleet Intelligence panel</strong> \u2014 portfolio-level aggregates: Portfolio
        Health, Asset Availability, Capital Risk, Financial/Operational Risk, an overall A-F Fleet
        Grade, and a clickable Executive Heat Map (click any health tier to jump to a filtered
        Assets list).</li>
        <li><strong>AI Insights Panel</strong> \u2014 rule-based patterns detected across your fleet
        (a category depreciating faster than expected, an asset that's blown past its maintenance
        budget), each one a real, computed sentence, not templated filler.</li>
        <li><strong>AI Learning Loop panel</strong> \u2014 your company's own recommendation
        reliability rate, once enough history exists to compute one.</li>
      </ul>
      <p>Every number here traces back to real per-asset data \u2014 see
      <a href="/pages/documentation">Fleet Intelligence formulas explained</a> for exactly how the
      portfolio-level figures are calculated.</p>
    `,
  },
  {
    title: 'Fleet Intelligence formulas explained',
    slug: 'fleet-intelligence-formulas-explained',
    category: 'Reports & Exporting', categorySortOrder: 7, sortOrder: 1,
    excerpt: 'The exact, documented math behind Portfolio Health, Capital Risk, and Fleet Grade.',
    bodyHtml: `
      <p>None of the figures on the Fleet Intelligence panel are industry-standard metrics with one
      universally agreed definition, so here's exactly how TraceHub computes each one:</p>
      <ul>
        <li><strong>Portfolio Health</strong> \u2014 a weighted average across your fleet's health
        tiers (Excellent/Healthy/Needs Attention/High Risk/Critical), not a simple average of raw
        scores.</li>
        <li><strong>Asset Availability</strong> \u2014 the % of assets currently in "Available"
        status.</li>
        <li><strong>Capital Risk</strong> \u2014 the % of your total fleet's <em>value</em> (not just
        asset count) that sits in High Risk or Critical health-tier assets. This deliberately weighs
        by money, not headcount \u2014 ten cheap tools in poor condition matter less than one
        high-value vehicle in poor condition.</li>
        <li><strong>Projected Savings</strong> \u2014 the real maintenance and repair spend so far
        this cycle on assets already recommended for replacement, scrap, or sale \u2014 money you'd
        stop spending by acting on the recommendation, not a speculative "AI predicts" figure.</li>
        <li><strong>Financial/Operational Risk</strong> (Low/Medium/High) \u2014 our own documented
        thresholds on Capital Risk and the proportion of High Risk/Critical assets, respectively.</li>
        <li><strong>Overall Fleet Grade (A-F)</strong> \u2014 a composite of Portfolio Health (60%
        weight), Asset Availability (20%), and the inverse of Capital Risk (20%), mapped to a letter
        grade.</li>
      </ul>
      <p>Click any non-zero segment of the Executive Heat Map to jump straight to the Assets list,
      pre-filtered to exactly that health tier.</p>
    `,
  },
  {
    title: 'Reports & Analytics page',
    slug: 'reports-and-analytics-page',
    category: 'Reports & Exporting', categorySortOrder: 7, sortOrder: 2,
    excerpt: 'Category breakdown, depreciation, and location activity.',
    bodyHtml: `
      <p>The <strong>Reports</strong> page has three real reports: an assets-by-category breakdown
      chart, a full depreciation report (purchase price vs. current AI-estimated value per asset,
      filterable by category), and a company-wide location activity log (every scan event, filterable
      by location and event type).</p>
    `,
  },
  {
    title: 'Exporting to CSV, PDF, and PowerPoint',
    slug: 'exporting-csv-pdf-powerpoint',
    category: 'Reports & Exporting', categorySortOrder: 7, sortOrder: 3,
    excerpt: 'Where export buttons live, and what the PowerPoint option actually builds.',
    bodyHtml: `
      <p>CSV, PDF, and PowerPoint export are available on the Reports page, the Dashboard's
      "Assets currently assigned" panel, and (Super Admin) platform-level audit log and growth
      charts.</p>
      <p>The <strong>PowerPoint export</strong> is worth calling out specifically: it doesn't just
      dump a spreadsheet into slides. It builds a real, presentation-ready deck \u2014 a branded title
      slide followed by clean, formatted table slides \u2014 something you can hand directly to
      leadership without reformatting anything yourself.</p>
      <p>All exports run entirely in your browser \u2014 no data is sent to a third-party export
      service to generate the file.</p>
    `,
  },
];

// ===================== BILLING & SUBSCRIPTIONS =====================
const billing = [
  {
    title: 'Plans and your trial',
    slug: 'plans-and-your-trial',
    category: 'Billing & Subscriptions', categorySortOrder: 8, sortOrder: 0,
    excerpt: 'Trial, Basic, Pro, and Enterprise, and what changes between them.',
    bodyHtml: `
      <p>Every workspace starts on a 30-day free trial with a 10-asset limit and full feature
      access \u2014 nothing about the Intelligence Engine, scanning, or the disposal workflow is
      gated during the trial. Paid tiers (Basic, Pro, Enterprise) raise your asset and user limits;
      compare them from <strong>Billing</strong>.</p>
      <p>If you hit your plan's asset limit, asset creation is blocked with a clear message rather
      than silently failing \u2014 upgrade from Billing to raise it.</p>
    `,
  },
  {
    title: 'Managing your subscription',
    slug: 'managing-your-subscription',
    category: 'Billing & Subscriptions', categorySortOrder: 8, sortOrder: 1,
    excerpt: 'Upgrading, auto-renewal, and cancelling.',
    bodyHtml: `
      <p>Subscriptions are billed in USD and processed through Flutterwave. Unless cancelled, a paid
      subscription <strong>renews automatically</strong> at the end of each billing cycle. You can
      cancel auto-renewal at any time from <strong>Billing</strong> \u2014 your plan stays fully
      active until the end of the period you've already paid for; nothing is cut off immediately.</p>
      <p>Your invoice history is available on the same page.</p>
    `,
  },
];

// ===================== EXPANDED: INTELLIGENCE ENGINE DEPTH =====================
const intelligenceEngineExpanded = [
  {
    title: 'Time-based depreciation methods explained',
    slug: 'time-based-depreciation-methods',
    category: 'The Asset Intelligence Engine', categorySortOrder: 2, sortOrder: 8,
    excerpt: 'Straight Line, Reducing Balance, Double Declining Balance, and Sum of Years\u2019 Digits, with worked numbers.',
    bodyHtml: `
      <p>Four of the nine depreciation methods are based purely on time (age), not usage. Here's
      what each actually does with a concrete example: a $10,000 asset, 5-year useful life, $500
      scrap value.</p>

      <h3>Straight Line</h3>
      <p>Depreciates by an equal amount every year: <code>(cost - scrap) / lifeYears</code> = $1,900
      per year. After 2 years, book value = $10,000 - (2 \u00d7 $1,900) = $6,200.</p>

      <h3>Reducing Balance</h3>
      <p>Applies a fixed percentage to whatever the <em>remaining</em> book value is each year,
      rather than the original cost \u2014 so depreciation is larger in early years and tapers off.
      The rate is derived so the asset reaches its scrap value by the end of its useful life.</p>

      <h3>Double Declining Balance</h3>
      <p>An accelerated version of reducing balance, using twice the straight-line rate
      (<code>2 / lifeYears</code>) applied to the remaining balance each year. For a 5-year asset,
      that's a 40% rate: year 1 book value = $10,000 \u00d7 0.6 = $6,000; year 2 = $6,000 \u00d7 0.6 =
      $3,600. It never depreciates below the scrap value. TraceHub prorates this smoothly for
      partial years \u2014 an asset 2.5 years old is valued between its 2-year and 3-year figures, not
      identical to either.</p>

      <h3>Sum of Years' Digits</h3>
      <p>Also accelerated, but using a digit-sum weighting: for a 5-year asset, the digits 5+4+3+2+1
      = 15. Year 1 depreciates 5/15 of the depreciable base, year 2 depreciates 4/15, and so on \u2014
      front-loaded, but less aggressively than double declining balance. Like DDB, TraceHub prorates
      this for partial years rather than jumping in whole-year steps.</p>

      <h3>Which to pick</h3>
      <p>Straight Line is the right default for most office equipment and furniture that loses value
      steadily. The accelerated methods (Reducing Balance, DDB, SYD) suit equipment that genuinely
      loses most of its value in the first year or two \u2014 vehicles and some machinery are common
      candidates.</p>
    `,
  },
  {
    title: 'Usage-based depreciation methods explained',
    slug: 'usage-based-depreciation-methods',
    category: 'The Asset Intelligence Engine', categorySortOrder: 2, sortOrder: 9,
    excerpt: 'Units of Production, Machine Hours, and Mileage Based \u2014 for equipment that wears by use, not time.',
    bodyHtml: `
      <p>Three methods depreciate based on how much an asset has actually been used, not how long
      you've owned it \u2014 appropriate for equipment where usage varies wildly between units of the
      same age.</p>
      <ul>
        <li><strong>Units of Production</strong> \u2014 set the asset's total expected output capacity
        (e.g. a printer rated for 500,000 pages). Depreciation accrues proportionally to units
        actually produced against that capacity.</li>
        <li><strong>Machine Hours</strong> \u2014 the same idea, using operating hours instead of a
        production count. A generator rated for 20,000 hours that's logged 5,000 hours has used 25%
        of its depreciable life, regardless of its calendar age.</li>
        <li><strong>Mileage Based</strong> \u2014 for vehicles: set expected total mileage, and
        depreciation tracks the odometer.</li>
      </ul>
      <p>All three require you to keep the relevant usage figure (units, hours, or mileage) updated
      on the asset \u2014 either manually via the Edit Asset form, or by logging it whenever you record
      an inspection or maintenance event. An asset on one of these methods with a stale usage figure
      will show a value based on outdated usage, the same honest limitation any usage-based system has.</p>
    `,
  },
  {
    title: 'AI Adaptive depreciation in depth',
    slug: 'ai-adaptive-depreciation-in-depth',
    category: 'The Asset Intelligence Engine', categorySortOrder: 2, sortOrder: 10,
    excerpt: 'The multiplicative model behind TraceHub\u2019s most data-responsive method.',
    bodyHtml: `
      <p>AI Adaptive is the most sophisticated built-in method: rather than a single time or usage
      curve, it multiplies together five real adjustment factors on top of a straight-line base:</p>
      <ul>
        <li><strong>Usage factor</strong> \u2014 higher for Heavy/Extreme usage intensity, lower for Light.</li>
        <li><strong>Maintenance factor</strong> \u2014 well-maintained assets depreciate more slowly
        than their maintenance history would otherwise suggest.</li>
        <li><strong>Environment factor</strong> \u2014 harsher conditions (high corrosion risk, heavy
        dust exposure) accelerate depreciation.</li>
        <li><strong>Market factor</strong> \u2014 if you've entered a current market value, it pulls
        the estimate toward real-world resale reality rather than a pure formula.</li>
        <li><strong>Reliability factor</strong> \u2014 informed by repair frequency and failure history.</li>
      </ul>
      <p>Because it draws on so many inputs, AI Adaptive is also the method most affected by how
      much "Asset Intelligence Engine data" you've filled in \u2014 an asset with usage intensity,
      environment, and maintenance history all populated gets a genuinely tailored curve; one with
      none of that data effectively falls back toward straight-line behavior. This is also reflected
      honestly in that asset's AI Confidence Score.</p>
    `,
  },
  {
    title: 'Writing custom depreciation formulas',
    slug: 'writing-custom-depreciation-formulas',
    category: 'The Asset Intelligence Engine', categorySortOrder: 2, sortOrder: 11,
    excerpt: 'Syntax rules, available variables, and several real worked examples.',
    bodyHtml: `
      <p>If none of the eight built-in methods match how your organization actually values an
      asset, write your own formula \u2014 evaluated by a safe, restricted arithmetic parser (no code
      execution, just numbers and operators), so an invalid formula can never break the asset's
      record; it safely falls back to straight-line instead.</p>

      <h3>Syntax</h3>
      <p>Basic arithmetic only: <code>+ - * / ^</code> and parentheses. No function calls, no
      comparisons, no text. Available variables:</p>
      <table style="width:100%;border-collapse:collapse;margin:0.75rem 0;font-size:0.88rem;">
        <tbody>
          <tr><td style="padding:0.3rem;"><code>cost</code></td><td style="padding:0.3rem;">Purchase price</td></tr>
          <tr><td style="padding:0.3rem;"><code>residual</code></td><td style="padding:0.3rem;">Scrap value</td></tr>
          <tr><td style="padding:0.3rem;"><code>lifeYears</code></td><td style="padding:0.3rem;">Useful life in years</td></tr>
          <tr><td style="padding:0.3rem;"><code>age</code></td><td style="padding:0.3rem;">Current age in years (fractional)</td></tr>
          <tr><td style="padding:0.3rem;"><code>hoursUsed / mileage / operatingCycles</code></td><td style="padding:0.3rem;">Usage figures</td></tr>
          <tr><td style="padding:0.3rem;"><code>repairCount / maintenanceCount</code></td><td style="padding:0.3rem;">Event counts</td></tr>
          <tr><td style="padding:0.3rem;"><code>maintenanceCostTotal / repairCostTotal</code></td><td style="padding:0.3rem;">Cumulative spend</td></tr>
        </tbody>
      </table>

      <h3>Worked examples</h3>
      <p><strong>Penalize repairs and age together:</strong><br/>
      <code>cost - (repairCount * 25) - (age * 100)</code><br/>
      Starts at full cost, loses $25 per repair and $100 per year of age.</p>

      <p><strong>A floor at residual value:</strong> the parser doesn't automatically clamp to your
      residual value the way built-in methods do \u2014 if you want that guarantee, build it into the
      formula's logic by keeping terms small enough relative to cost, or simply monitor the result
      and adjust; an extreme formula could theoretically produce a negative number, which TraceHub
      will still store, so test your formula against a real asset before relying on it broadly.</p>
    `,
  },
  {
    title: 'Understanding the Risk Score',
    slug: 'understanding-risk-score',
    category: 'The Asset Intelligence Engine', categorySortOrder: 2, sortOrder: 12,
    excerpt: 'The 0-100 index behind the four failure-probability horizons.',
    bodyHtml: `
      <p>Alongside the 30/60/90/180-day failure probabilities, every asset has a single
      <strong>Risk Score</strong> (0-100) \u2014 the overall risk index the Failure Prediction Engine
      computes internally, from which the four time-horizon probabilities are all derived as
      different points along the same risk curve. A higher Risk Score means a steeper probability
      curve across all four horizons, not just a higher number at one specific point in time.</p>
      <p>It's shown directly on the Asset Detail page next to the Failure Risk section, so you can
      see the single underlying number driving the four percentages above it, rather than treating
      them as four unrelated figures.</p>
    `,
  },
  {
    title: 'The AI Insights Panel: all five pattern detectors explained',
    slug: 'ai-insights-panel-detectors-explained',
    category: 'The Asset Intelligence Engine', categorySortOrder: 2, sortOrder: 13,
    excerpt: 'Exactly what triggers each insight shown on your Dashboard.',
    bodyHtml: `
      <p>The Dashboard's AI Insights Panel runs five independent, rule-based pattern detectors
      across your whole fleet every time you load it. Each one is deterministic \u2014 given the same
      data, it always produces the same sentence \u2014 and a detector that finds nothing simply
      contributes nothing, rather than forcing a sentence out of thin air.</p>
      <ol>
        <li><strong>Accelerated depreciation from heavy usage</strong> \u2014 flags a category where
        multiple heavily-used assets are losing value noticeably faster than that category's own
        average. Example: <em>"3 assets in Vehicles are depreciating faster than the category
        average due to heavy usage."</em></li>
        <li><strong>Maintenance budget exceeded</strong> \u2014 flags the single asset whose
        cumulative maintenance and repair spend has most exceeded a documented budget assumption (a
        percentage of its replacement cost). Example: <em>"Forklift 02 has exceeded its projected
        maintenance budget by 49%; replacement is likely more economical than continued repair."</em></li>
        <li><strong>Approaching end-of-life</strong> \u2014 flags categories with assets whose
        suggested disposal date falls within the next six months.</li>
        <li><strong>Idle assets</strong> \u2014 flags categories with assets sitting unused (available
        status) for an extended period, worth reassigning or selling.</li>
        <li><strong>Category-wide maintenance alarm</strong> \u2014 flags a whole category (not a
        single asset) where cumulative upkeep spend across all its assets has crossed a high
        threshold relative to their combined replacement value.</li>
      </ol>
      <p>None of these are guesses \u2014 every number in every sentence traces back to a real query
      against your own asset data at the moment the Dashboard loads.</p>
    `,
  },
];


// ===================== FOR SUPER ADMINS =====================
const superAdmin = [
  {
    title: 'Managing tenant companies',
    slug: 'managing-tenant-companies',
    category: 'For Super Admins', categorySortOrder: 9, sortOrder: 0,
    excerpt: 'The platform-level view across every company using TraceHub.',
    bodyHtml: `
      <p>Super Admins have a completely separate portal (<code>/admin</code>) from the company-level
      app, covering the platform as a whole rather than any single workspace's data. From
      <strong>Companies</strong>, you can see every tenant company, its plan, asset/user counts, and
      subscription status, and change a company's status (active/suspended) directly.</p>
      <p>Opening an individual company shows its own detail page \u2014 usage figures, users, and
      subscription history \u2014 without exposing that company's actual asset records to you as
      Super Admin; the platform's own operational data is separate from customer data by design, per
      the Privacy Policy.</p>
    `,
  },
  {
    title: 'CMS content management',
    slug: 'cms-content-management',
    category: 'For Super Admins', categorySortOrder: 9, sortOrder: 1,
    excerpt: 'Editing the homepage, testimonials, FAQs, and legal/documentation pages.',
    bodyHtml: `
      <p>Everything on the public marketing site is editable from the Super Admin portal without a
      code change:</p>
      <ul>
        <li><strong>Hero &amp; login copy</strong> \u2014 the homepage headline and subheadline.</li>
        <li><strong>Testimonials</strong> \u2014 the scrolling quotes on the homepage.</li>
        <li><strong>FAQ</strong> \u2014 also doubles as the AI Assistant's marketing-mode knowledge base.</li>
        <li><strong>Footer links</strong> \u2014 add, remove, or reorder any footer link.</li>
        <li><strong>Custom pages</strong> \u2014 the Privacy Policy, Terms of Service, and Cookie
        Policy are all editable here, along with any additional page you create.</li>
        <li><strong>Blog / updates</strong> \u2014 write and publish new posts, moderate comments.</li>
      </ul>
      <p>All CMS content self-heals on a fresh reseed for a small set of "managed" pages (the legal
      pages and this documentation) \u2014 meaning platform-provided content updates reach an
      already-running installation automatically, while custom edits to unrelated pages are never
      silently overwritten.</p>
    `,
  },
  {
    title: 'Email / SMTP configuration',
    slug: 'email-smtp-configuration',
    category: 'For Super Admins', categorySortOrder: 9, sortOrder: 2,
    excerpt: 'Why this must be configured before real customers rely on the platform.',
    bodyHtml: `
      <p>Password resets, staff invitations, and overdue-asset alerts all depend on real email
      delivery. Configure your SMTP provider from <strong>Email/SMTP</strong> in the Super Admin
      portal \u2014 host, port, username, password, and sender name.</p>
      <div class="th-legal-callout"><strong>Important:</strong> without a configured SMTP provider,
      TraceHub does not fail loudly \u2014 it silently logs what it "would have sent" instead of
      actually delivering it. A real company signing up would hit "forgot password" and receive
      nothing, with no visible error. Configure this before opening the platform to real users.</div>
    `,
  },
  {
    title: 'Payment / Flutterwave configuration',
    slug: 'payment-flutterwave-configuration',
    category: 'For Super Admins', categorySortOrder: 9, sortOrder: 3,
    excerpt: 'Wiring up real subscription billing.',
    bodyHtml: `
      <p>Subscription billing runs through Flutterwave. Configure your Flutterwave API keys from
      <strong>Payments</strong> in the Super Admin portal. The webhook that confirms successful and
      failed charges (and drives auto-renewal) is real and signature-verified \u2014 not a stub \u2014
      but should be tested against your actual production Flutterwave credentials before relying on
      it for real customer billing, since sandbox/test-mode behavior can differ from production.</p>
    `,
  },
  {
    title: 'Managing plans and coupons',
    slug: 'managing-plans-and-coupons',
    category: 'For Super Admins', categorySortOrder: 9, sortOrder: 4,
    excerpt: 'Defining subscription tiers and discount codes.',
    bodyHtml: `
      <p>From <strong>Plans</strong>, define each subscription tier's price, billing cycle, and
      asset/user limits \u2014 these are what companies see and choose from on their own Billing page.
      From <strong>Coupons</strong>, create discount codes with a percentage or fixed-amount
      discount, an optional expiry date, and a usage limit.</p>
    `,
  },
  {
    title: 'Global audit log and security',
    slug: 'global-audit-log-and-security',
    category: 'For Super Admins', categorySortOrder: 9, sortOrder: 5,
    excerpt: 'Platform-wide activity monitoring.',
    bodyHtml: `
      <p>The Super Admin <strong>Audit log</strong> shows meaningful actions across every company on
      the platform \u2014 sign-ins, disposal-case transitions, plan changes \u2014 each with a real
      timestamp and the acting user, exportable to CSV or PDF. The <strong>Security</strong> page
      covers platform-level account and security settings for the Super Admin account itself.</p>
    `,
  },
];


// ===================== TROUBLESHOOTING & FAQS =====================
const troubleshooting = [
  {
    title: "I can't log in",
    slug: 'troubleshoot-cant-log-in',
    category: 'Troubleshooting & FAQs', categorySortOrder: 10, sortOrder: 0,
    excerpt: 'The most common causes and what to check.',
    bodyHtml: `
      <ul>
        <li><strong>"Invalid email or password"</strong> \u2014 double check for extra spaces, and
        remember passwords are case-sensitive. Use <strong>Forgot password</strong> if you're unsure.</li>
        <li><strong>Nothing happens / a blocked screen appears</strong> \u2014 if you were recently
        invited to a workspace, you may be on the mandatory first-login password setup screen; you
        must set your own password (and optionally 2FA) before anything else becomes accessible.
        This is enforced by design, not a bug.</li>
        <li><strong>2FA code rejected</strong> \u2014 authenticator app codes are time-based; make
        sure your device's clock is accurate. If you've lost access to your authenticator app
        entirely, contact your Company Admin, since 2FA reset for a locked-out account is an
        administrative action.</li>
      </ul>
    `,
  },
  {
    title: "My invited teammate never received their email",
    slug: 'troubleshoot-invite-email-not-received',
    category: 'Troubleshooting & FAQs', categorySortOrder: 10, sortOrder: 1,
    excerpt: 'Almost always an SMTP configuration issue, not a bug in the invite itself.',
    bodyHtml: `
      <p>If a newly invited team member never receives their temporary password email, the most
      common cause by far is that your platform's SMTP provider hasn't been configured yet by a
      Super Admin \u2014 without it, TraceHub doesn't fail loudly, it silently logs the email instead
      of sending it. Check with whoever manages your TraceHub deployment that SMTP is actually set
      up, or check spam/junk folders as a second possibility.</p>
    `,
  },
  {
    title: "An asset's Health Score, Failure Risk, or Recommendation shows nothing",
    slug: 'troubleshoot-blank-intelligence-scores',
    category: 'Troubleshooting & FAQs', categorySortOrder: 10, sortOrder: 2,
    excerpt: 'Why a brand-new asset might briefly show blank scores.',
    bodyHtml: `
      <p>The Intelligence Engine recalculates whenever an asset is created or updated \u2014 if you
      see blank scores immediately after creating an asset, refresh the page; the calculation runs
      synchronously as part of saving the asset, so a blank score after a refresh is unusual and
      worth checking that the asset actually has a purchase price and category set, since those are
      the minimum inputs the engine needs to produce anything at all.</p>
    `,
  },
  {
    title: "Scanning a QR code says the asset wasn't found",
    slug: 'troubleshoot-scan-asset-not-found',
    category: 'Troubleshooting & FAQs', categorySortOrder: 10, sortOrder: 3,
    excerpt: 'Common causes: stale printed codes, wrong workspace, or an archived asset.',
    bodyHtml: `
      <ul>
        <li><strong>The asset was archived or deleted</strong> since the tag was printed \u2014 its
        QR token no longer resolves to an active asset.</li>
        <li><strong>You're logged into a different company's workspace</strong> than the one that
        registered the asset \u2014 QR tokens are scoped to the company that created them.</li>
        <li><strong>A damaged or low-quality printed code</strong> \u2014 try the manual token entry
        option on the Scan page instead of the camera if a physical tag has become hard to read.</li>
      </ul>
    `,
  },
  {
    title: 'What currencies are supported for Purchase Price?',
    slug: 'faq-supported-currencies',
    category: 'Troubleshooting & FAQs', categorySortOrder: 10, sortOrder: 4,
    excerpt: 'USD is the standard; GHS conversion is live; more are planned.',
    bodyHtml: `
      <p>Purchase price is always stored in USD across the platform, for consistent reporting and
      comparison. If you paid in Ghanaian Cedis (GHS), use the built-in currency conversion helper
      on the Add/Edit Asset form to convert your local amount to USD automatically. Chinese Yuan,
      Euro, and British Pound conversion are planned but not yet live \u2014 shown as "coming soon" in
      the currency selector.</p>
    `,
  },
  {
    title: 'Does TraceHub track GPS location?',
    slug: 'faq-does-tracehub-track-gps',
    category: 'Troubleshooting & FAQs', categorySortOrder: 10, sortOrder: 5,
    excerpt: 'No \u2014 and here\u2019s why that\u2019s a deliberate choice, not a limitation.',
    bodyHtml: `
      <p>No. TraceHub deliberately does not use GPS or IoT tracking hardware. Location is tracked
      via <strong>checkpoint scanning</strong> \u2014 an asset's location updates when someone
      actually scans its QR code at a location, using nothing more than a phone camera. This is a
      cost-effective, software-only design choice: no hardware to buy, install, or maintain. The
      trade-off is honest and worth understanding: an asset's shown location is wherever it was
      <em>last scanned</em>, not a live, continuously-updating position.</p>
    `,
  },
];


// ===================== GLOSSARY =====================
const glossary = [
  {
    title: 'Glossary of terms',
    slug: 'glossary-of-terms',
    category: 'Reference', categorySortOrder: 11, sortOrder: 0,
    excerpt: 'Every TraceHub-specific term in one place \u2014 updated as the platform grows.',
    bodyHtml: `
      <div class="th-legal-callout">This glossary is kept accurate as of the current build, not
      frozen at launch \u2014 as new features and terms are added to TraceHub, this page is updated
      alongside them.</div>

      <h3 style="margin-top:1.5rem;">Scores &amp; engines</h3>
      <dl>
        <dt><strong>Health Score</strong></dt><dd>0-100 weighted composite of age, maintenance, repairs, usage, inspection, and environment. See <a href="/docs/asset-health-score">Asset Health Score</a>.</dd>
        <dt><strong>Health tiers</strong></dt><dd>The five bands a Health Score falls into: Excellent (90-100), Healthy (75-89), Needs Attention (60-74), High Risk (40-59), Critical (below 40).</dd>
        <dt><strong>Risk Score</strong></dt><dd>0-100 overall risk index behind the four failure-probability horizons (30/60/90/180 days).</dd>
        <dt><strong>Disposal Readiness Score</strong></dt><dd>0-100 score behind the KEEP/REPAIR/SELL/SCRAP/REPLACE recommendation.</dd>
        <dt><strong>AI Confidence Score</strong></dt><dd>How much real evidence backs a given asset's scores \u2014 fields populated, maintenance records, inspection data, market value.</dd>
        <dt><strong>AI Learning Loop</strong></dt><dd>Tracks whether ignoring a disposal recommendation was later followed by a real failure, feeding a bounded adjustment back into future confidence.</dd>
        <dt><strong>AI Insights Panel</strong></dt><dd>Five rule-based pattern detectors on the Dashboard \u2014 see <a href="/docs/ai-insights-panel-detectors-explained">the full breakdown</a>.</dd>
        <dt><strong>Maintenance Scheduling Engine / Next Service Date</strong></dt><dd>A real predicted date an asset is next due for service, based on usage intensity and current health.</dd>
        <dt><strong>Custom Formula</strong></dt><dd>A user-written depreciation formula using a safe, restricted arithmetic parser \u2014 no code execution.</dd>
      </dl>

      <h3>Portfolio-level (Fleet Intelligence panel)</h3>
      <dl>
        <dt><strong>Portfolio Health</strong></dt><dd>Fleet-wide weighted average across health tiers.</dd>
        <dt><strong>Capital Risk</strong></dt><dd>% of total fleet <em>value</em> (not asset count) sitting in High Risk/Critical health-tier assets.</dd>
        <dt><strong>Asset Availability</strong></dt><dd>% of your fleet currently in "Available" status.</dd>
        <dt><strong>Fleet Grade</strong></dt><dd>A-F composite letter grade from Portfolio Health, Asset Availability, and Capital Risk.</dd>
        <dt><strong>Executive Heat Map</strong></dt><dd>Clickable health-tier breakdown on the Dashboard, linking to a filtered Assets list.</dd>
        <dt><strong>Projected Savings</strong></dt><dd>Real maintenance/repair spend so far on assets already recommended for replacement, scrap, or sale.</dd>
      </dl>

      <h3>Asset status</h3>
      <dl>
        <dt><strong>Available / Assigned / In maintenance / Reserved / Disposed / Lost</strong></dt>
        <dd>The six possible statuses an asset can have \u2014 see <a href="/docs/understanding-asset-status">Understanding asset status</a>.</dd>
        <dt><strong>Idle asset</strong></dt><dd>An asset in "Available" status that has logged 200+ idle hours \u2014 a candidate for reassignment or sale.</dd>
      </dl>

      <h3>Tracking &amp; workflow</h3>
      <dl>
        <dt><strong>Checkpoint</strong></dt><dd>A Location \u2014 a warehouse, branch, or site \u2014 that assets get scanned into and out of.</dd>
        <dt><strong>Disposal case</strong></dt><dd>A formal record tracking an asset through the six-stage disposal workflow.</dd>
        <dt><strong>Disposal stages</strong></dt><dd>Flagged \u2192 Manager review \u2192 Finance review \u2192 Approved \u2192 (Auction/Sale/Donation/Scrap/Recycle) \u2192 Disposed. A case can also be Rejected at any stage.</dd>
        <dt><strong>Assignment status</strong></dt><dd>Active, Overdue, Returned, or Cancelled.</dd>
        <dt><strong>Hire fee</strong></dt><dd>An optional charge tracked on an assignment when equipment is rented out, with a Paid/Unpaid toggle.</dd>
        <dt><strong>Audit log</strong></dt><dd>A real, timestamped record of every meaningful action in your workspace.</dd>
      </dl>

      <h3>Roles &amp; security</h3>
      <dl>
        <dt><strong>Company Admin / Manager / Staff</strong></dt><dd>The three roles \u2014 see <a href="/docs/roles-and-permissions">Roles and permissions</a>.</dd>
        <dt><strong>Two-factor authentication (2FA)</strong></dt><dd>An optional extra login step via any authenticator app.</dd>
        <dt><strong>Pending first login</strong></dt><dd>A team-member status shown until they complete the mandatory temporary-password setup.</dd>
      </dl>

      <h3>Billing</h3>
      <dl>
        <dt><strong>Trial / Basic / Pro / Enterprise</strong></dt><dd>The subscription tiers, each with its own asset and user limits.</dd>
        <dt><strong>Subscription status</strong></dt><dd>Trialing, Active, Past due, Cancelled, or Expired.</dd>
        <dt><strong>Coupon</strong></dt><dd>A discount code (percentage or fixed amount) a Super Admin can create for new sign-ups.</dd>
      </dl>

      <p style="margin-top:1.5rem;font-size:0.85rem;color:#6B7280;">Missing a term you'd expect to see here? Ask the AI Assistant, or let your workspace's Company Admin know so it can be added.</p>
    `,
  },
];


// ===================== MORE DEPTH: DISPOSAL, TEAM, REPORTS, BILLING, ASSETS =====================
const moreDisposal = [
  {
    title: 'Rejecting a disposal case',
    slug: 'rejecting-a-disposal-case',
    category: 'Disposal Workflow', categorySortOrder: 5, sortOrder: 2,
    excerpt: 'What happens when you decide to keep an asset the engine recommended disposing of.',
    bodyHtml: `
      <p>At any stage, a disposal case can be rejected with a required reason \u2014 a legitimate
      business decision, not a system failure. Common reasons: cash flow timing, a planned fleet
      refresh next quarter, or genuine confidence the asset will keep performing despite the
      numbers.</p>
      <p>Rejecting a case quietly feeds the <strong>AI Learning Loop</strong>: TraceHub notes the
      asset's incident count at that moment and checks back 30 days later whether a real failure
      followed. Over time, this builds your company's own recommendation reliability rate, visible
      on the Dashboard's Learning Loop panel once enough history exists (at least 5 evaluated
      rejections) \u2014 see
      <a href="/docs/ai-confidence-score-and-learning-loop">AI Confidence Score and the Learning Loop</a>.</p>
    `,
  },
];

const moreTeamSecurity = [
  {
    title: 'Disabling or removing a team member',
    slug: 'disabling-removing-team-member',
    category: 'Team & Security', categorySortOrder: 6, sortOrder: 4,
    excerpt: 'The difference between disabling and permanently removing access.',
    bodyHtml: `
      <p>From <strong>Team</strong>, a Company Admin can <strong>disable</strong> a member \u2014
      blocking their login immediately while preserving their history (who they were, what they did,
      past assignments) \u2014 or <strong>remove</strong> them entirely. Disabling is the right choice
      for someone leaving temporarily or under review; removal is for someone who's genuinely gone
      and won't be back.</p>
    `,
  },
  {
    title: 'How login and sessions work',
    slug: 'how-login-and-sessions-work',
    category: 'Team & Security', categorySortOrder: 6, sortOrder: 5,
    excerpt: 'Access tokens, refresh tokens, and what "staying logged in" actually means.',
    bodyHtml: `
      <p>When you log in, TraceHub issues two tokens stored in your browser's local storage: a
      short-lived access token used for every request, and a longer-lived refresh token used to
      silently obtain a new access token when the first one expires \u2014 which is why you generally
      stay logged in across visits without re-entering your password constantly. Logging out, or
      clearing your browser's local storage, ends the session. See the
      <a href="/pages/cookie-policy">Cookie Policy</a> for exactly what's stored and why.</p>
    `,
  },
];

const moreReports = [
  {
    title: 'PDF export in detail',
    slug: 'pdf-export-in-detail',
    category: 'Reports & Exporting', categorySortOrder: 7, sortOrder: 4,
    excerpt: 'What a generated PDF actually contains.',
    bodyHtml: `
      <p>PDF exports are branded, multi-section, and paginated \u2014 a title and subtitle (your
      company name and generation date), followed by one formatted table per report section. They
      generate entirely in your browser, so no data leaves your machine to a third-party rendering
      service to produce the file.</p>
    `,
  },
  {
    title: 'PowerPoint export in detail',
    slug: 'powerpoint-export-in-detail',
    category: 'Reports & Exporting', categorySortOrder: 7, sortOrder: 5,
    excerpt: 'A real presentation deck, not a spreadsheet dumped into slides.',
    bodyHtml: `
      <p>The PowerPoint option builds an actual presentation: a branded title slide, followed by one
      slide per report section with a properly formatted table (not an image of one) \u2014 built to
      be handed directly to leadership without you reformatting anything. Tables longer than 14 rows
      are truncated on the slide with a note pointing to the full CSV export for the complete data.</p>
    `,
  },
  {
    title: 'CSV export in detail',
    slug: 'csv-export-in-detail',
    category: 'Reports & Exporting', categorySortOrder: 7, sortOrder: 6,
    excerpt: 'The most complete, most portable export format.',
    bodyHtml: `
      <p>CSV export is the most complete format \u2014 unlike PDF/PowerPoint, it's never truncated for
      length, making it the right choice when you need every row of a large report (for example, a
      full year's location activity log) rather than a presentation-ready summary.</p>
    `,
  },
];

const moreBilling = [
  {
    title: 'What happens if a payment fails',
    slug: 'what-happens-if-payment-fails',
    category: 'Billing & Subscriptions', categorySortOrder: 8, sortOrder: 2,
    excerpt: 'Your data is never deleted for a failed charge.',
    bodyHtml: `
      <p>If an automatic renewal payment fails, TraceHub attempts to notify you and may temporarily
      restrict access to paid-tier features until it's resolved \u2014 but your data is never deleted
      as a result of a failed payment. Update your payment method and retry from
      <strong>Billing</strong>.</p>
    `,
  },
];

const moreAssets = [
  {
    title: 'Editing an existing asset',
    slug: 'editing-an-existing-asset',
    category: 'Managing Assets', categorySortOrder: 1, sortOrder: 5,
    excerpt: 'What updating triggers automatically.',
    bodyHtml: `
      <p>Open any asset and click Edit. Any change \u2014 a new maintenance count, an updated market
      value, a corrected purchase price \u2014 triggers an immediate recalculation of the entire
      Intelligence Engine for that asset: depreciation, health, failure risk, maintenance schedule,
      and disposal recommendation all update together, not independently.</p>
    `,
  },
  {
    title: 'Bulk filtering the Assets list',
    slug: 'bulk-filtering-assets-list',
    category: 'Managing Assets', categorySortOrder: 1, sortOrder: 6,
    excerpt: 'Search, status, category, location, and health-tier filters together.',
    bodyHtml: `
      <p>The Assets list supports combining a text search (name, tag, serial, brand) with status,
      category, and location filters simultaneously \u2014 useful for a question like "show me all
      available laptops at the Accra warehouse." Clicking a segment of the Dashboard's Executive
      Heat Map also lands here pre-filtered to a specific health tier.</p>
    `,
  },
];


const defaultDocArticles = [
  ...gettingStarted,
  ...managingAssets,
  ...moreAssets,
  ...intelligenceEngine,
  ...intelligenceEngineExpanded,
  ...aiAssistant,
  ...trackingScanning,
  ...assignments,
  ...disposalWorkflow,
  ...moreDisposal,
  ...teamSecurity,
  ...moreTeamSecurity,
  ...reportsExporting,
  ...moreReports,
  ...billing,
  ...moreBilling,
  ...superAdmin,
  ...troubleshooting,
  ...glossary,
];

const frenchGettingStarted = require('./docArticles.fr-getting-started');
const frenchManagingAssets = require('./docArticles.fr-managing-assets');
const frenchIntelligenceEngine = require('./docArticles.fr-intelligence-engine');

module.exports = {
  defaultDocArticles: [
    ...defaultDocArticles.map((a) => ({ locale: 'en', ...a })),
    ...frenchGettingStarted,
    ...frenchManagingAssets,
    ...frenchIntelligenceEngine,
  ],
};
