const frenchIntelligenceEngine = [
  {
    title: 'Aperçu des six moteurs',
    slug: 'ai-engine-overview',
    locale: 'fr',
    category: "Le moteur d'intelligence des actifs", categorySortOrder: 2, sortOrder: 0,
    excerpt: "Ce qui fonctionne automatiquement sur chaque actif, et comment les éléments s'articulent.",
    bodyHtml: `
      <p>Le moteur d'intelligence des actifs (parfois appelé TAIE en interne) est composé de six
      moteurs de notation réels et déterministes qui se recalculent automatiquement chaque fois qu'un
      actif est créé, mis à jour ou inspecté. « Déterministe » a son importance ici : ce sont des
      formules pondérées documentées, pas un modèle d'apprentissage automatique entraîné produisant
      un chiffre inexplicable \u2014 chaque score peut être retracé jusqu'aux données réelles qui l'ont
      produit.</p>

      <ol>
        <li><strong>Moteur de dépréciation intelligent</strong> \u2014 neuf méthodes, de la linéaire à
        une formule personnalisée que vous rédigez vous-même.</li>
        <li><strong>Score de santé de l'actif (0-100)</strong> \u2014 un composite pondéré de l'âge, de
        la maintenance, des réparations, de l'utilisation, de l'inspection et de l'environnement.</li>
        <li><strong>Moteur de prédiction de panne</strong> \u2014 probabilité de panne à 30/60/90/180
        jours.</li>
        <li><strong>Moteur de planification de maintenance</strong> \u2014 une véritable date de
        prochain entretien prédite.</li>
        <li><strong>Moteur d'intelligence de mise au rebut</strong> \u2014 une recommandation
        GARDER/RÉPARER/VENDRE/DÉCLASSER/REMPLACER accompagnée d'un résumé exécutif en langage
        clair.</li>
        <li><strong>Score de confiance IA</strong> \u2014 la quantité de preuves réelles étayant tout
        ce qui précède, pour cet actif précis.</li>
      </ol>

      <p>Par-dessus tout cela, une <strong>boucle d'apprentissage de l'IA</strong> suit si le fait
      d'ignorer une recommandation de mise au rebut a ensuite été suivi d'une véritable panne, et
      réinjecte cela dans les futurs scores de confiance \u2014 propre à l'historique de votre propre
      entreprise, pas un chiffre générique de l'industrie.</p>

      <p>Chacun de ces scores est visible à trois endroits : sur la page <strong>Détail de
      l'actif</strong> (répartition complète, par actif), sur la <strong>liste des actifs</strong>
      (colonnes Santé/Risque de panne/Recommandation, pour balayer tout votre parc d'un coup), et
      agrégé sur le <strong>panneau d'intelligence du parc du tableau de bord</strong> (niveau
      portefeuille : santé moyenne, capital à risque, une note de parc de A à F).</p>
    `,
  },
  {
    title: 'Moteur de dépréciation intelligent',
    slug: 'smart-depreciation-engine',
    locale: 'fr',
    category: "Le moteur d'intelligence des actifs", categorySortOrder: 2, sortOrder: 1,
    excerpt: 'Les neuf méthodes, y compris comment rédiger votre propre formule personnalisée.',
    bodyHtml: `
      <p>Définissez la méthode de dépréciation d'un actif dans la section « Données du moteur
      d'intelligence des actifs » du formulaire d'ajout/modification d'actif. Si vous n'en
      choisissez pas, la méthode <strong>linéaire</strong> est utilisée par défaut.</p>

      <table style="width:100%;border-collapse:collapse;margin:1rem 0;font-size:0.9rem;">
        <thead><tr style="text-align:left;border-bottom:2px solid #E2E8F0;">
          <th style="padding:0.5rem;">Méthode</th><th style="padding:0.5rem;">Fonctionnement</th>
        </tr></thead>
        <tbody>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Linéaire</strong></td><td style="padding:0.5rem;">Dépréciation égale chaque année sur la durée de vie utile.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Solde dégressif</strong></td><td style="padding:0.5rem;">Un pourcentage fixe de la valeur comptable restante chaque année \u2014 dépréciation plus rapide au début.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Amortissement dégressif double</strong></td><td style="padding:0.5rem;">Une version accélérée du solde dégressif, courante pour un équipement qui perd la majorité de sa valeur dans ses premières années.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Somme des chiffres des années</strong></td><td style="padding:0.5rem;">Une autre méthode accélérée, pondérant plus fortement les premières années via une formule de somme de chiffres.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Unités de production</strong></td><td style="padding:0.5rem;">Déprécie selon l'utilisation réelle (unités produites) plutôt que le temps \u2014 définissez la capacité totale attendue de l'actif.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Heures machine</strong></td><td style="padding:0.5rem;">Même principe, basé sur les heures de fonctionnement plutôt que sur les unités.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Basé sur le kilométrage</strong></td><td style="padding:0.5rem;">Pour les véhicules \u2014 déprécie selon le kilométrage au compteur par rapport au kilométrage total attendu.</td></tr>
          <tr style="border-bottom:1px solid #EDF2F7;"><td style="padding:0.5rem;"><strong>Adaptatif IA</strong></td><td style="padding:0.5rem;">Un modèle multiplicatif combinant l'intensité d'utilisation, l'historique de maintenance, l'environnement, les conditions de marché et la fiabilité en un taux de dépréciation ajusté \u2014 la méthode la plus gourmande en données, et la plus réactive à l'état réel d'un actif plutôt qu'à son seul âge.</td></tr>
          <tr><td style="padding:0.5rem;"><strong>Formule personnalisée</strong></td><td style="padding:0.5rem;">Rédigez votre propre expression arithmétique \u2014 voir ci-dessous.</td></tr>
        </tbody>
      </table>

      <h3>Rédiger une formule personnalisée</h3>
      <p>Arithmétique de base uniquement (<code>+ - * / ^</code> et parenthèses, pas de fonctions).
      Variables disponibles : <code>cost, residual, lifeYears, age, hoursUsed, mileage,
      operatingCycles, repairCount, maintenanceCount, maintenanceCostTotal, repairCostTotal</code>.</p>
      <p><strong>Exemple :</strong> <code>cost - (repairCount * 25) - (age * 100)</code> \u2014
      commence au coût total, soustrait 25 $ par réparation et 100 $ par année d'âge. Une formule
      invalide revient sans risque à la méthode linéaire plutôt que de casser l'enregistrement de
      l'actif.</p>
    `,
  },
  {
    title: "Score de santé de l'actif",
    slug: 'asset-health-score',
    locale: 'fr',
    category: "Le moteur d'intelligence des actifs", categorySortOrder: 2, sortOrder: 2,
    excerpt: 'Les pondérations exactes derrière le score de 0 à 100, et ce que chaque niveau signifie.',
    bodyHtml: `
      <p>Chaque actif reçoit un score de santé de 0 à 100, recalculé automatiquement à mesure que de
      nouvelles données arrivent. C'est un composite pondéré de six facteurs :</p>
      <ul>
        <li><strong>Âge</strong> par rapport à la durée de vie utile attendue \u2014 20 %</li>
        <li><strong>Maintenance</strong>, conformité et historique \u2014 25 %</li>
        <li><strong>Réparations</strong> (fréquence et coût) \u2014 15 %</li>
        <li><strong>Intensité</strong> d'utilisation \u2014 15 %</li>
        <li><strong>Inspection</strong>, score le plus récent \u2014 15 %</li>
        <li><strong>Environnement</strong> (risque de corrosion, exposition à la poussière,
        conditions d'exploitation) \u2014 10 %</li>
      </ul>

      <h3>Niveaux</h3>
      <p>Les cinq mêmes niveaux sont utilisés de façon cohérente partout dans l'application \u2014 la
      liste des actifs, la carte thermique exécutive du tableau de bord, et le score lui-même :</p>
      <ul>
        <li><strong>Excellent</strong> \u2014 90-100</li>
        <li><strong>Sain</strong> \u2014 75-89</li>
        <li><strong>Attention requise</strong> \u2014 60-74</li>
        <li><strong>Risque élevé</strong> \u2014 40-59</li>
        <li><strong>Critique</strong> \u2014 en dessous de 40</li>
      </ul>

      <p>Sur la page de détail de l'actif, vous verrez la répartition complète \u2014 pas seulement le
      chiffre final \u2014 sous forme de barres de score individuelles pour chacun des six facteurs,
      afin que vous voyiez exactement ce qui tire un score vers le bas (par exemple, un actif avec
      une excellente maintenance mais une mauvaise position ajustée à l'âge montrera cela clairement
      plutôt que de le masquer derrière un seul chiffre composite).</p>
    `,
  },
  {
    title: 'Moteur de prédiction de panne',
    slug: 'failure-prediction-engine',
    locale: 'fr',
    category: "Le moteur d'intelligence des actifs", categorySortOrder: 2, sortOrder: 3,
    excerpt: 'Comment les probabilités à 30/60/90/180 jours sont calculées.',
    bodyHtml: `
      <p>Aux côtés du score de santé, chaque actif reçoit une probabilité de panne à quatre
      horizons : 30, 60, 90 et 180 jours. Elles sont dérivées des mêmes facteurs de risque
      sous-jacents que le score de santé (âge, lacunes de maintenance, fréquence de réparation,
      intensité d'utilisation) mais exprimées comme une véritable courbe de probabilité plutôt qu'un
      score ponctuel unique \u2014 un actif peut avoir un score de santé actuel raisonnable tout en
      montrant une probabilité de panne croissante au cours des six prochains mois si sa maintenance
      prend du retard.</p>

      <p>Chaque actif affiche aussi ses <strong>motifs de panne</strong> spécifiques \u2014 des
      explications en langage clair comme « approche ou dépasse sa durée de vie utile attendue » ou
      « maintenance en retard » \u2014 afin que le chiffre de probabilité ne soit jamais qu'une donnée
      brute sans explication derrière.</p>

      <p>Un chiffre connexe, stocké séparément, est le <strong>score de risque</strong>, visible sur
      la page de détail de l'actif \u2014 l'indice de risque global que le moteur de prédiction de
      panne calcule en interne pour dériver les quatre probabilités ci-dessus.</p>
    `,
  },
  {
    title: 'Moteur de planification de maintenance',
    slug: 'maintenance-scheduling-engine',
    locale: 'fr',
    category: "Le moteur d'intelligence des actifs", categorySortOrder: 2, sortOrder: 4,
    excerpt: 'Comment TraceHub prédit quand un actif est réellement dû pour un entretien.',
    bodyHtml: `
      <p>Chaque actif reçoit une véritable <strong>date de prochain entretien</strong> prédite,
      affichée sur sa page de détail avec le raisonnement derrière \u2014 pas un rappel générique
      « entretien annuel ».</p>

      <h3>Comment c'est calculé</h3>
      <p>L'intervalle de base provient de l'intensité d'utilisation : une utilisation légère
      correspond par défaut à un intervalle de 365 jours, normale à 180 jours, intense à 90 jours, et
      extrême à 45 jours. Vous pouvez remplacer cela par un intervalle spécifique pour un actif qui
      ne correspond pas à ces valeurs par défaut.</p>
      <p>Cet intervalle est ensuite <strong>avancé à mesure que la santé décline</strong> \u2014 un
      actif avec un score de santé plus bas obtient une date d'entretien prédite plus proche qu'un
      actif identique en excellent état sur le même calendrier nominal, plafonné pour ne jamais
      recommander un entretien plus de deux fois plus fréquent que l'intervalle de base.</p>
      <p>Le calendrier est ancré à partir de la dernière date de maintenance enregistrée de l'actif,
      ou de sa date d'achat si aucune maintenance n'a jamais été enregistrée. <strong>Important :</strong>
      si un actif n'a jamais eu de maintenance enregistrée malgré un achat remontant à plusieurs
      années, sa date de prochain entretien prédite s'affichera correctement comme très en retard \u2014
      c'est exact, pas un bogue, et c'est exactement le type de lacune que le compteur « Maintenance
      due » du tableau de bord est conçu pour révéler.</p>
    `,
  },
  {
    title: 'Moteur d\u2019intelligence de mise au rebut',
    slug: 'disposal-intelligence-engine',
    locale: 'fr',
    category: "Le moteur d'intelligence des actifs", categorySortOrder: 2, sortOrder: 5,
    excerpt: 'Comment les recommandations GARDER/RÉPARER/VENDRE/DÉCLASSER/REMPLACER sont formulées.',
    bodyHtml: `
      <p>Chaque actif reçoit un score de préparation à la mise au rebut (0-100) et une recommandation
      précise \u2014 GARDER, RÉPARER, VENDRE, DÉCLASSER ou REMPLACER \u2014 pondérée sur sept facteurs
      réels :</p>
      <ul>
        <li>Âge par rapport à la durée de vie utile \u2014 25 %</li>
        <li>Coût de maintenance par rapport à la valeur de remplacement \u2014 20 %</li>
        <li>Dépréciation \u2014 15 %</li>
        <li>Fréquence des réparations \u2014 15 %</li>
        <li>Score de santé \u2014 10 %</li>
        <li>Valeur marchande actuelle \u2014 10 %</li>
        <li>Criticité pour l'entreprise \u2014 5 %</li>
      </ul>

      <p>Le poids le plus lourd porte délibérément sur le <strong>coût de maintenance par rapport à
      la valeur de remplacement</strong>, pas le prix d'achat d'origine \u2014 comparer ce que vous
      avez dépensé pour maintenir un actif en fonctionnement à ce que coûte un équivalent neuf
      <em>aujourd'hui</em> est un signal bien plus honnête que de le comparer à un prix payé il y a
      des années.</p>

      <h3>La recommandation exécutive</h3>
      <p>Aux côtés du score, chaque actif reçoit un résumé en langage clair sur lequel vous pouvez
      agir immédiatement \u2014 par exemple, <em>« Le coût de réparation dépasse le bénéfice
      opérationnel attendu ; remplacer dans les 3 mois. »</em> Ceci est généré à partir des mêmes
      données réelles que le score lui-même, pas une estimation séparée.</p>

      <h3>Signaler un actif</h3>
      <p>Lorsque le moteur recommande RÉPARER, VENDRE, DÉCLASSER ou REMPLACER, un bouton
      <strong>« Signaler pour mise au rebut »</strong> apparaît sur la page de détail de l'actif, qui
      ouvre un dossier de mise au rebut formel \u2014 voir <strong>Le flux de mise au rebut en six
      étapes</strong>.</p>
    `,
  },
  {
    title: "Score de confiance IA et la boucle d'apprentissage",
    slug: 'ai-confidence-score-and-learning-loop',
    locale: 'fr',
    category: "Le moteur d'intelligence des actifs", categorySortOrder: 2, sortOrder: 6,
    excerpt: 'À quel point faire confiance à un score donné, et comment le système apprend réellement.',
    bodyHtml: `
      <p>Chaque recommandation est accompagnée d'un score de confiance \u2014 pas un vague « faites-moi
      confiance », mais une répartition transparente de ce sur quoi il repose exactement : combien de
      champs de données pertinents sont renseignés pour cet actif, combien d'enregistrements de
      maintenance existent, si des données de valeur marchande actuelle sont disponibles, et (voir
      ci-dessous) un ajustement borné issu de l'historique de mise au rebut de votre propre
      entreprise.</p>
      <p>Un actif avec presque aucune donnée renseignée \u2014 pas d'historique de maintenance, pas
      d'inspections, pas de valeur marchande saisie \u2014 affichera honnêtement un score de confiance
      plus faible, car il y a réellement moins de preuves derrière ses chiffres. Renseigner davantage
      de champs « Données du moteur d'intelligence des actifs » lors de l'enregistrement ou de la
      modification d'un actif élève directement cela avec le temps.</p>

      <h3>La boucle d'apprentissage de l'IA</h3>
      <p>C'est la partie qui rend les recommandations de TraceHub plus fiables spécifiquement pour
      <em>votre</em> entreprise avec le temps, pas seulement dans l'abstrait. Voici exactement
      comment cela fonctionne :</p>
      <ol>
        <li>Lorsqu'une recommandation de mise au rebut est <strong>rejetée</strong> (le dossier est
        ouvert mais un responsable décide de ne pas procéder), le système note discrètement le
        nombre d'incidents de l'actif (pannes + accidents) à ce moment-là.</li>
        <li>30 jours plus tard, il vérifie : une véritable panne s'est-elle produite depuis ?</li>
        <li>Avec le temps, cela construit un véritable <strong>taux de fiabilité</strong>
        vérifiable \u2014 parmi les recommandations que votre entreprise a choisi d'ignorer, quelle
        proportion a ensuite été suivie d'une panne réelle.</li>
        <li>Ce taux réinjecte les futurs scores de confiance sous forme d'un ajustement borné
        (\u00b110) \u2014 si votre historique montre qu'ignorer les signalements ici mène généralement à
        de vraies pannes, la confiance future augmente légèrement ; si les signalements ignorés se
        passent généralement bien, elle est ajustée à la baisse.</li>
      </ol>
      <p>Cela ne s'active qu'à partir d'un échantillon réel suffisant (au moins 5 rejets évalués) \u2014
      avant cela, l'ajustement reste à zéro plutôt que de deviner à partir de trop peu de données. Ce
      n'est pas une affirmation marketing sur une « IA qui apprend » \u2014 c'est un chiffre précis,
      borné et vérifiable, calculé à partir des décisions réelles de votre propre entreprise et de
      leurs résultats réels.</p>
    `,
  },
];

module.exports = frenchIntelligenceEngine;
