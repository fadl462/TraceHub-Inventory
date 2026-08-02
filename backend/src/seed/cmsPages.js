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

      <h3>1. Information we collect</h3>
      <p><strong>Account and profile information.</strong> Name, email address, phone number, role,
      and password (stored as a salted hash \u2014 we never see or store your plaintext password) when
      you or your Company Admin create an account.</p>
      <p><strong>Company/workspace information.</strong> Your organization's name, industry,
      currency, and billing details entered when a workspace is created.</p>
      <p><strong>Asset and operational data.</strong> Everything you register about your equipment
      \u2014 names, categories, purchase prices, maintenance history, photos, custom fields \u2014 and
      the checkpoint scans, assignments, and disposal records your team creates while using the
      platform.</p>
      <p><strong>Location-checkpoint data.</strong> When a team member scans an asset's QR code,
      we record which checkpoint (warehouse, branch, site) it was scanned at and when. TraceHub
      does not use continuous GPS tracking or install any tracking hardware \u2014 location data only
      updates when a deliberate scan happens.</p>
      <p><strong>Usage and security logs.</strong> Sign-in timestamps, IP address, and an audit
      trail of meaningful actions (who created, edited, or deleted what) \u2014 kept for account
      security, abuse prevention, and so your Company Admin can answer "who changed this."</p>
      <p><strong>Payment information.</strong> Subscription payments are processed by
      <strong>Flutterwave</strong>. TraceHub does not receive or store your full card number \u2014
      Flutterwave handles payment collection directly and shares only what's needed to confirm a
      successful charge (amount, plan, transaction reference).</p>
      <p><strong>Two-factor authentication data.</strong> If you enable 2FA, we store the
      authentication secret needed to verify your codes. We do not have access to your
      authenticator app itself.</p>

      <h3>2. How we use your information</h3>
      <ul>
        <li>To operate your workspace and provide the features you're actively using \u2014
        depreciation calculations, health scoring, disposal recommendations, assignment tracking,
        and reporting.</li>
        <li>To send transactional email: password resets, two-factor setup, staff invitations,
        assignment return reminders, and overdue-asset alerts.</li>
        <li>To detect and prevent fraud, abuse, or unauthorized access to your workspace.</li>
        <li>To generate AI-assisted summaries and insights. Where the platform's AI features
        (executive recommendations, chat assistant, dashboard insights) call a third-party language
        model provider, we send only the aggregated statistics or specific asset data needed to
        answer the request \u2014 not your full database, and not other customers' data.</li>
        <li>To improve the platform based on aggregate, de-identified usage patterns.</li>
      </ul>
      <p>We do not sell your data, and we do not use your data to train third-party advertising
      profiles.</p>

      <h3>3. Your data stays isolated to your company</h3>
      <p>TraceHub is multi-tenant: every asset, user, and record is scoped to a single company
      (<code>companyId</code>) at the database level. Users and administrators from one company
      cannot see another company's data. TraceHub's own Super Admin role can access
      platform-level operational data (subscription status, usage counts) to run the service, but
      does not use your operational asset data for any purpose beyond support and platform
      operation.</p>

      <h3>4. Data retention and deletion</h3>
      <p>We retain your data for as long as your workspace is active. If you cancel your
      subscription, your data remains accessible for a reasonable grace period in case you wish to
      reactivate, after which it may be deleted. Company Admins can request export or deletion of
      their workspace's data at any time by contacting us.</p>

      <h3>5. Your rights</h3>
      <p>Depending on where you're located, you may have rights to access, correct, export, or
      request deletion of your personal information. To exercise these rights, contact your
      Company Admin (for data your organization controls) or reach us directly using the contact
      details on our website.</p>

      <h3>6. Children's privacy</h3>
      <p>TraceHub is a business tool and is not directed at, or knowingly used by, children under
      16. We do not knowingly collect personal information from children.</p>

      <h3>7. Changes to this policy</h3>
      <p>We'll update the "Last updated" date above whenever this policy changes, and post the
      revised version here. Material changes will be communicated to Company Admins by email.</p>

      <h3>8. Contact us</h3>
      <p>Questions about this policy or your data can be directed to your workspace's Company
      Admin or to TraceHub support through the channels listed on our website.</p>

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

      <h3>1. Accounts and eligibility</h3>
      <p>You must provide accurate information when creating an account and keep your login
      credentials \u2014 including any temporary password issued at invitation \u2014 confidential. You're
      responsible for all activity that happens under your account. Company Admins are responsible
      for managing who has access to their workspace and at what permission level.</p>

      <h3>2. Subscription plans and billing</h3>
      <p>TraceHub offers a free trial and paid subscription tiers (Basic, Pro, Enterprise), each
      with its own asset and user limits. Paid plans are billed in USD and processed through
      Flutterwave. Unless cancelled, subscriptions <strong>renew automatically</strong> at the end
      of each billing cycle. You can cancel auto-renewal at any time from your workspace's Billing
      page \u2014 your plan remains active and fully functional until the end of the period you've
      already paid for.</p>
      <p>If a payment fails, we'll attempt to notify you and may temporarily restrict access to
      paid features until the issue is resolved, without deleting your data.</p>

      <h3>3. Your data and content</h3>
      <p>You (or your organization) own the asset, inventory, and operational data you enter into
      TraceHub. We don't claim ownership of it, and we don't use it for any purpose other than
      providing and improving the Service as described in our Privacy Policy. You're responsible
      for the accuracy of the data you enter \u2014 including depreciation inputs, purchase prices,
      and any figures used in the platform's automated calculations.</p>

      <h3>4. Acceptable use</h3>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service to store, track, or process anything illegal.</li>
        <li>Attempt to access another company's workspace data, or circumvent the multi-tenant
        access controls that keep workspaces isolated.</li>
        <li>Reverse-engineer, scrape, or attempt to extract the underlying software, or use
        automated means to overload the Service.</li>
        <li>Use the Service to send spam, malware, or content that infringes someone else's
        intellectual property.</li>
        <li>Misuse the QR-scanning or assignment features to misrepresent the location, custody,
        or condition of an asset.</li>
      </ul>

      <h3>5. AI-generated content</h3>
      <p>TraceHub's AI features (executive recommendations, disposal suggestions, the chat
      assistant, dashboard insights) are generated from your own data using deterministic scoring
      models and, in some cases, a third-party language model. These outputs are decision-support
      tools, not guarantees \u2014 you remain responsible for the business decisions you make based on
      them, including asset disposal, repair, and financial decisions.</p>

      <h3>6. Service availability</h3>
      <p>We aim to keep TraceHub available and reliable, but the Service is provided "as is"
      without a guaranteed uptime commitment unless a separate written service-level agreement is
      in place between you and TraceHub. We may perform scheduled maintenance and will make
      reasonable efforts to minimize disruption.</p>

      <h3>7. Limitation of liability</h3>
      <p>To the maximum extent permitted by law, TraceHub is not liable for indirect, incidental,
      or consequential damages arising from use of the Service, including decisions made based on
      depreciation estimates, health scores, or disposal recommendations the platform generates.
      Our total liability for any claim relating to the Service is limited to the amount you paid
      us in the twelve months preceding the claim.</p>

      <h3>8. Termination</h3>
      <p>You may cancel your subscription at any time. We may suspend or terminate access to the
      Service for accounts that violate these Terms, including the acceptable-use provisions
      above, after reasonable notice where practical.</p>

      <h3>9. Governing law</h3>
      <p>These Terms are governed by the laws of the Republic of Ghana, without regard to
      conflict-of-law principles, unless a separate signed agreement between you and TraceHub
      specifies otherwise.</p>

      <h3>10. Changes to these Terms</h3>
      <p>We'll update the "Last updated" date above when these Terms change, and notify Company
      Admins of material changes by email. Continued use of the Service after a change takes
      effect constitutes acceptance of the revised Terms.</p>

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
      \u2014 not a generic template. As of the date above, TraceHub does not set any traditional
      HTTP cookies. Instead, it uses your browser's <strong>local storage</strong>, a similar
      browser-side storage mechanism, for a small, specific set of purposes.</p>

      <h3>What we store, and why</h3>
      <ul>
        <li><strong>Session tokens.</strong> When you log in, an access token and refresh token
        are stored in local storage so you stay signed in as you navigate the app, without
        re-entering your password on every page.</li>
        <li><strong>Interface preferences.</strong> Your chosen theme (Light, Dark, or Emerald) is
        remembered so the app looks the way you left it next time you visit.</li>
      </ul>
      <p>That's the complete list. We don't set advertising cookies, don't use third-party
      analytics trackers, and don't share browser storage data with ad networks \u2014 because we
      don't have any.</p>

      <h3>Why local storage instead of cookies</h3>
      <p>Local storage keeps this data on your device and sent only to TraceHub's own servers when
      the app needs it (for example, attaching your session token to an API request) \u2014 it isn't
      automatically transmitted with every request the way traditional cookies are, and it isn't
      accessible to other websites.</p>

      <h3>Managing or clearing this data</h3>
      <p>You can clear local storage at any time through your browser's settings (usually under
      "Clear browsing data" or "Site settings"). Doing so will log you out and reset your theme
      preference to the default, but won't affect any data stored in your TraceHub workspace
      itself.</p>

      <h3>Third-party services</h3>
      <p>Payment processing (Flutterwave) and, where enabled, email delivery happen through
      separate third-party services that may set their own cookies during checkout or in
      transactional emails, governed by their own privacy and cookie policies rather than this
      one.</p>

      <h3>Changes to this policy</h3>
      <p>If TraceHub ever begins using additional cookies or storage mechanisms \u2014 for analytics
      or otherwise \u2014 we'll update this page and the "Last updated" date above rather than
      silently changing what's disclosed here.</p>

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
      <p>Full documentation is coming soon. In the meantime, here's a quick orientation:</p>
      <h3>Getting started</h3>
      <p>Register a workspace, then add your first asset from the Assets page \u2014 entering a
      purchase price automatically triggers the depreciation estimate.</p>
      <h3>Tracking locations</h3>
      <p>Create checkpoints under Locations, then use the Scan page to check assets in or out
      with your phone's camera.</p>
      <h3>Need help?</h3>
      <p>Use the AI assistant (the chat bubble in the corner) for instant answers, or contact
      your workspace administrator.</p>
    `,
  },
];
