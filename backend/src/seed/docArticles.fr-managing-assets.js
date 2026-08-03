const frenchManagingAssets = [
  {
    title: 'Enregistrer un actif',
    slug: 'registering-an-asset',
    locale: 'fr',
    category: 'Gérer les actifs', categorySortOrder: 1, sortOrder: 0,
    excerpt: "Chaque champ du formulaire d'ajout d'actif, et ce qu'il affecte réellement.",
    bodyHtml: `
      <p>Allez dans <strong>Actifs \u2192 Ajouter un actif</strong>. Seul le <strong>nom de l'actif</strong>
      est obligatoire \u2014 tout le reste est optionnel, mais plus vous renseignez de champs, plus le
      moteur d'intelligence peut en tirer parti.</p>

      <h3>Champs principaux</h3>
      <ul>
        <li><strong>Catégorie</strong> \u2014 détermine les hypothèses par défaut de durée de vie
        utile et de valeur résiduelle utilisées pour la dépréciation. Vous pouvez les remplacer par
        actif si besoin.</li>
        <li><strong>État</strong> \u2014 un état de départ simple (Excellent/Bon/Correct/Mauvais),
        distinct du score de santé calculé par l'IA, qui évolue avec le temps à mesure que des
        données réelles arrivent.</li>
        <li><strong>Marque, Modèle, Couleur, Numéro de série</strong> \u2014 détails d'identification.
        La couleur est un champ consultable alimenté par une liste de couleurs réelle et complète \u2014
        commencez à taper et choisissez parmi les suggestions, ou saisissez une couleur non
        répertoriée.</li>
        <li><strong>Année de fabrication / Date d'achat / Prix d'achat</strong> \u2014 la date et le
        prix d'achat sont ce à partir de quoi le moteur de dépréciation calcule réellement ; l'année
        de fabrication sert de référence d'âge de secours si la date d'achat est manquante.</li>
        <li><strong>Emplacement actuel</strong> \u2014 le point de contrôle où l'actif commence.
        Peut être mis à jour plus tard via le scan.</li>
      </ul>

      <h3>Prix d'achat et devise</h3>
      <p>Le prix d'achat est toujours stocké en USD. Si vous avez payé dans une devise différente,
      utilisez l'outil de conversion de devise situé directement sous le champ de prix : choisissez
      la devise, saisissez le montant local, récupérez un taux de change en direct ou saisissez-en un
      vous-même, et il calcule l'équivalent en USD pour vous.</p>

      <h3>Données du moteur d'intelligence des actifs (optionnel, mais utile)</h3>
      <p>Cliquez pour déplier cette section rétractable pour des champs qui alimentent directement
      les moteurs de score de santé, de prédiction de panne et de mise au rebut : historique
      opérationnel (heures utilisées, nombre de maintenances, nombre de réparations, nombre de
      pannes, dernier score d'inspection), intensité d'utilisation, détails financiers (valeur
      marchande actuelle, coût de remplacement), et facteurs environnementaux/d'état (risque de
      corrosion, exposition à la poussière, environnement d'exploitation). Rien de tout cela n'est
      requis pour enregistrer un actif, mais un actif sans aucune de ces données aura un score de
      confiance IA plus faible, simplement parce que le moteur dispose de moins d'éléments pour
      travailler \u2014 voir <strong>Score de confiance IA</strong>.</p>
    `,
  },
  {
    title: 'Catégories et champs personnalisés',
    slug: 'categories-and-custom-fields',
    locale: 'fr',
    category: 'Gérer les actifs', categorySortOrder: 1, sortOrder: 1,
    excerpt: 'Comment les catégories pilotent la dépréciation, et ajouter vos propres champs.',
    bodyHtml: `
      <p>Chaque actif appartient à une catégorie (Ordinateurs portables, Véhicules, Générateurs,
      Mobilier de bureau, etc.). Les catégories ne sont pas de simples étiquettes \u2014 chacune porte
      un <strong>profil de dépréciation</strong> : une durée de vie utile supposée en années et un
      pourcentage de valeur résiduelle, utilisés automatiquement chaque fois que vous enregistrez un
      actif dans cette catégorie sans remplacer manuellement ces chiffres.</p>

      <p>Vous pouvez ajuster le profil d'une catégorie depuis <strong>Actifs \u2192 Catégories</strong>
      si votre équipement réel vieillit plus vite ou moins vite que l'hypothèse par défaut \u2014 par
      exemple, si vos véhicules sont utilisés dans un environnement difficile et ont réellement une
      durée de vie utile plus courte que les 8 ans par défaut, réduisez-la là plutôt que de corriger
      manuellement chaque véhicule individuellement.</p>

      <h3>Champs personnalisés</h3>
      <p>Si votre organisation suit quelque chose de spécifique à votre équipement qui n'est pas déjà
      un champ intégré \u2014 un code de projet, un format de code-barres interne, un numéro de
      certificat de conformité \u2014 un Administrateur d'entreprise peut ajouter un champ
      personnalisé depuis Paramètres. Les champs personnalisés apparaissent automatiquement sur le
      formulaire d'ajout d'actif et sont stockés par actif.</p>
    `,
  },
  {
    title: "Comprendre le statut d'un actif",
    slug: 'understanding-asset-status',
    locale: 'fr',
    category: 'Gérer les actifs', categorySortOrder: 1, sortOrder: 2,
    excerpt: 'Disponible, Affecté, En maintenance, Réservé, Mis au rebut, Perdu.',
    bodyHtml: `
      <p>Chaque actif possède un statut, affiché sur la liste des actifs et la page de détail de
      l'actif :</p>
      <ul>
        <li><strong>Disponible</strong> \u2014 non actuellement affecté à quelqu'un, se trouvant à son
        emplacement actuel.</li>
        <li><strong>Affecté</strong> \u2014 défini automatiquement lorsque vous créez une affectation
        active pour cet actif, et effacé automatiquement lorsqu'il est marqué comme rendu.</li>
        <li><strong>En maintenance</strong> \u2014 défini manuellement lorsqu'un actif est retiré du
        service pour réparation.</li>
        <li><strong>Réservé</strong> \u2014 retenu pour un usage précis à venir sans être encore
        formellement affecté.</li>
        <li><strong>Mis au rebut</strong> \u2014 défini automatiquement lorsqu'un dossier de mise au
        rebut pour cet actif atteint l'étape finale « Mis au rebut ».</li>
        <li><strong>Perdu</strong> \u2014 défini manuellement si un actif est véritablement
        introuvable.</li>
      </ul>
      <p>Le statut alimente directement la métrique de disponibilité des actifs du tableau de bord
      (le % de votre parc actuellement Disponible) et la vue portefeuille du panneau d'intelligence
      du parc.</p>
    `,
  },
  {
    title: "Codes QR et impression des étiquettes",
    slug: 'qr-codes-and-printing-tags',
    locale: 'fr',
    category: 'Gérer les actifs', categorySortOrder: 1, sortOrder: 3,
    excerpt: "Comment le code QR est généré, et l'URL réelle qu'il encode.",
    bodyHtml: `
      <p>Dès qu'un actif est enregistré, TraceHub génère un code QR unique pour celui-ci \u2014 visible
      sur la page de détail de l'actif avec un bouton <strong>Télécharger le QR</strong>. Imprimez-le
      sur une étiquette et fixez-la à l'actif physique, ou affichez-le sur un écran à proximité si une
      étiquette physique n'est pas encore pratique.</p>

      <h3>Ce que le code encode réellement</h3>
      <p>Le code QR est une véritable URL (<code>votreapp.com/scan/&#123;jeton&#125;</code>), pas un
      format propriétaire \u2014 ce qui signifie qu'il fonctionne avec une application de caméra de
      téléphone ordinaire, pas seulement le scanner propre à TraceHub. Le scanner avec n'importe
      quelle application de caméra ouvre directement cette URL : si vous n'êtes pas connecté, elle
      vous amène d'abord à vous connecter puis continue automatiquement vers le bon endroit ; si vous
      êtes déjà connecté, elle vous amène directement au scanner intégré avec cet actif préchargé.</p>

      <h3>Utiliser le scanner intégré à l'application à la place</h3>
      <p>Depuis <strong>Scanner</strong> dans l'application, vous pouvez utiliser un scanner en direct
      basé sur la caméra (fonctionne sur téléphone ou ordinateur portable avec webcam) pour scanner
      directement le code d'un actif, ou saisir/coller manuellement un jeton si une caméra n'est pas
      disponible. Voir <strong>Scanner les actifs</strong> pour le flux complet d'entrée/sortie.</p>
    `,
  },
  {
    title: 'Archiver et supprimer des actifs',
    slug: 'archiving-and-deleting-assets',
    locale: 'fr',
    category: 'Gérer les actifs', categorySortOrder: 1, sortOrder: 4,
    excerpt: 'La différence entre archivage et suppression définitive.',
    bodyHtml: `
      <p>Depuis une page de détail d'actif, les Administrateurs d'entreprise et les Responsables
      peuvent <strong>archiver</strong> un actif \u2014 cela le retire de la liste active des actifs et
      de tous les compteurs du tableau de bord, mais conserve son historique complet (inspections,
      affectations, scans de localisation, dossiers de mise au rebut) intact et restaurable.
      L'archivage est le bon geste pour un équipement que vous ne suivez plus au quotidien mais dont
      vous voulez conserver les registres.</p>
      <p>La suppression définitive n'est pas proposée comme action de routine \u2014 l'historique des
      actifs est précieux pour l'audit et les registres de dépréciation, et l'archivage couvre le cas
      « je n'ai plus besoin de voir ceci » sans rien perdre.</p>
    `,
  },
  {
    title: 'Modifier un actif existant',
    slug: 'editing-an-existing-asset',
    locale: 'fr',
    category: 'Gérer les actifs', categorySortOrder: 1, sortOrder: 5,
    excerpt: 'Ce que le déclenche automatiquement une mise à jour.',
    bodyHtml: `
      <p>Ouvrez n'importe quel actif et cliquez sur Modifier. Tout changement \u2014 un nouveau nombre
      de maintenances, une valeur marchande mise à jour, un prix d'achat corrigé \u2014 déclenche un
      recalcul immédiat de l'ensemble du moteur d'intelligence pour cet actif : dépréciation, santé,
      risque de panne, calendrier de maintenance et recommandation de mise au rebut se mettent tous à
      jour ensemble, pas indépendamment.</p>
    `,
  },
  {
    title: 'Filtrage groupé de la liste des actifs',
    slug: 'bulk-filtering-assets-list',
    locale: 'fr',
    category: 'Gérer les actifs', categorySortOrder: 1, sortOrder: 6,
    excerpt: 'Recherche, statut, catégorie, emplacement, et filtres de niveau de santé ensemble.',
    bodyHtml: `
      <p>La liste des actifs permet de combiner une recherche textuelle (nom, étiquette, numéro de
      série, marque) avec des filtres de statut, de catégorie et d'emplacement simultanément \u2014
      utile pour une question comme « montre-moi tous les ordinateurs portables disponibles à
      l'entrepôt d'Accra ». Cliquer sur un segment de la carte thermique exécutive du tableau de bord
      atterrit également ici, pré-filtré sur un niveau de santé précis.</p>
    `,
  },
];

module.exports = frenchManagingAssets;
