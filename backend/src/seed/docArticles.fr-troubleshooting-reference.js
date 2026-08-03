const frenchTroubleshootingReference = [
  {
    title: 'Je ne peux pas me connecter',
    slug: 'troubleshoot-cant-log-in',
    locale: 'fr',
    category: 'Dépannage et FAQ', categorySortOrder: 10, sortOrder: 0,
    excerpt: 'Les causes les plus courantes et ce qu\u2019il faut vérifier.',
    bodyHtml: `
      <ul>
        <li><strong>« E-mail ou mot de passe invalide »</strong> \u2014 vérifiez qu'il n'y a pas
        d'espaces superflus, et rappelez-vous que les mots de passe sont sensibles à la casse.
        Utilisez <strong>Mot de passe oublié</strong> en cas de doute.</li>
        <li><strong>Rien ne se passe / un écran bloqué apparaît</strong> \u2014 si vous avez été
        récemment invité dans un espace de travail, vous êtes peut-être sur l'écran de configuration
        obligatoire du mot de passe à la première connexion ; vous devez définir votre propre mot de
        passe (et optionnellement l'A2F) avant que quoi que ce soit d'autre ne devienne accessible.
        C'est appliqué par conception, pas un bogue.</li>
        <li><strong>Code A2F rejeté</strong> \u2014 les codes de l'application d'authentification sont
        basés sur le temps ; assurez-vous que l'horloge de votre appareil est exacte. Si vous avez
        complètement perdu l'accès à votre application d'authentification, contactez votre
        Administrateur d'entreprise, car la réinitialisation de l'A2F pour un compte verrouillé est
        une action administrative.</li>
      </ul>
    `,
  },
  {
    title: "Mon coéquipier invité n'a jamais reçu son e-mail",
    slug: 'troubleshoot-invite-email-not-received',
    locale: 'fr',
    category: 'Dépannage et FAQ', categorySortOrder: 10, sortOrder: 1,
    excerpt: "Presque toujours un problème de configuration SMTP, pas un bogue dans l'invitation elle-même.",
    bodyHtml: `
      <p>Si un membre de l'équipe nouvellement invité ne reçoit jamais son e-mail de mot de passe
      temporaire, la cause la plus courante de loin est que le fournisseur SMTP de votre plateforme
      n'a pas encore été configuré par un Super Admin \u2014 sans cela, TraceHub n'échoue pas
      bruyamment, il enregistre silencieusement l'e-mail au lieu de l'envoyer. Vérifiez auprès de la
      personne qui gère votre déploiement TraceHub que le SMTP est bien configuré, ou vérifiez les
      dossiers spam/indésirables comme seconde possibilité.</p>
    `,
  },
  {
    title: "Le score de santé, le risque de panne ou la recommandation d'un actif n'affiche rien",
    slug: 'troubleshoot-blank-intelligence-scores',
    locale: 'fr',
    category: 'Dépannage et FAQ', categorySortOrder: 10, sortOrder: 2,
    excerpt: 'Pourquoi un actif tout neuf peut brièvement afficher des scores vides.',
    bodyHtml: `
      <p>Le moteur d'intelligence se recalcule chaque fois qu'un actif est créé ou modifié \u2014 si
      vous voyez des scores vides immédiatement après avoir créé un actif, actualisez la page ; le
      calcul s'exécute de façon synchrone lors de l'enregistrement de l'actif, donc un score vide
      après une actualisation est inhabituel et mérite de vérifier que l'actif a bien un prix d'achat
      et une catégorie définis, car ce sont les entrées minimales dont le moteur a besoin pour
      produire quoi que ce soit.</p>
    `,
  },
  {
    title: "Scanner un code QR indique que l'actif n'a pas été trouvé",
    slug: 'troubleshoot-scan-asset-not-found',
    locale: 'fr',
    category: 'Dépannage et FAQ', categorySortOrder: 10, sortOrder: 3,
    excerpt: "Causes courantes : codes imprimés obsolètes, mauvais espace de travail, ou actif archivé.",
    bodyHtml: `
      <ul>
        <li><strong>L'actif a été archivé ou supprimé</strong> depuis que l'étiquette a été
        imprimée \u2014 son jeton QR ne correspond plus à un actif actif.</li>
        <li><strong>Vous êtes connecté à l'espace de travail d'une autre entreprise</strong> que
        celle qui a enregistré l'actif \u2014 les jetons QR sont propres à l'entreprise qui les a
        créés.</li>
        <li><strong>Un code imprimé endommagé ou de mauvaise qualité</strong> \u2014 essayez l'option
        de saisie manuelle du jeton sur la page Scanner plutôt que la caméra si une étiquette
        physique est devenue difficile à lire.</li>
      </ul>
    `,
  },
  {
    title: "Quelles devises sont prises en charge pour le prix d'achat ?",
    slug: 'faq-supported-currencies',
    locale: 'fr',
    category: 'Dépannage et FAQ', categorySortOrder: 10, sortOrder: 4,
    excerpt: 'USD est la norme ; la conversion GHS est active ; d\u2019autres sont prévues.',
    bodyHtml: `
      <p>Le prix d'achat est toujours stocké en USD sur toute la plateforme, pour des rapports et
      comparaisons cohérents. Si vous avez payé en cedis ghanéens (GHS), utilisez l'outil de
      conversion de devise intégré sur le formulaire d'ajout/modification d'actif pour convertir
      automatiquement votre montant local en USD. La conversion en yuan chinois, euro, et livre
      sterling est prévue mais pas encore active \u2014 affichée comme « bientôt disponible » dans le
      sélecteur de devise.</p>
    `,
  },
  {
    title: 'TraceHub suit-il la localisation GPS ?',
    slug: 'faq-does-tracehub-track-gps',
    locale: 'fr',
    category: 'Dépannage et FAQ', categorySortOrder: 10, sortOrder: 5,
    excerpt: 'Non \u2014 et voici pourquoi c\u2019est un choix délibéré, pas une limitation.',
    bodyHtml: `
      <p>Non. TraceHub n'utilise délibérément aucun matériel de suivi GPS ou IoT. La localisation est
      suivie via le <strong>scan de points de contrôle</strong> \u2014 l'emplacement d'un actif se met
      à jour lorsque quelqu'un scanne réellement son code QR à un emplacement, en utilisant rien de
      plus qu'une caméra de téléphone. C'est un choix de conception économique et purement logiciel :
      aucun matériel à acheter, installer, ou entretenir. Le compromis est honnête et mérite d'être
      compris : l'emplacement affiché d'un actif est celui où il a été <em>scanné en dernier</em>, pas
      une position en direct et continuellement mise à jour.</p>
    `,
  },
  {
    title: 'Glossaire des termes',
    slug: 'glossary-of-terms',
    locale: 'fr',
    category: 'Référence', categorySortOrder: 11, sortOrder: 0,
    excerpt: "Chaque terme propre à TraceHub en un seul endroit \u2014 mis à jour à mesure que la plateforme grandit.",
    bodyHtml: `
      <div class="th-legal-callout">Ce glossaire est maintenu à jour selon la version actuelle, non
      figé au lancement \u2014 à mesure que de nouvelles fonctionnalités et de nouveaux termes sont
      ajoutés à TraceHub, cette page est mise à jour en conséquence.</div>

      <h3 style="margin-top:1.5rem;">Scores et moteurs</h3>
      <dl>
        <dt><strong>Score de santé</strong></dt><dd>Composite pondéré de 0 à 100 selon l'âge, la maintenance, les réparations, l'utilisation, l'inspection, et l'environnement. Voir <strong>Score de santé de l'actif</strong>.</dd>
        <dt><strong>Niveaux de santé</strong></dt><dd>Les cinq bandes dans lesquelles se situe un score de santé : Excellent (90-100), Sain (75-89), Attention requise (60-74), Risque élevé (40-59), Critique (en dessous de 40).</dd>
        <dt><strong>Score de risque</strong></dt><dd>Indice de risque global de 0 à 100 derrière les quatre horizons de probabilité de panne (30/60/90/180 jours).</dd>
        <dt><strong>Score de préparation à la mise au rebut</strong></dt><dd>Score de 0 à 100 derrière la recommandation GARDER/RÉPARER/VENDRE/DÉCLASSER/REMPLACER.</dd>
        <dt><strong>Score de confiance IA</strong></dt><dd>La quantité de preuves réelles étayant les scores d'un actif donné \u2014 champs renseignés, enregistrements de maintenance, données d'inspection, valeur marchande.</dd>
        <dt><strong>Boucle d'apprentissage de l'IA</strong></dt><dd>Suit si le fait d'ignorer une recommandation de mise au rebut a ensuite été suivi d'une véritable panne, réinjectant un ajustement borné dans la confiance future.</dd>
        <dt><strong>Panneau d'informations IA</strong></dt><dd>Cinq détecteurs de tendances basés sur des règles sur le tableau de bord \u2014 voir <strong>la répartition complète</strong>.</dd>
        <dt><strong>Moteur de planification de maintenance / Date de prochain entretien</strong></dt><dd>Une véritable date prédite à laquelle un actif est le prochain dû pour un entretien, basée sur l'intensité d'utilisation et la santé actuelle.</dd>
        <dt><strong>Formule personnalisée</strong></dt><dd>Une formule de dépréciation rédigée par l'utilisateur utilisant un analyseur arithmétique sûr et restreint \u2014 aucune exécution de code.</dd>
      </dl>

      <h3>Niveau portefeuille (panneau d'intelligence du parc)</h3>
      <dl>
        <dt><strong>Santé du portefeuille</strong></dt><dd>Moyenne pondérée à l'échelle du parc à travers les niveaux de santé.</dd>
        <dt><strong>Risque de capital</strong></dt><dd>% de la <em>valeur</em> totale du parc (pas le nombre d'actifs) se trouvant dans des actifs au niveau de santé Risque élevé/Critique.</dd>
        <dt><strong>Disponibilité des actifs</strong></dt><dd>% de votre parc actuellement au statut « Disponible ».</dd>
        <dt><strong>Note du parc</strong></dt><dd>Note lettrée composite de A à F issue de la Santé du portefeuille, la Disponibilité des actifs, et le Risque de capital.</dd>
        <dt><strong>Carte thermique exécutive</strong></dt><dd>Répartition cliquable par niveau de santé sur le tableau de bord, renvoyant vers une liste d'actifs filtrée.</dd>
        <dt><strong>Économies projetées</strong></dt><dd>Dépenses réelles de maintenance/réparation effectuées jusqu'à présent sur des actifs déjà recommandés pour le remplacement, la mise au rebut, ou la vente.</dd>
      </dl>

      <h3>Statut des actifs</h3>
      <dl>
        <dt><strong>Disponible / Affecté / En maintenance / Réservé / Mis au rebut / Perdu</strong></dt>
        <dd>Les six statuts possibles qu'un actif peut avoir \u2014 voir <strong>Comprendre le statut d'un actif</strong>.</dd>
        <dt><strong>Actif inactif</strong></dt><dd>Un actif au statut « Disponible » ayant enregistré plus de 200 heures d'inactivité \u2014 un candidat pour réaffectation ou vente.</dd>
      </dl>

      <h3>Suivi et flux de travail</h3>
      <dl>
        <dt><strong>Point de contrôle</strong></dt><dd>Un emplacement \u2014 un entrepôt, une agence, ou un site \u2014 où les actifs sont scannés à l'entrée et à la sortie.</dd>
        <dt><strong>Dossier de mise au rebut</strong></dt><dd>Un enregistrement formel suivant un actif à travers le flux de mise au rebut en six étapes.</dd>
        <dt><strong>Étapes de mise au rebut</strong></dt><dd>Signalé \u2192 Revue du responsable \u2192 Revue financière \u2192 Approuvé \u2192 (Enchères/Vente/Don/Rebut/Recyclage) \u2192 Mis au rebut. Un dossier peut aussi être Rejeté à n'importe quelle étape.</dd>
        <dt><strong>Statut d'affectation</strong></dt><dd>Actif, En retard, Rendu, ou Annulé.</dd>
        <dt><strong>Frais de location</strong></dt><dd>Une charge optionnelle suivie sur une affectation lorsque l'équipement est loué, avec un bouton bascule Payé/Non payé.</dd>
        <dt><strong>Journal d'audit</strong></dt><dd>Un enregistrement réel et horodaté de chaque action significative dans votre espace de travail.</dd>
      </dl>

      <h3>Rôles et sécurité</h3>
      <dl>
        <dt><strong>Administrateur d'entreprise / Responsable / Personnel</strong></dt><dd>Les trois rôles \u2014 voir <strong>Rôles et permissions</strong>.</dd>
        <dt><strong>Authentification à deux facteurs (A2F)</strong></dt><dd>Une étape de connexion supplémentaire optionnelle via n'importe quelle application d'authentification.</dd>
        <dt><strong>Première connexion en attente</strong></dt><dd>Un statut de membre de l'équipe affiché jusqu'à ce qu'il termine la configuration obligatoire du mot de passe temporaire.</dd>
      </dl>

      <h3>Facturation</h3>
      <dl>
        <dt><strong>Essai / Basic / Pro / Enterprise</strong></dt><dd>Les niveaux d'abonnement, chacun avec ses propres limites d'actifs et d'utilisateurs.</dd>
        <dt><strong>Statut d'abonnement</strong></dt><dd>En essai, Actif, En retard de paiement, Annulé, ou Expiré.</dd>
        <dt><strong>Code de réduction</strong></dt><dd>Un code de réduction (pourcentage ou montant fixe) qu'un Super Admin peut créer pour les nouvelles inscriptions.</dd>
      </dl>

      <p style="margin-top:1.5rem;font-size:0.85rem;color:#6B7280;">Il manque un terme que vous vous attendiez à voir ici ? Demandez à l'assistant IA, ou informez-en l'Administrateur d'entreprise de votre espace de travail afin qu'il puisse être ajouté.</p>
    `,
  },
];

module.exports = frenchTroubleshootingReference;
