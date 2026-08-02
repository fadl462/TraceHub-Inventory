module.exports = [
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    showInFooter: true,
    isPublished: true,
    bodyHtml: `
      <p class="th-legal-updated">Last updated: August 2, 2026</p>

      <p>TraceHub Inventory ("TraceHub", "we", "us", "our") provides multi-tenant asset and
      inventory management software to organizations ("Customers", "you") and their authorized
      users. This Privacy Policy explains what information we collect, why we collect it, how
      it's used, and the choices you have \u2014 in plain language, without legal filler.</p>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">1</span> Information we collect</h3>
        <p><strong>Account and profile information.</strong> Name, email address, phone number,
        role, and password (stored as a salted hash \u2014 we never see or store your plaintext
        password) when you or your Company Admin create an account.</p>
        <p><strong>Company/workspace information.</strong> Your organization's name, industry,
        currency, and billing details entered when a workspace is created.</p>
        <p><strong>Asset and operational data.</strong> Everything you register about your
        equipment \u2014 names, categories, purchase prices, maintenance history, photos, custom
        fields \u2014 and the checkpoint scans, assignments, and disposal records your team creates
        while using the platform.</p>
        <p><strong>Location-checkpoint data.</strong> When a team member scans an asset's QR code,
        we record which checkpoint (warehouse, branch, site) it was scanned at and when.</p>
        <div class="th-legal-callout"><strong>Important:</strong> TraceHub does not use continuous
        GPS tracking or install any tracking hardware \u2014 location data only updates when a
        deliberate scan happens.</div>
        <p style="margin-top:0.9rem;"><strong>Usage and security logs.</strong> Sign-in timestamps,
        IP address, and an audit trail of meaningful actions (who created, edited, or deleted
        what) \u2014 kept for account security, abuse prevention, and so your Company Admin can
        answer "who changed this."</p>
        <p><strong>Payment information.</strong> Subscription payments are processed by
        <strong>Flutterwave</strong>. TraceHub does not receive or store your full card number \u2014
        Flutterwave handles payment collection directly and shares only what's needed to confirm a
        successful charge (amount, plan, transaction reference).</p>
        <p><strong>Two-factor authentication data.</strong> If you enable 2FA, we store the
        authentication secret needed to verify your codes. We do not have access to your
        authenticator app itself.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">2</span> How we use your information</h3>
        <ul>
          <li>To operate your workspace and provide the features you're actively using \u2014
          depreciation calculations, health scoring, disposal recommendations, assignment
          tracking, and reporting.</li>
          <li>To send transactional email: password resets, two-factor setup, staff invitations,
          assignment return reminders, and overdue-asset alerts.</li>
          <li>To detect and prevent fraud, abuse, or unauthorized access to your workspace.</li>
          <li>To generate AI-assisted summaries and insights. Where the platform's AI features
          call a third-party language model provider, we send only the aggregated statistics or
          specific asset data needed to answer the request \u2014 not your full database, and not
          other customers' data.</li>
          <li>To improve the platform based on aggregate, de-identified usage patterns.</li>
        </ul>
        <div class="th-legal-callout"><strong>We do not sell your data</strong>, and we do not use
        it to train third-party advertising profiles.</div>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">3</span> Your data stays isolated to your company</h3>
        <p>TraceHub is multi-tenant: every asset, user, and record is scoped to a single company
        at the database level. Users and administrators from one company cannot see another
        company's data. TraceHub's own Super Admin role can access platform-level operational
        data (subscription status, usage counts) to run the service, but does not use your
        operational asset data for any purpose beyond support and platform operation.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">4</span> Data retention and deletion</h3>
        <p>We retain your data for as long as your workspace is active. If you cancel your
        subscription, your data remains accessible for a reasonable grace period in case you wish
        to reactivate, after which it may be deleted. Company Admins can request export or
        deletion of their workspace's data at any time by contacting us.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">5</span> Your rights</h3>
        <p>Depending on where you're located, you may have rights to access, correct, export, or
        request deletion of your personal information. To exercise these rights, contact your
        Company Admin (for data your organization controls) or reach us directly using the
        contact details on our website.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">6</span> Children's privacy</h3>
        <p>TraceHub is a business tool and is not directed at, or knowingly used by, children
        under 16. We do not knowingly collect personal information from children.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">7</span> Changes to this policy</h3>
        <p>We'll update the "Last updated" date above whenever this policy changes, and post the
        revised version here. Material changes will be communicated to Company Admins by email.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">8</span> Contact us</h3>
        <p>Questions about this policy or your data can be directed to your workspace's Company
        Admin or to TraceHub support through the channels listed on our website.</p>
      </div>

      <p class="th-legal-disclaimer">This policy is intended to accurately describe how TraceHub
      Inventory actually handles data as of the date above. It is not a substitute for legal
      advice \u2014 if you operate in a jurisdiction with specific regulatory requirements (GDPR,
      Ghana's Data Protection Act, CCPA, or similar), have qualified legal counsel review this
      policy before relying on it for compliance purposes.</p>
    `,
  },
  {
    title: 'Terms of Service',
    slug: 'terms-of-service',
    showInFooter: true,
    isPublished: true,
    bodyHtml: `
      <p class="th-legal-updated">Last updated: August 2, 2026</p>

      <p>These Terms of Service ("Terms") govern access to and use of TraceHub Inventory (the
      "Service"). By creating a workspace or accepting an invitation to join one, you agree to
      these Terms on behalf of yourself and, if applicable, your organization.</p>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">1</span> Accounts and eligibility</h3>
        <p>You must provide accurate information when creating an account and keep your login
        credentials \u2014 including any temporary password issued at invitation \u2014 confidential.
        You're responsible for all activity that happens under your account. Company Admins are
        responsible for managing who has access to their workspace and at what permission
        level.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">2</span> Subscription plans and billing</h3>
        <p>TraceHub offers a free trial and paid subscription tiers (Basic, Pro, Enterprise), each
        with its own asset and user limits. Paid plans are billed in USD and processed through
        Flutterwave.</p>
        <div class="th-legal-callout"><strong>Auto-renewal:</strong> unless cancelled,
        subscriptions renew automatically at the end of each billing cycle. You can cancel
        auto-renewal at any time from your workspace's Billing page \u2014 your plan remains active
        and fully functional until the end of the period you've already paid for.</div>
        <p style="margin-top:0.9rem;">If a payment fails, we'll attempt to notify you and may
        temporarily restrict access to paid features until the issue is resolved, without
        deleting your data.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">3</span> Your data and content</h3>
        <p><strong>You (or your organization) own</strong> the asset, inventory, and operational
        data you enter into TraceHub. We don't claim ownership of it, and we don't use it for any
        purpose other than providing and improving the Service as described in our Privacy
        Policy. You're responsible for the accuracy of the data you enter \u2014 including
        depreciation inputs, purchase prices, and any figures used in the platform's automated
        calculations.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">4</span> Acceptable use</h3>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service to store, track, or process anything illegal.</li>
          <li>Attempt to access another company's workspace data, or circumvent the multi-tenant
          access controls that keep workspaces isolated.</li>
          <li>Reverse-engineer, scrape, or attempt to extract the underlying software, or use
          automated means to overload the Service.</li>
          <li>Use the Service to send spam, malware, or content that infringes someone else's
          intellectual property.</li>
          <li>Misuse the QR-scanning or assignment features to misrepresent the location,
          custody, or condition of an asset.</li>
        </ul>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">5</span> AI-generated content</h3>
        <p>TraceHub's AI features (executive recommendations, disposal suggestions, the chat
        assistant, dashboard insights) are generated from your own data using deterministic
        scoring models and, in some cases, a third-party language model.</p>
        <div class="th-legal-callout">These outputs are decision-support tools, <strong>not
        guarantees</strong> \u2014 you remain responsible for the business decisions you make based
        on them, including asset disposal, repair, and financial decisions.</div>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">6</span> Service availability</h3>
        <p>We aim to keep TraceHub available and reliable, but the Service is provided "as is"
        without a guaranteed uptime commitment unless a separate written service-level agreement
        is in place between you and TraceHub. We may perform scheduled maintenance and will make
        reasonable efforts to minimize disruption.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">7</span> Limitation of liability</h3>
        <p>To the maximum extent permitted by law, TraceHub is not liable for indirect,
        incidental, or consequential damages arising from use of the Service, including decisions
        made based on depreciation estimates, health scores, or disposal recommendations the
        platform generates. Our total liability for any claim relating to the Service is limited
        to the amount you paid us in the twelve months preceding the claim.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">8</span> Termination</h3>
        <p>You may cancel your subscription at any time. We may suspend or terminate access to
        the Service for accounts that violate these Terms, including the acceptable-use
        provisions above, after reasonable notice where practical.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">9</span> Governing law</h3>
        <p>These Terms are governed by the laws of the Republic of Ghana, without regard to
        conflict-of-law principles, unless a separate signed agreement between you and TraceHub
        specifies otherwise.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">10</span> Changes to these Terms</h3>
        <p>We'll update the "Last updated" date above when these Terms change, and notify Company
        Admins of material changes by email. Continued use of the Service after a change takes
        effect constitutes acceptance of the revised Terms.</p>
      </div>

      <p class="th-legal-disclaimer">This is a genuine, comprehensive draft written to accurately
      reflect how TraceHub Inventory actually operates as of the date above \u2014 not placeholder
      text. It is not a substitute for legal advice specific to your jurisdiction; have qualified
      legal counsel review it before relying on it for a public launch.</p>
    `,
  },
  {
    title: 'Cookie Policy',
    slug: 'cookie-policy',
    showInFooter: true,
    isPublished: true,
    bodyHtml: `
      <p class="th-legal-updated">Last updated: August 2, 2026</p>

      <p>This policy explains, precisely, what TraceHub Inventory actually stores in your browser
      \u2014 not a generic template.</p>

      <div class="th-legal-callout">As of the date above, TraceHub does not set any traditional
      HTTP cookies. Instead, it uses your browser's <strong>local storage</strong>, a similar
      browser-side storage mechanism, for a small, specific set of purposes.</div>

      <div class="th-legal-section" style="margin-top:1.1rem;">
        <h3><span class="th-legal-badge">1</span> What we store, and why</h3>
        <ul>
          <li><strong>Session tokens.</strong> When you log in, an access token and refresh token
          are stored in local storage so you stay signed in as you navigate the app, without
          re-entering your password on every page.</li>
          <li><strong>Interface preferences.</strong> Your chosen theme (Light, Dark, or Emerald)
          is remembered so the app looks the way you left it next time you visit.</li>
        </ul>
        <p>That's the complete list. We don't set advertising cookies, don't use third-party
        analytics trackers, and don't share browser storage data with ad networks \u2014 because we
        don't have any.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">2</span> Why local storage instead of cookies</h3>
        <p>Local storage keeps this data on your device and sent only to TraceHub's own servers
        when the app needs it (for example, attaching your session token to an API request) \u2014
        it isn't automatically transmitted with every request the way traditional cookies are, and
        it isn't accessible to other websites.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">3</span> Managing or clearing this data</h3>
        <p>You can clear local storage at any time through your browser's settings (usually under
        "Clear browsing data" or "Site settings"). Doing so will log you out and reset your theme
        preference to the default, but won't affect any data stored in your TraceHub workspace
        itself.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">4</span> Third-party services</h3>
        <p>Payment processing (Flutterwave) and, where enabled, email delivery happen through
        separate third-party services that may set their own cookies during checkout or in
        transactional emails, governed by their own privacy and cookie policies rather than this
        one.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">5</span> Changes to this policy</h3>
        <p>If TraceHub ever begins using additional cookies or storage mechanisms \u2014 for
        analytics or otherwise \u2014 we'll update this page and the "Last updated" date above
        rather than silently changing what's disclosed here.</p>
      </div>

      <p class="th-legal-disclaimer">This policy describes TraceHub's actual technical
      implementation as of the date above, not generic boilerplate. It is not a substitute for
      legal advice specific to your jurisdiction's cookie/consent requirements (such as the EU's
      ePrivacy rules) \u2014 have qualified legal counsel review it before relying on it for
      compliance purposes.</p>
    `,
  },
  {
    title: 'Documentation',
    slug: 'documentation',
    showInNav: false,
    showInFooter: true,
    isPublished: true,
    bodyHtml: `
      <p>A practical walkthrough of TraceHub Inventory, organized by what you're trying to do
      rather than by feature list. If something here doesn't match what you're seeing, use the AI
      assistant (the chat bubble in the corner) \u2014 it's grounded in this same content plus your
      live workspace data.</p>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">1</span> Getting started</h3>
        <p>Create a workspace from the "Get started free" button \u2014 you'll be the first Company
        Admin. From there, add your first asset from the <strong>Assets</strong> page. Entering a
        purchase price automatically triggers a depreciation estimate using your asset category's
        useful-life and scrap-value profile; you don't need a separate spreadsheet.</p>
        <div class="th-legal-callout"><strong>Tip:</strong> open the collapsible "Asset
        Intelligence Engine data" section on the Add Asset form to feed in maintenance history,
        usage intensity, and environmental conditions \u2014 the more of these you fill in, the more
        confident the AI's health and disposal recommendations become.</p></div>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">2</span> Tracking where assets actually are</h3>
        <p>Create checkpoints (a warehouse, a branch, a job site) under <strong>Locations</strong>.
        Every asset gets a unique QR code the moment it's registered \u2014 print or display it, and
        any team member can scan it with their phone camera from the <strong>Scan</strong> page (or
        by scanning the physical tag directly with their normal camera app) to check it in or out
        of a checkpoint.</p>
        <p>Worth knowing: TraceHub tracks location by <em>checkpoint scan</em>, not continuous GPS.
        An asset's "current location" is wherever it was last scanned into \u2014 it won't update
        again until the next scan.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">3</span> Assigning equipment to people</h3>
        <p>Use <strong>Assignments</strong> to hand equipment to a staff member or an outside
        contact. Set an expected return date and TraceHub handles the rest: a reminder email three
        days before it's due, another on the due date, and then a daily overdue alert to both the
        borrower and every Company Admin for as long as it stays out \u2014 with real day-counts, not
        vague nagging.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">4</span> Understanding the AI Intelligence Engine</h3>
        <p>Every asset is continuously scored across six real, deterministic engines \u2014 not a
        black box:</p>
        <ul>
          <li><strong>Depreciation</strong> \u2014 nine methods including straight line, declining
          balance, units of production, and a custom formula you define yourself.</li>
          <li><strong>Health Score (0-100)</strong> \u2014 weighted across age, maintenance,
          repairs, usage, inspection, and environment.</li>
          <li><strong>Failure Risk</strong> \u2014 probability of failure at 30/60/90/180 days.</li>
          <li><strong>Maintenance Scheduling</strong> \u2014 a real predicted next-service date, not
          a generic annual reminder.</li>
          <li><strong>Disposal Readiness</strong> \u2014 a KEEP/REPAIR/SELL/SCRAP/REPLACE
          recommendation with a plain-language executive summary.</li>
          <li><strong>AI Learning Loop</strong> \u2014 tracks whether ignoring a disposal
          recommendation was later followed by a real failure, and feeds that back into future
          confidence scores for your company specifically.</li>
        </ul>
        <p>You can see the full breakdown \u2014 not just the final number \u2014 on any asset's
        detail page.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">5</span> When an asset's time is up</h3>
        <p><strong>Disposal cases</strong> follow a real six-stage workflow: Flagged \u2192 Manager
        review \u2192 Finance review \u2192 Approved \u2192 Auction/Sale/Donation/Scrap/Recycle \u2192
        Disposed, with role-based approval gates and a full audit trail at every step. You can flag
        an asset directly from its detail page whenever the engine recommends it.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">6</span> Team, roles, and security</h3>
        <p>Invite teammates from <strong>Team</strong> as Manager or Staff. New team members log in
        with a system-generated temporary password and are required to set their own password
        before they can access anything else \u2014 with an option to enable two-factor
        authentication right there during that first login. You (and they) can turn 2FA on or off
        later from <strong>Settings</strong>.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:0.75rem;font-size:0.88rem;">
          <thead><tr style="text-align:left;border-bottom:1px solid #E2E8F0;">
            <th style="padding:0.4rem 0.5rem;">Role</th><th style="padding:0.4rem 0.5rem;">Can do</th>
          </tr></thead>
          <tbody>
            <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.4rem 0.5rem;"><strong>Company Admin</strong></td><td style="padding:0.4rem 0.5rem;">Everything, including billing, team management, and disposal approvals.</td></tr>
            <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.4rem 0.5rem;"><strong>Manager</strong></td><td style="padding:0.4rem 0.5rem;">Assets, assignments, disposal workflow, reports \u2014 no billing or team management.</td></tr>
            <tr><td style="padding:0.4rem 0.5rem;"><strong>Staff</strong></td><td style="padding:0.4rem 0.5rem;">Register and scan assets, view assignments \u2014 day-to-day operational access.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">7</span> Reports and exporting for leadership</h3>
        <p>The <strong>Reports</strong> page covers category breakdowns, depreciation, and
        location activity, with CSV, PDF, and PowerPoint export on each. The Dashboard's "Assets
        currently assigned" panel and AI Insights Panel export the same way \u2014 the PowerPoint
        option builds an actual presentation deck (title slide + formatted tables), ready to hand
        to management without reformatting anything.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">8</span> Need help?</h3>
        <p>Use the AI assistant (the chat bubble, bottom-right, on both the public site and inside
        your workspace) for instant answers grounded in your live data, or contact your
        workspace's Company Admin.</p>
      </div>
    `,
  },
];
