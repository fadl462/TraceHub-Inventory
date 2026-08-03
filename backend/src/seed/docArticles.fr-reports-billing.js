const frenchReportsBilling = [
  {
    title: 'Le tableau de bord expliqué',
    slug: 'the-dashboard-explained',
    locale: 'fr',
    category: 'Rapports et exportation', categorySortOrder: 7, sortOrder: 0,
    excerpt: 'Chaque panneau du tableau de bord et ce qu\u2019il affiche réellement.',
    bodyHtml: `
      <p>De haut en bas, le tableau de bord affiche :</p>
      <ul>
        <li><strong>Cartes KPI</strong> \u2014 total des actifs, affectations actives, retours en
        retard, et actifs à mettre au rebut dans les 90 jours.</li>
        <li><strong>Répartition du statut des actifs</strong> \u2014 comptes Disponible/Affecté/
        Maintenance/Mis au rebut.</li>
        <li><strong>Valeur du parc</strong> \u2014 valeur totale d'achat par rapport à la valeur
        actuelle estimée par l'IA.</li>
        <li><strong>Puces KPI d'intelligence</strong> \u2014 comptes Sain/Critique/Proche du
        rebut/Maintenance due/Garantie expirant/Actif inactif.</li>
        <li><strong>Projections de dépréciation et de remplacement</strong> \u2014 dépréciation du
        jour, perte mensuelle d'actifs, budget de remplacement nécessaire dès maintenant, coût de
        mise au rebut projeté, et un coût de remplacement projeté à 12 mois véritablement distinct.</li>
        <li><strong>Listes classées</strong> \u2014 actifs les plus précieux, les plus réparés, et les
        plus coûteux à entretenir.</li>
        <li><strong>Actifs actuellement affectés</strong> \u2014 qui a quoi, dates de délivrance/
        d'échéance, jours détenus (en rouge une fois en retard), et coordonnées de contact,
        exportable en CSV/PDF/PowerPoint.</li>
        <li><strong>Panneau d'intelligence du parc</strong> \u2014 agrégats au niveau du portefeuille :
        Santé du portefeuille, Disponibilité des actifs, Risque de capital, Risque financier/
        opérationnel, une note globale de parc de A à F, et une carte thermique exécutive cliquable
        (cliquez sur n'importe quel niveau de santé pour accéder à une liste d'actifs filtrée).</li>
        <li><strong>Panneau d'informations IA</strong> \u2014 tendances détectées selon des règles dans
        votre parc (une catégorie se dépréciant plus vite que prévu, un actif ayant dépassé son
        budget de maintenance), chacune étant une phrase réelle et calculée, pas un contenu générique
        pré-rédigé.</li>
        <li><strong>Panneau de boucle d'apprentissage IA</strong> \u2014 le propre taux de fiabilité
        des recommandations de votre entreprise, une fois qu'un historique suffisant existe pour en
        calculer un.</li>
      </ul>
      <p>Chaque chiffre ici découle de données réelles par actif \u2014 voir <strong>Formules
      d'intelligence du parc expliquées</strong> pour savoir exactement comment les chiffres au
      niveau du portefeuille sont calculés.</p>
    `,
  },
  {
    title: "Formules d'intelligence du parc expliquées",
    slug: 'fleet-intelligence-formulas-explained',
    locale: 'fr',
    category: 'Rapports et exportation', categorySortOrder: 7, sortOrder: 1,
    excerpt: "Les calculs exacts et documentés derrière la santé du portefeuille, le risque de capital, et la note du parc.",
    bodyHtml: `
      <p>Aucun des chiffres du panneau d'intelligence du parc n'est une métrique standard de
      l'industrie avec une définition universellement admise, voici donc exactement comment TraceHub
      calcule chacun d'eux :</p>
      <ul>
        <li><strong>Santé du portefeuille</strong> \u2014 une moyenne pondérée à travers les niveaux
        de santé de votre parc (Excellent/Sain/Attention requise/Risque élevé/Critique), pas une
        simple moyenne des scores bruts.</li>
        <li><strong>Disponibilité des actifs</strong> \u2014 le % d'actifs actuellement au statut
        « Disponible ».</li>
        <li><strong>Risque de capital</strong> \u2014 le % de la <em>valeur</em> totale de votre parc
        (pas seulement le nombre d'actifs) se trouvant dans des actifs au niveau de santé Risque
        élevé ou Critique. Cela pondère délibérément par l'argent, pas par le nombre \u2014 dix outils
        bon marché en mauvais état comptent moins qu'un véhicule de grande valeur en mauvais état.</li>
        <li><strong>Économies projetées</strong> \u2014 les véritables dépenses de maintenance et de
        réparation effectuées jusqu'à présent dans ce cycle sur des actifs déjà recommandés pour le
        remplacement, la mise au rebut ou la vente \u2014 de l'argent que vous cesseriez de dépenser en
        agissant sur la recommandation, pas un chiffre spéculatif « prédit par l'IA ».</li>
        <li><strong>Risque financier/opérationnel</strong> (Faible/Moyen/Élevé) \u2014 nos propres
        seuils documentés sur le Risque de capital et la proportion d'actifs à Risque élevé/
        Critique, respectivement.</li>
        <li><strong>Note globale du parc (A-F)</strong> \u2014 un composite de la Santé du portefeuille
        (poids de 60 %), la Disponibilité des actifs (20 %), et l'inverse du Risque de capital
        (20 %), converti en une note lettrée.</li>
      </ul>
      <p>Cliquez sur n'importe quel segment non nul de la carte thermique exécutive pour accéder
      directement à la liste des actifs, pré-filtrée sur exactement ce niveau de santé.</p>
    `,
  },
  {
    title: 'Page Rapports et analyses',
    slug: 'reports-and-analytics-page',
    locale: 'fr',
    category: 'Rapports et exportation', categorySortOrder: 7, sortOrder: 2,
    excerpt: 'Répartition par catégorie, dépréciation, et activité par emplacement.',
    bodyHtml: `
      <p>La page <strong>Rapports</strong> propose trois véritables rapports : un graphique de
      répartition des actifs par catégorie, un rapport complet de dépréciation (prix d'achat par
      rapport à la valeur actuelle estimée par l'IA par actif, filtrable par catégorie), et un
      journal d'activité par emplacement à l'échelle de l'entreprise (chaque événement de scan,
      filtrable par emplacement et type d'événement).</p>
    `,
  },
  {
    title: 'Exporter en CSV, PDF et PowerPoint',
    slug: 'exporting-csv-pdf-powerpoint',
    locale: 'fr',
    category: 'Rapports et exportation', categorySortOrder: 7, sortOrder: 3,
    excerpt: "Où se trouvent les boutons d'exportation, et ce que construit réellement l'option PowerPoint.",
    bodyHtml: `
      <p>L'exportation CSV, PDF et PowerPoint est disponible sur la page Rapports, le panneau
      « Actifs actuellement affectés » du tableau de bord, et (Super Admin) le journal d'audit et les
      graphiques de croissance au niveau de la plateforme.</p>
      <p>L'<strong>exportation PowerPoint</strong> mérite d'être soulignée spécifiquement : elle ne se
      contente pas de déverser une feuille de calcul dans des diapositives. Elle construit une
      véritable présentation prête à l'emploi \u2014 une diapositive de titre à l'image de la marque
      suivie de diapositives de tableaux propres et formatées \u2014 quelque chose que vous pouvez
      remettre directement à la direction sans rien reformater vous-même.</p>
      <p>Toutes les exportations s'exécutent entièrement dans votre navigateur \u2014 aucune donnée
      n'est envoyée à un service d'exportation tiers pour générer le fichier.</p>
    `,
  },
  {
    title: "L'exportation PDF en détail",
    slug: 'pdf-export-in-detail',
    locale: 'fr',
    category: 'Rapports et exportation', categorySortOrder: 7, sortOrder: 4,
    excerpt: 'Ce que contient réellement un PDF généré.',
    bodyHtml: `
      <p>Les exportations PDF sont à l'image de la marque, multi-sections, et paginées \u2014 un titre
      et un sous-titre (le nom de votre entreprise et la date de génération), suivis d'un tableau
      formaté par section de rapport. Elles se génèrent entièrement dans votre navigateur, donc
      aucune donnée ne quitte votre machine vers un service de rendu tiers pour produire le
      fichier.</p>
    `,
  },
  {
    title: "L'exportation PowerPoint en détail",
    slug: 'powerpoint-export-in-detail',
    locale: 'fr',
    category: 'Rapports et exportation', categorySortOrder: 7, sortOrder: 5,
    excerpt: "Une véritable présentation, pas une feuille de calcul déversée dans des diapositives.",
    bodyHtml: `
      <p>L'option PowerPoint construit une véritable présentation : une diapositive de titre à
      l'image de la marque, suivie d'une diapositive par section de rapport avec un tableau
      correctement formaté (pas une image d'un tableau) \u2014 conçue pour être remise directement à
      la direction sans que vous ayez à reformater quoi que ce soit. Les tableaux de plus de 14
      lignes sont tronqués sur la diapositive avec une note renvoyant vers l'exportation CSV
      complète pour les données intégrales.</p>
    `,
  },
  {
    title: "L'exportation CSV en détail",
    slug: 'csv-export-in-detail',
    locale: 'fr',
    category: 'Rapports et exportation', categorySortOrder: 7, sortOrder: 6,
    excerpt: 'Le format d\u2019exportation le plus complet et le plus portable.',
    bodyHtml: `
      <p>L'exportation CSV est le format le plus complet \u2014 contrairement au PDF/PowerPoint, elle
      n'est jamais tronquée pour raison de longueur, ce qui en fait le bon choix lorsque vous avez
      besoin de chaque ligne d'un grand rapport (par exemple, un journal complet d'activité par
      emplacement sur une année entière) plutôt qu'un résumé prêt pour présentation.</p>
    `,
  },
  {
    title: 'Forfaits et votre essai',
    slug: 'plans-and-your-trial',
    locale: 'fr',
    category: 'Facturation et abonnements', categorySortOrder: 8, sortOrder: 0,
    excerpt: 'Essai, Basic, Pro et Enterprise, et ce qui change entre eux.',
    bodyHtml: `
      <p>Chaque espace de travail commence par un essai gratuit de 30 jours avec une limite de 10
      actifs et un accès complet aux fonctionnalités \u2014 rien concernant le moteur d'intelligence,
      le scan, ou le flux de mise au rebut n'est restreint pendant l'essai. Les niveaux payants
      (Basic, Pro, Enterprise) augmentent vos limites d'actifs et d'utilisateurs ; comparez-les
      depuis <strong>Facturation</strong>.</p>
      <p>Si vous atteignez la limite d'actifs de votre forfait, la création d'actifs est bloquée
      avec un message clair plutôt que d'échouer silencieusement \u2014 passez à un forfait supérieur
      depuis Facturation pour l'augmenter.</p>
    `,
  },
  {
    title: 'Gérer votre abonnement',
    slug: 'managing-your-subscription',
    locale: 'fr',
    category: 'Facturation et abonnements', categorySortOrder: 8, sortOrder: 1,
    excerpt: 'Mise à niveau, renouvellement automatique, et annulation.',
    bodyHtml: `
      <p>Les abonnements sont facturés en USD et traités via Flutterwave. Sauf annulation, un
      abonnement payant se <strong>renouvelle automatiquement</strong> à la fin de chaque cycle de
      facturation. Vous pouvez annuler le renouvellement automatique à tout moment depuis
      <strong>Facturation</strong> \u2014 votre forfait reste pleinement actif jusqu'à la fin de la
      période déjà payée ; rien n'est coupé immédiatement.</p>
      <p>Votre historique de factures est disponible sur la même page.</p>
    `,
  },
  {
    title: "Ce qui se passe si un paiement échoue",
    slug: 'what-happens-if-payment-fails',
    locale: 'fr',
    category: 'Facturation et abonnements', categorySortOrder: 8, sortOrder: 2,
    excerpt: "Vos données ne sont jamais supprimées pour un paiement échoué.",
    bodyHtml: `
      <p>Si un paiement de renouvellement automatique échoue, TraceHub tente de vous en informer et
      peut temporairement restreindre l'accès aux fonctionnalités des niveaux payants jusqu'à
      résolution \u2014 mais vos données ne sont jamais supprimées suite à un paiement échoué. Mettez à
      jour votre méthode de paiement et réessayez depuis <strong>Facturation</strong>.</p>
    `,
  },
];

module.exports = frenchReportsBilling;
