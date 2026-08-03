const frenchIntelligenceEngineExpanded = [
  {
    title: "L'assistant IA",
    slug: 'the-ai-assistant',
    locale: 'fr',
    category: "Le moteur d'intelligence des actifs", categorySortOrder: 2, sortOrder: 7,
    excerpt: 'Ce que le widget de discussion peut et ne peut pas répondre.',
    bodyHtml: `
      <p>La bulle de discussion dans le coin inférieur droit est un véritable assistant IA, pas un
      robot FAQ scripté. Sur le site marketing public, il répond aux questions sur TraceHub lui-même
      \u2014 tarifs, fonctionnalités, fonctionnement \u2014 en s'appuyant sur le contenu FAQ publié.</p>

      <p>Lorsque vous êtes connecté, il obtient des données réelles et actuelles sur <em>votre
      propre</em> entreprise : votre santé de portefeuille, risque de capital et note de parc ; les
      actifs spécifiques actuellement signalés pour réparation ou remplacement (par nom, avec leurs
      scores de santé et coûts d'entretien réels) ; les actifs approchant leur date de mise au rebut
      suggérée ; le nombre d'affectations en retard ; et les mêmes informations sur le parc basées
      sur des règles affichées sur votre tableau de bord. Essayez de demander quelque chose comme
      <em>« quels actifs ont besoin d'être remplacés ? »</em> ou <em>« quel est notre plus grand
      risque de maintenance en ce moment ? »</em> et il répondra avec vos données réelles, pas une
      réponse générique.</p>

      <p>Il est honnête sur ses limites : les données dont il dispose constituent un résumé borné
      (vos ~10 principaux actifs signalés, des compteurs agrégés), pas littéralement chaque actif de
      votre parc. Si vous posez une question sur un actif précis qui n'est pas dans ce résumé, il le
      dira et vous orientera vers la page de cet actif plutôt que de deviner.</p>
    `,
  },
  {
    title: 'Méthodes de dépréciation basées sur le temps expliquées',
    slug: 'time-based-depreciation-methods',
    locale: 'fr',
    category: "Le moteur d'intelligence des actifs", categorySortOrder: 2, sortOrder: 8,
    excerpt: "Linéaire, Solde dégressif, Amortissement dégressif double, et Somme des chiffres des années, avec des chiffres concrets.",
    bodyHtml: `
      <p>Quatre des neuf méthodes de dépréciation sont basées purement sur le temps (l'âge), pas sur
      l'utilisation. Voici ce que chacune fait réellement avec un exemple concret : un actif de
      10 000 $, une durée de vie utile de 5 ans, une valeur résiduelle de 500 $.</p>

      <h3>Linéaire</h3>
      <p>Déprécie d'un montant égal chaque année : <code>(cost - scrap) / lifeYears</code> = 1 900 $
      par an. Après 2 ans, valeur comptable = 10 000 $ - (2 \u00d7 1 900 $) = 6 200 $.</p>

      <h3>Solde dégressif</h3>
      <p>Applique un pourcentage fixe à la valeur comptable <em>restante</em> chaque année, plutôt
      qu'au coût d'origine \u2014 donc la dépréciation est plus importante les premières années et
      s'atténue ensuite. Le taux est dérivé de sorte que l'actif atteigne sa valeur résiduelle à la
      fin de sa durée de vie utile.</p>

      <h3>Amortissement dégressif double</h3>
      <p>Une version accélérée du solde dégressif, utilisant le double du taux linéaire
      (<code>2 / lifeYears</code>) appliqué au solde restant chaque année. Pour un actif de 5 ans,
      cela donne un taux de 40 % : valeur comptable année 1 = 10 000 $ \u00d7 0,6 = 6 000 $ ; année 2 =
      6 000 $ \u00d7 0,6 = 3 600 $. Elle ne déprécie jamais en dessous de la valeur résiduelle. TraceHub
      calcule cela au prorata de façon lisse pour les années partielles \u2014 un actif de 2,5 ans est
      évalué entre ses chiffres à 2 ans et à 3 ans, pas identique à l'un ou l'autre.</p>

      <h3>Somme des chiffres des années</h3>
      <p>Également accélérée, mais utilisant une pondération par somme de chiffres : pour un actif de
      5 ans, les chiffres 5+4+3+2+1 = 15. L'année 1 déprécie 5/15 de la base amortissable, l'année 2
      déprécie 4/15, et ainsi de suite \u2014 concentrée en début de période, mais moins agressivement
      que l'amortissement dégressif double. Comme pour ce dernier, TraceHub calcule cela au prorata
      pour les années partielles plutôt que de sauter par paliers annuels entiers.</p>

      <h3>Laquelle choisir</h3>
      <p>La méthode linéaire est le bon choix par défaut pour la plupart du matériel de bureau et du
      mobilier qui perd de la valeur régulièrement. Les méthodes accélérées (Solde dégressif, ADD,
      SCA) conviennent à un équipement qui perd réellement l'essentiel de sa valeur au cours de la
      première ou des deux premières années \u2014 les véhicules et certaines machines en sont des
      candidats courants.</p>
    `,
  },
  {
    title: "Méthodes de dépréciation basées sur l'utilisation expliquées",
    slug: 'usage-based-depreciation-methods',
    locale: 'fr',
    category: "Le moteur d'intelligence des actifs", categorySortOrder: 2, sortOrder: 9,
    excerpt: 'Unités de production, Heures machine et Basé sur le kilométrage \u2014 pour un équipement qui s\u2019use par l\u2019usage, pas le temps.',
    bodyHtml: `
      <p>Trois méthodes déprécient selon la quantité réelle d'utilisation d'un actif, pas selon
      depuis combien de temps vous le possédez \u2014 adaptées à un équipement dont l'utilisation
      varie énormément entre des unités du même âge.</p>
      <ul>
        <li><strong>Unités de production</strong> \u2014 définissez la capacité de production totale
        attendue de l'actif (par ex. une imprimante conçue pour 500 000 pages). La dépréciation
        s'accumule proportionnellement aux unités réellement produites par rapport à cette
        capacité.</li>
        <li><strong>Heures machine</strong> \u2014 même principe, en utilisant les heures de
        fonctionnement plutôt qu'un décompte de production. Un générateur conçu pour 20 000 heures
        ayant enregistré 5 000 heures a utilisé 25 % de sa vie amortissable, indépendamment de son
        âge calendaire.</li>
        <li><strong>Basé sur le kilométrage</strong> \u2014 pour les véhicules : définissez le
        kilométrage total attendu, et la dépréciation suit le compteur.</li>
      </ul>
      <p>Les trois exigent que vous mainteniez à jour le chiffre d'utilisation pertinent (unités,
      heures ou kilométrage) sur l'actif \u2014 soit manuellement via le formulaire de modification
      d'actif, soit en l'enregistrant chaque fois que vous consignez une inspection ou un événement
      de maintenance. Un actif sur l'une de ces méthodes avec un chiffre d'utilisation obsolète
      affichera une valeur basée sur une utilisation dépassée, la même limite honnête que possède
      tout système basé sur l'utilisation.</p>
    `,
  },
  {
    title: "La dépréciation adaptative IA en profondeur",
    slug: 'ai-adaptive-depreciation-in-depth',
    locale: 'fr',
    category: "Le moteur d'intelligence des actifs", categorySortOrder: 2, sortOrder: 10,
    excerpt: 'Le modèle multiplicatif derrière la méthode de TraceHub la plus réactive aux données.',
    bodyHtml: `
      <p>Adaptatif IA est la méthode intégrée la plus sophistiquée : plutôt qu'une seule courbe
      temporelle ou d'utilisation, elle multiplie ensemble cinq véritables facteurs d'ajustement
      par-dessus une base linéaire :</p>
      <ul>
        <li><strong>Facteur d'utilisation</strong> \u2014 plus élevé pour une intensité
        Intense/Extrême, plus faible pour Légère.</li>
        <li><strong>Facteur de maintenance</strong> \u2014 les actifs bien entretenus se déprécient
        plus lentement que ne le suggérerait autrement leur historique de maintenance.</li>
        <li><strong>Facteur d'environnement</strong> \u2014 des conditions plus rudes (risque de
        corrosion élevé, forte exposition à la poussière) accélèrent la dépréciation.</li>
        <li><strong>Facteur de marché</strong> \u2014 si vous avez saisi une valeur marchande
        actuelle, elle rapproche l'estimation de la réalité de revente du marché plutôt que d'une
        formule pure.</li>
        <li><strong>Facteur de fiabilité</strong> \u2014 informé par la fréquence des réparations et
        l'historique des pannes.</li>
      </ul>
      <p>Parce qu'elle s'appuie sur autant d'éléments, Adaptatif IA est aussi la méthode la plus
      affectée par la quantité de « Données du moteur d'intelligence des actifs » que vous avez
      renseignée \u2014 un actif dont l'intensité d'utilisation, l'environnement et l'historique de
      maintenance sont tous renseignés obtient une courbe véritablement adaptée ; un actif sans
      aucune de ces données revient en pratique à un comportement linéaire. Cela se reflète aussi
      honnêtement dans le score de confiance IA de cet actif.</p>
    `,
  },
  {
    title: 'Rédiger des formules de dépréciation personnalisées',
    slug: 'writing-custom-depreciation-formulas',
    locale: 'fr',
    category: "Le moteur d'intelligence des actifs", categorySortOrder: 2, sortOrder: 11,
    excerpt: 'Règles de syntaxe, variables disponibles, et plusieurs exemples concrets.',
    bodyHtml: `
      <p>Si aucune des huit méthodes intégrées ne correspond à la façon dont votre organisation
      valorise réellement un actif, rédigez votre propre formule \u2014 évaluée par un analyseur
      arithmétique sûr et restreint (aucune exécution de code, seulement des nombres et des
      opérateurs), de sorte qu'une formule invalide ne puisse jamais casser l'enregistrement de
      l'actif ; elle revient sans risque à la méthode linéaire à la place.</p>

      <h3>Syntaxe</h3>
      <p>Arithmétique de base uniquement : <code>+ - * / ^</code> et parenthèses. Aucun appel de
      fonction, aucune comparaison, aucun texte. Variables disponibles :</p>
      <table style="width:100%;border-collapse:collapse;margin:0.75rem 0;font-size:0.88rem;">
        <tbody>
          <tr><td style="padding:0.3rem;"><code>cost</code></td><td style="padding:0.3rem;">Prix d'achat</td></tr>
          <tr><td style="padding:0.3rem;"><code>residual</code></td><td style="padding:0.3rem;">Valeur résiduelle</td></tr>
          <tr><td style="padding:0.3rem;"><code>lifeYears</code></td><td style="padding:0.3rem;">Durée de vie utile en années</td></tr>
          <tr><td style="padding:0.3rem;"><code>age</code></td><td style="padding:0.3rem;">Âge actuel en années (fractionnaire)</td></tr>
          <tr><td style="padding:0.3rem;"><code>hoursUsed / mileage / operatingCycles</code></td><td style="padding:0.3rem;">Chiffres d'utilisation</td></tr>
          <tr><td style="padding:0.3rem;"><code>repairCount / maintenanceCount</code></td><td style="padding:0.3rem;">Nombre d'événements</td></tr>
          <tr><td style="padding:0.3rem;"><code>maintenanceCostTotal / repairCostTotal</code></td><td style="padding:0.3rem;">Dépenses cumulées</td></tr>
        </tbody>
      </table>

      <h3>Exemples concrets</h3>
      <p><strong>Pénaliser les réparations et l'âge ensemble :</strong><br/>
      <code>cost - (repairCount * 25) - (age * 100)</code><br/>
      Commence au coût total, perd 25 $ par réparation et 100 $ par année d'âge.</p>

      <p><strong>Un plancher à la valeur résiduelle :</strong> l'analyseur ne plafonne pas
      automatiquement à votre valeur résiduelle comme le font les méthodes intégrées \u2014 si vous
      voulez cette garantie, intégrez-la à la logique de la formule en gardant les termes
      suffisamment petits par rapport au coût, ou surveillez simplement le résultat et ajustez ; une
      formule extrême pourrait théoriquement produire un nombre négatif, que TraceHub stockera quand
      même, donc testez votre formule sur un actif réel avant de vous y fier largement.</p>
    `,
  },
  {
    title: 'Comprendre le score de risque',
    slug: 'understanding-risk-score',
    locale: 'fr',
    category: "Le moteur d'intelligence des actifs", categorySortOrder: 2, sortOrder: 12,
    excerpt: 'L\u2019indice de 0 à 100 derrière les quatre horizons de probabilité de panne.',
    bodyHtml: `
      <p>Aux côtés des probabilités de panne à 30/60/90/180 jours, chaque actif possède un unique
      <strong>score de risque</strong> (0-100) \u2014 l'indice de risque global que le moteur de
      prédiction de panne calcule en interne, à partir duquel les quatre probabilités par horizon
      temporel sont toutes dérivées comme différents points le long de la même courbe de risque. Un
      score de risque plus élevé signifie une courbe de probabilité plus raide sur les quatre
      horizons, pas seulement un chiffre plus élevé à un moment précis.</p>
      <p>Il est affiché directement sur la page de détail de l'actif à côté de la section Risque de
      panne, afin que vous voyiez le seul chiffre sous-jacent pilotant les quatre pourcentages
      ci-dessus, plutôt que de les traiter comme quatre données non liées.</p>
    `,
  },
  {
    title: "Le panneau d'informations IA : les cinq détecteurs de tendances expliqués",
    slug: 'ai-insights-panel-detectors-explained',
    locale: 'fr',
    category: "Le moteur d'intelligence des actifs", categorySortOrder: 2, sortOrder: 13,
    excerpt: 'Ce qui déclenche exactement chaque information affichée sur votre tableau de bord.',
    bodyHtml: `
      <p>Le panneau d'informations IA du tableau de bord exécute cinq détecteurs de tendances
      indépendants et basés sur des règles, sur l'ensemble de votre parc, à chaque chargement.
      Chacun est déterministe \u2014 avec les mêmes données, il produit toujours la même phrase \u2014 et
      un détecteur qui ne trouve rien ne contribue simplement rien, plutôt que de forcer une phrase
      sortie de nulle part.</p>
      <ol>
        <li><strong>Dépréciation accélérée due à une utilisation intensive</strong> \u2014 signale une
        catégorie où plusieurs actifs fortement utilisés perdent de la valeur sensiblement plus vite
        que la moyenne de cette catégorie. Exemple : <em>« 3 actifs dans Véhicules se déprécient plus
        vite que la moyenne de la catégorie en raison d'un usage intensif. »</em></li>
        <li><strong>Budget de maintenance dépassé</strong> \u2014 signale l'unique actif dont les
        dépenses cumulées de maintenance et de réparation ont le plus dépassé une hypothèse de budget
        documentée (un pourcentage de son coût de remplacement). Exemple : <em>« Chariot élévateur 02
        a dépassé son budget de maintenance prévu de 49 % ; un remplacement est probablement plus
        économique qu'une réparation continue. »</em></li>
        <li><strong>Approche de la fin de vie</strong> \u2014 signale les catégories comportant des
        actifs dont la date de mise au rebut suggérée tombe dans les six prochains mois.</li>
        <li><strong>Actifs inactifs</strong> \u2014 signale les catégories comportant des actifs
        inutilisés (statut disponible) depuis une période prolongée, méritant d'être réaffectés ou
        vendus.</li>
        <li><strong>Alarme de maintenance à l'échelle de la catégorie</strong> \u2014 signale une
        catégorie entière (pas un seul actif) où les dépenses d'entretien cumulées sur tous ses
        actifs ont franchi un seuil élevé par rapport à leur valeur de remplacement combinée.</li>
      </ol>
      <p>Aucune de ces informations n'est une supposition \u2014 chaque chiffre dans chaque phrase
      découle d'une véritable requête sur vos propres données d'actifs, au moment où le tableau de
      bord se charge.</p>
    `,
  },
];

module.exports = frenchIntelligenceEngineExpanded;
