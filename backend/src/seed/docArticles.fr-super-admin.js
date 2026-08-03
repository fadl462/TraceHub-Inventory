const frenchSuperAdmin = [
  {
    title: 'Gérer les entreprises locataires',
    slug: 'managing-tenant-companies',
    locale: 'fr',
    category: 'Pour les Super Admins', categorySortOrder: 9, sortOrder: 0,
    excerpt: "La vue au niveau de la plateforme sur toutes les entreprises utilisant TraceHub.",
    bodyHtml: `
      <p>Les Super Admins disposent d'un portail complètement séparé (<code>/admin</code>) de
      l'application au niveau de l'entreprise, couvrant la plateforme dans son ensemble plutôt que
      les données d'un seul espace de travail. Depuis <strong>Entreprises</strong>, vous pouvez voir
      chaque entreprise locataire, son forfait, ses comptes d'actifs/utilisateurs, et son statut
      d'abonnement, et modifier directement le statut d'une entreprise (active/suspendue).</p>
      <p>Ouvrir une entreprise individuelle affiche sa propre page de détail \u2014 chiffres
      d'utilisation, utilisateurs, et historique d'abonnement \u2014 sans vous exposer, en tant que
      Super Admin, les véritables enregistrements d'actifs de cette entreprise ; les propres données
      opérationnelles de la plateforme sont séparées des données clients par conception, conformément
      à la politique de confidentialité.</p>
    `,
  },
  {
    title: 'Gestion du contenu CMS',
    slug: 'cms-content-management',
    locale: 'fr',
    category: 'Pour les Super Admins', categorySortOrder: 9, sortOrder: 1,
    excerpt: "Modifier la page d'accueil, les témoignages, les FAQ, et les pages légales/documentation.",
    bodyHtml: `
      <p>Tout sur le site marketing public est modifiable depuis le portail Super Admin sans
      changement de code :</p>
      <ul>
        <li><strong>Contenu de la page d'accueil et de connexion</strong> \u2014 le titre et le
        sous-titre de la page d'accueil.</li>
        <li><strong>Témoignages</strong> \u2014 les citations défilantes sur la page d'accueil.</li>
        <li><strong>FAQ</strong> \u2014 sert aussi de base de connaissances de l'assistant IA en mode
        marketing.</li>
        <li><strong>Liens de pied de page</strong> \u2014 ajoutez, retirez, ou réorganisez n'importe
        quel lien de pied de page.</li>
        <li><strong>Pages personnalisées</strong> \u2014 la politique de confidentialité, les
        conditions d'utilisation, et la politique de cookies sont toutes modifiables ici, ainsi que
        toute page supplémentaire que vous créez.</li>
        <li><strong>Blog / actualités</strong> \u2014 rédigez et publiez de nouveaux articles, modérez
        les commentaires.</li>
      </ul>
      <p>Tout le contenu CMS s'auto-répare lors d'un nouveau réensemencement pour un petit ensemble de
      pages « gérées » (les pages légales et cette documentation) \u2014 ce qui signifie que les mises
      à jour de contenu fournies par la plateforme atteignent automatiquement une installation déjà
      en cours d'exécution, tandis que les modifications personnalisées apportées à des pages non
      liées ne sont jamais écrasées silencieusement.</p>
    `,
  },
  {
    title: 'Configuration e-mail / SMTP',
    slug: 'email-smtp-configuration',
    locale: 'fr',
    category: 'Pour les Super Admins', categorySortOrder: 9, sortOrder: 2,
    excerpt: 'Pourquoi ceci doit être configuré avant que de vrais clients ne dépendent de la plateforme.',
    bodyHtml: `
      <p>Les réinitialisations de mot de passe, les invitations du personnel, et les alertes d'actifs
      en retard dépendent tous d'une véritable livraison d'e-mails. Configurez votre fournisseur SMTP
      depuis <strong>E-mail/SMTP</strong> dans le portail Super Admin \u2014 hôte, port, nom
      d'utilisateur, mot de passe, et nom de l'expéditeur.</p>
      <div class="th-legal-callout"><strong>Important :</strong> sans fournisseur SMTP configuré,
      TraceHub n'échoue pas bruyamment \u2014 il enregistre silencieusement ce qu'il « aurait envoyé »
      au lieu de le livrer réellement. Une véritable entreprise s'inscrivant cliquerait sur « mot de
      passe oublié » et ne recevrait rien, sans erreur visible. Configurez cela avant d'ouvrir la
      plateforme à de vrais utilisateurs.</div>
    `,
  },
  {
    title: 'Configuration des paiements / Flutterwave',
    slug: 'payment-flutterwave-configuration',
    locale: 'fr',
    category: 'Pour les Super Admins', categorySortOrder: 9, sortOrder: 3,
    excerpt: 'Mettre en place une véritable facturation d\u2019abonnement.',
    bodyHtml: `
      <p>La facturation des abonnements passe par Flutterwave. Configurez vos clés API Flutterwave
      depuis <strong>Paiements</strong> dans le portail Super Admin. Le webhook qui confirme les
      paiements réussis et échoués (et pilote le renouvellement automatique) est réel et vérifié par
      signature \u2014 pas une maquette \u2014 mais devrait être testé avec vos véritables identifiants
      Flutterwave de production avant de vous y fier pour la facturation réelle des clients, car le
      comportement en bac à sable/mode test peut différer de la production.</p>
    `,
  },
  {
    title: 'Gérer les forfaits et les codes de réduction',
    slug: 'managing-plans-and-coupons',
    locale: 'fr',
    category: 'Pour les Super Admins', categorySortOrder: 9, sortOrder: 4,
    excerpt: "Définir les niveaux d'abonnement et les codes de réduction.",
    bodyHtml: `
      <p>Depuis <strong>Forfaits</strong>, définissez le prix, le cycle de facturation, et les
      limites d'actifs/utilisateurs de chaque niveau d'abonnement \u2014 ce sont ceux que les
      entreprises voient et choisissent sur leur propre page Facturation. Depuis
      <strong>Codes de réduction</strong>, créez des codes de réduction avec une remise en pourcentage
      ou en montant fixe, une date d'expiration optionnelle, et une limite d'utilisation.</p>
    `,
  },
  {
    title: "Journal d'audit global et sécurité",
    slug: 'global-audit-log-and-security',
    locale: 'fr',
    category: 'Pour les Super Admins', categorySortOrder: 9, sortOrder: 5,
    excerpt: "Surveillance de l'activité à l'échelle de la plateforme.",
    bodyHtml: `
      <p>Le <strong>journal d'audit</strong> du Super Admin affiche les actions significatives à
      travers chaque entreprise sur la plateforme \u2014 connexions, transitions de dossiers de mise
      au rebut, changements de forfait \u2014 chacune avec un véritable horodatage et l'utilisateur
      agissant, exportable en CSV ou PDF. La page <strong>Sécurité</strong> couvre les paramètres de
      compte et de sécurité au niveau de la plateforme pour le compte Super Admin lui-même.</p>
    `,
  },
];

module.exports = frenchSuperAdmin;
