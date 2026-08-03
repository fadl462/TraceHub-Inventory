const frenchPosts = [
  {
    title: 'Bienvenue sur TraceHub Inventory',
    slug: 'welcome-to-tracehub-inventory',
    locale: 'fr',
    excerpt: "Pourquoi nous avons conçu une plateforme de gestion d'actifs autour d'une idée simple : vous ne devriez pas avoir besoin de matériel coûteux ni d'un marathon de tableurs pour savoir ce que vous possédez.",
    authorName: 'Équipe TraceHub',
    publishedAt: new Date('2026-08-01'),
    isPublished: true,
    coverImageUrl: '/blog/welcome-cover.svg',
    bodyHtml: `
      <p>Toute entreprise possédant des équipements physiques finit par rencontrer le même problème :
      personne ne peut affirmer avec certitude ce qu'elle possède exactement, où cela se trouve, ni ce
      que cela vaut. Pas par négligence \u2014 par accumulation. Un tableur commencé il y a trois ans avec
      quarante lignes atteint discrètement quatre mille lignes, dont la moitié n'est pas vérifiée,
      certaines décrivant du matériel vendu, perdu ou mis au rebut il y a un an sans que personne n'ait
      mis à jour la feuille.</p>

      <p>TraceHub Inventory existe parce que nous pensons que ce problème est résoluble sans acheter
      de matériel, sans embaucher un administrateur d'actifs à temps plein, et sans traiter la
      dépréciation comme une corvée comptable annuelle. Cet article est une introduction à notre façon
      d'aborder le problème, et une explication en langage clair du fonctionnement réel de la
      plateforme.</p>

      <h3>Les trois points de rupture du suivi d'actifs traditionnel</h3>
      <p>Presque toutes les organisations avec qui nous avons discuté du suivi d'équipement se heurtent
      aux trois mêmes murs, généralement dans cet ordre :</p>
      <p><strong>La visibilité se dégrade avec le temps.</strong> Un tableur ou un registre papier est
      exact le jour de sa création et de moins en moins précis chaque jour suivant. Rien ne force une
      mise à jour lorsqu'un actif est déplacé, réaffecté ou tombe en panne \u2014 le registre et la réalité
      s'éloignent donc jusqu'à ce que quelqu'un le remarque lors d'un audit, généralement de la manière
      la plus difficile.</p>
      <p><strong>La dépréciation devient une estimation.</strong> Sans un système effectuant
      automatiquement le calcul, les valeurs comptables sont soit complètement ignorées, soit estimées
      une fois par an dans une formule de tableur bâclée à laquelle personne ne fait vraiment confiance.
      Les décisions de réparation ou de remplacement finissent par reposer sur l'instinct plutôt que sur
      un chiffre réel.</p>
      <p><strong>Le matériel de suivi coûte cher à justifier.</strong> Les lecteurs RFID et les
      traceurs GPS résolvent de vrais problèmes, mais le coût initial et l'effort d'installation les
      rendent inaccessibles à la plupart des petites et moyennes structures \u2014 précisément le
      segment qui souffre le plus du manque de visibilité au départ.</p>

      <h3>Comment TraceHub aborde chacun de ces points</h3>
      <p>Nous ne cherchions pas à créer un tableur plus intelligent. Nous avons conçu la plateforme
      autour de trois mécanismes précis, chacun visant directement l'un de ces points de rupture.</p>

      <img src="/blog/asset-lifecycle.svg" alt="Cycle de vie d'un actif : Enregistrer, Suivre, Déprécier, Mettre au rebut" style="width:100%;border-radius:16px;margin:1.5rem 0;" />

      <p><strong>Localisation en temps réel, depuis la caméra d'un téléphone.</strong> Chaque actif
      reçoit un code QR unique dès son enregistrement. Définissez vos points de contrôle \u2014 un
      entrepôt, une agence, un chantier \u2014 et n'importe quel membre de l'équipe peut scanner un actif
      à l'entrée ou à la sortie avec la caméra qu'il possède déjà. Aucun lecteur matériel, aucune
      installation, aucun frais de suivi par unité. L'historique de localisation se met à jour à
      l'instant du scan, pas lorsque quelqu'un se souvient de mettre à jour une feuille.</p>

      <p><strong>Dépréciation calculée automatiquement, pas estimée une fois par an.</strong> Chaque
      catégorie d'actif porte un profil de durée de vie utile et de valeur résiduelle. Dès que vous
      saisissez un prix d'achat en enregistrant un actif, TraceHub calcule immédiatement la
      dépréciation linéaire : valeur comptable actuelle, dépréciation annuelle et date de mise au rebut
      suggérée. Exemple concret : un ordinateur portable de 500 $ avec une durée de vie utile de 5 ans
      et une valeur résiduelle de 10 % se déprécie de 90 $ par an \u2014 trois ans plus tard, sa valeur
      comptable se situe à 230 $, calculée à l'instant où vous consultez l'actif plutôt que reconstituée
      en fin d'année.</p>

      <p><strong>Une structure qui évolue avec l'organisation, pas contre elle.</strong> Super Admin,
      Administrateur d'entreprise, Responsable et Personnel voient chacun exactement ce dont leur rôle
      a besoin. Les affectations suivent qui détient actuellement un actif \u2014 qu'il s'agisse d'un
      employé ou d'un contact externe \u2014 avec des rappels automatiques trois jours avant l'échéance,
      puis le jour même. Chaque scan, modification et affectation atterrit dans un seul journal
      d'audit, si bien que « qui avait ceci en dernier » cesse d'être un mystère.</p>

      <h3>À qui cela s'adresse réellement</h3>
      <p>Nous avons conçu TraceHub en pensant à un type d'organisation précis : celle qui possède de
      vrais actifs physiques \u2014 ordinateurs portables, véhicules, générateurs, outils, équipements
      réseau \u2014 répartis sur plus d'un site, gérés par plus d'une personne, où le système informel
      (un tableur partagé, un groupe WhatsApp, la mémoire institutionnelle) commence à montrer ses
      limites. Les entreprises de logistique, les prestataires de services sur le terrain, les
      services informatiques, les cabinets de conseil possédant des parcs d'équipement, et les
      enseignes de vente au détail multi-sites ressentent généralement cela le plus fortement.</p>

      <p>Si vous suivez actuellement votre équipement sur un unique tableur que seule une personne
      comprend vraiment, c'est généralement le moment où cela devient nécessaire à résoudre
      sérieusement \u2014 avant qu'un actif ne disparaisse, pas après.</p>

      <h3>Ce qui s'en vient</h3>
      <p>Cette plateforme est en développement actif. Les rapports, les intégrations et
      l'automatisation sont des domaines que nous continuons à développer, et nous écrirons ici à
      propos de chaque ajout significatif au fur et à mesure de son déploiement \u2014 non pas comme un
      exercice marketing, mais comme un compte rendu honnête de ce qui est réellement nouveau et
      pourquoi nous l'avons conçu ainsi.</p>

      <p>Si vous êtes confronté à l'un des problèmes ci-dessus, les dix premiers actifs sont gratuits
      pendant trente jours, sans carte requise pour commencer. Nous aimerions sincèrement connaître
      votre avis.</p>
    `,
  },
  {
    title: 'Réparer ou remplacer ? Un cadre pratique pour la décision à laquelle tout gestionnaire d\u2019actifs finit par être confronté',
    slug: 'repair-or-replace-decision-framework',
    locale: 'fr',
    excerpt: "La plupart des décisions de « réparer ou remplacer » se prennent à l'instinct, au profit de celui qui parle le plus fort en réunion. Voici un cadre qui remplace l'intuition par des chiffres que vous pouvez réellement défendre.",
    authorName: 'Équipe TraceHub',
    publishedAt: new Date('2026-08-02'),
    isPublished: true,
    coverImageUrl: '/blog/repair-replace-cover.svg',
    bodyHtml: `
      <p>Dans chaque organisation possédant des équipements physiques, il y a en ce moment même un
      générateur, un chariot élévateur ou un véhicule de flotte qui attend dans une file de réparation
      pendant que quelqu'un décide si cela vaut encore la peine d'être réparé. La décision se prend
      généralement de l'une de ces trois façons : celui qui parle le plus fort en réunion l'emporte,
      l'équipe de maintenance répare parce que c'est son travail et que personne ne lui a dit le
      contraire, ou la décision est reportée d'un trimestre parce que personne ne veut assumer la
      dépense en capital. Aucune de ces options n'est réellement une décision \u2014 c'est un choix par
      défaut.</p>

      <p>C'est un problème authentiquement difficile à raisonner à l'instinct, car la véritable réponse
      dépend de la combinaison de chiffres qui vivent dans différents services et se retrouvent
      rarement dans le même tableur : ce que l'actif vaut réellement aujourd'hui, combien il vous a
      coûté en réparations jusqu'à présent, la probabilité qu'il tombe à nouveau en panne bientôt, et
      ce que coûterait un remplacement. Cet article présente un cadre pour combiner correctement ces
      chiffres \u2014 le même que nous avons fini par intégrer directement dans le moteur d'intelligence
      de mise au rebut de TraceHub, parce que nous refaisions ce calcul à la main pour notre propre
      équipement et en avions assez de reconstruire le tableur à chaque fois.</p>

      <h3>Pourquoi « ça marche encore » est la mauvaise question</h3>
      <p>Le réflexe face à un équipement vieillissant est de demander « est-ce que ça fonctionne
      encore ? » et de continuer à réparer tant que la réponse est oui. C'est la mauvaise question,
      pour une raison simple : presque tout peut être maintenu en fonctionnement avec assez d'argent
      et assez de temps d'immobilisation. La bonne question est de savoir si continuer à réparer est
      un bon usage de l'argent par rapport à l'alternative \u2014 et cela nécessite de comparer de vrais
      chiffres, pas des impressions.</p>

      <p>Cinq éléments comptent réellement, et les décisions à l'instinct n'en pèsent généralement
      qu'un ou deux :</p>

      <p><strong>1. L'âge par rapport à la durée de vie utile attendue.</strong> Un chariot élévateur
      de cinq ans avec une durée de vie attendue de sept ans est dans une position très différente du
      même chariot à sa neuvième année. Cela semble évident, mais c'est fréquemment ignoré en
      pratique \u2014 les équipes de maintenance n'ont souvent pas facilement accès à ce qu'est la « durée
      de vie attendue » pour une catégorie d'actif donnée, si bien que ce chiffre n'entre jamais dans
      la conversation.</p>

      <p><strong>2. Les dépenses cumulées de maintenance et de réparation, mesurées par rapport au coût
      de remplacement \u2014 pas au prix d'achat initial.</strong> C'est l'erreur la plus courante que
      nous constatons. Un actif acheté 8 000 $ il y a cinq ans pourrait coûter 12 000 $ à remplacer
      aujourd'hui après inflation et fluctuation monétaire. Si vous avez déjà dépensé 6 000 $ pour
      maintenir l'ancien en fonctionnement, comparer ces 6 000 $ au prix d'origine de 8 000 $ donne
      l'impression d'un quasi-équilibre. Le comparer au véritable coût de remplacement de 12 000 $
      raconte une tout autre histoire : vous êtes à mi-chemin du prix d'une unité neuve, sur une
      machine déjà vieille.</p>

      <p><strong>3. La fréquence des réparations, pas seulement leur coût.</strong> Une machine qui a
      eu besoin de trois réparations au cours des six derniers mois vous dit quelque chose qu'un
      chiffre total en dollars ne capture pas : elle entre dans un schéma de panne, elle n'absorbe pas
      simplement de la malchance ponctuelle. La fréquence est un indicateur avancé ; le coût cumulé est
      un indicateur retardé. Au moment où l'indicateur retardé paraît mauvais, l'indicateur avancé
      clignotait généralement déjà depuis un moment.</p>

      <p><strong>4. L'état de santé actuel</strong> \u2014 pas seulement l'âge et l'historique des
      réparations, mais une véritable évaluation de l'état présent de l'équipement : scores
      d'inspection, évaluations des techniciens, environnement d'exploitation (un générateur
      fonctionnant sur un site côtier poussiéreux à forte corrosion s'use plus vite qu'une unité
      identique dans un entrepôt climatisé, indépendamment de l'âge).</p>

      <p><strong>5. L'importance de l'actif pour les opérations.</strong> Un générateur de secours
      rarement utilisé tolère une décision de réparation ou de remplacement plus lente que l'unique
      véhicule de livraison dont dépend quotidiennement une petite entreprise de logistique. La
      criticité ne change pas le calcul du coût, mais elle change le niveau de risque de cycle de
      réparation que vous pouvez tolérer pendant que la décision se prend.</p>

      <h3>Un exemple concret</h3>
      <p>Prenons une camionnette de taille moyenne utilisée pour les livraisons sur le terrain, achetée
      il y a quatre ans pour 28 000 $, avec une durée de vie utile typique de 8 ans pour cette
      catégorie de véhicule. Au cours de la dernière année, elle a nécessité trois réparations
      imprévues totalisant 4 200 $. Le coût de remplacement actuel pour un véhicule neuf équivalent est
      de 34 000 $ (les prix de cette catégorie ont augmenté depuis l'achat initial). Sa valeur
      comptable actuelle, après quatre ans de dépréciation, se situe autour de 14 000 $.</p>

      <p>Passons en revue les cinq facteurs : elle en est à 50 % de sa durée de vie attendue (pas
      encore un signal fort en soi), mais 4 200 $ de réparations en une seule année contre un coût de
      remplacement de 34 000 $ représente 12 % de la valeur de remplacement dépensée en douze mois \u2014
      un chiffre significatif en soi, et une tendance préoccupante si elle se répète. Trois réparations
      en six mois constituent un schéma de fréquence, pas un incident isolé. Si une inspection récente
      a également signalé un état en déclin, cela fait quatre des cinq facteurs pointant dans la même
      direction. La conclusion n'est pas « ça marche encore, donc on continue » \u2014 c'est « le schéma
      indique que c'est l'année pour planifier le remplacement, pas pour attendre qu'une panne sur la
      route force la décision ».</p>

      <p>Remarquez ce qui a rendu cela possible : non pas un unique signal d'alarme spectaculaire, mais
      plusieurs signaux modérés qui convergent. C'est exactement le genre de schéma que les décisions à
      l'instinct manquent, car aucun chiffre pris isolément ne semble assez alarmant pour être
      soulevé.</p>

      <h3>Transformer cela en un score reproductible, pas en une analyse ponctuelle</h3>
      <img src="/blog/disposal-score-breakdown.svg" alt="Graphique circulaire de la répartition du score de préparation à la mise au rebut : Âge 25%, Coût de maintenance 20%, Dépréciation 15%, Fréquence de réparation 15%, Santé 10%, Valeur marchande 10%, Criticité 5%" style="width:100%;border-radius:16px;margin:1.5rem 0;background:#fff;" />
      <p>Le cadre ci-dessus fonctionne bien comme exercice ponctuel pour un seul actif. Il s'effondre à
      grande échelle \u2014 personne ne relance une analyse manuelle à cinq facteurs chaque fois qu'un
      actif nécessite une réparation, sur un parc de 200 véhicules et machines. C'est la véritable
      raison pour laquelle nous avons conçu le moteur d'intelligence de mise au rebut de TraceHub
      comme un score permanent plutôt qu'un rapport que vous générez à la demande : chaque actif reçoit
      un score de préparation à la mise au rebut en direct (0 à 100), recalculé automatiquement à
      mesure que de nouveaux enregistrements de maintenance, de réparations et d'inspections arrivent,
      pondéré selon l'âge (25 %), la dépréciation (15 %), le coût de maintenance par rapport à la
      valeur de remplacement (20 %), la fréquence des réparations (15 %), le score de santé (10 %), la
      valeur marchande actuelle (10 %) et la criticité opérationnelle (5 %).</p>

      <p>Les pondérations ne sont pas arbitraires \u2014 elles reflètent le fait que le coût de
      maintenance par rapport à la valeur de remplacement et l'âge sont les deux signaux les plus
      lourds en pratique, avec la fréquence des réparations juste derrière, ce qui correspond à ce que
      l'exemple concret ci-dessus a effectivement montré. Lorsque le score franchit un seuil, le
      système ne se contente pas de signaler l'actif \u2014 il recommande une action précise (réparer,
      vendre ou mettre au rebut) et un délai réaliste, et le résumé exécutif est rédigé en langage
      clair plutôt qu'en score brut : « Le coût de réparation dépasse le bénéfice opérationnel
      attendu ; remplacer dans les 3 mois » est une phrase qu'un gestionnaire non technique peut
      exploiter immédiatement.</p>

      <h3>Ce que la plupart des cadres omettent : la recommandation s'est-elle vraiment vérifiée ?</h3>
      <p>Tout modèle de notation finit par être ignoré parfois \u2014 un gestionnaire décide de continuer
      à réparer un actif signalé par le système, pour des raisons qui peuvent être parfaitement
      valables (calendrier de trésorerie, renouvellement de flotte prévu le trimestre prochain, un
      véhicule véritablement encore fiable malgré les chiffres). C'est une décision commerciale
      légitime, pas un échec du système. Mais il vaut la peine de suivre réellement ce qui se passe
      ensuite : l'actif est-il tombé en panne peu après que la recommandation a été ignorée, ou a-t-il
      continué à bien fonctionner pendant une année de plus ?</p>

      <p>Nous avons intégré cette boucle de rétroaction directement dans TraceHub plutôt que de la
      laisser sans réponse : chaque fois qu'une recommandation de mise au rebut est rejetée, le système
      note discrètement le nombre d'incidents de l'actif à ce moment-là, et vérifie plus tard si une
      véritable panne a suivi. Avec le temps, cela construit une réponse honnête et propre à
      l'entreprise à la question « à quel point ces recommandations sont-elles fiables pour nous,
      spécifiquement » \u2014 pas une affirmation marketing sur la précision de l'IA, mais un chiffre réel
      et vérifiable dérivé de ce qui s'est réellement passé après les décisions passées, qui alimente
      ensuite le poids accordé aux futures recommandations.</p>

      <h3>À retenir</h3>
      <p>Vous n'avez pas besoin d'un système sophistiqué pour prendre de meilleures décisions de
      réparation ou de remplacement \u2014 vous devez systématiquement examiner ensemble le coût de
      remplacement (pas le prix d'origine), la fréquence des réparations (pas seulement la dépense
      totale) et l'état actuel, au lieu de vous contenter de « ça marche encore ». Le système ne fait
      que rendre cela cohérent et automatique, plutôt que quelque chose que quelqu'un doit se souvenir
      de faire correctement à chaque fois, pour chaque actif, à travers tout un parc.</p>
    `,
  },
];

module.exports = frenchPosts;
