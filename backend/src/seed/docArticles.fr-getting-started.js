const frenchGettingStarted = [
  {
    title: "Qu'est-ce que TraceHub Inventory ?",
    slug: 'what-is-tracehub-inventory',
    locale: 'fr',
    category: 'Bien démarrer', categorySortOrder: 0, sortOrder: 0,
    excerpt: 'Un tour rapide de ce que fait TraceHub et à qui il s\u2019adresse.',
    bodyHtml: `
      <p>TraceHub Inventory est une plateforme multi-locataire de gestion des actifs et des stocks,
      conçue pour les organisations possédant des équipements physiques \u2014 ordinateurs portables,
      véhicules, générateurs, outils, mobilier, tout ce qui a un prix d'achat et une durée de vie
      utile \u2014 et qui ont besoin de savoir où cela se trouve, ce que cela vaut, qui le détient, et
      quand cela nécessite une attention.</p>

      <p>Ce qui le distingue d'un tableur ou d'un registre d'actifs basique, c'est le
      <strong>moteur d'intelligence des actifs</strong> : six moteurs de notation réels et
      déterministes qui fonctionnent en continu en arrière-plan sur chaque actif enregistré,
      calculant la dépréciation, un score de santé, un risque de panne, un calendrier de maintenance
      et une recommandation de mise au rebut \u2014 le tout sans que vous ayez à faire quoi que ce soit
      au-delà de la saisie initiale des données.</p>

      <h3>À qui cela s'adresse</h3>
      <ul>
        <li><strong>Les équipes opérationnelles</strong> qui suivent l'équipement dans des entrepôts,
        des agences ou des chantiers.</li>
        <li><strong>Les équipes financières</strong> qui ont besoin d'une dépréciation précise et
        automatique plutôt que d'un tableur maintenu manuellement.</li>
        <li><strong>Les gestionnaires informatiques/d'actifs</strong> qui décident, actif par actif,
        s'il faut réparer ou remplacer.</li>
        <li><strong>Les dirigeants</strong> qui veulent une vue d'ensemble du portefeuille \u2014 santé
        du parc, capital à risque, économies projetées \u2014 sans devoir fouiller dans les
        enregistrements individuels.</li>
      </ul>

      <h3>Comment c'est organisé</h3>
      <p>Tout dans TraceHub est circonscrit à l'espace de travail de votre entreprise. Au sein de cet
      espace :</p>
      <ul>
        <li><strong>Les actifs</strong> sont les pièces d'équipement individuelles que vous enregistrez.</li>
        <li><strong>Les emplacements</strong> sont des points de contrôle (un entrepôt, une agence) où
        les actifs sont scannés à l'entrée et à la sortie.</li>
        <li><strong>Les affectations</strong> suivent quel membre du personnel ou contact externe
        détient actuellement un actif.</li>
        <li><strong>Les dossiers de mise au rebut</strong> suivent un flux d'approbation formel en six
        étapes lorsque le temps d'un actif est écoulé.</li>
        <li><strong>L'équipe</strong> est l'endroit où vous invitez des collègues et définissez leur
        rôle (Administrateur d'entreprise, Responsable ou Personnel).</li>
      </ul>

      <p>Chacun de ces domaines est alimenté par le moteur d'intelligence \u2014 vous verrez des scores
      de santé sur la liste des actifs, un panneau d'intelligence du parc sur le tableau de bord, et
      des recommandations de mise au rebut pilotant le flux de mise au rebut.</p>
    `,
  },
  {
    title: 'Créer votre espace de travail',
    slug: 'creating-your-workspace',
    locale: 'fr',
    category: 'Bien démarrer', categorySortOrder: 0, sortOrder: 1,
    excerpt: "S'inscrire, votre essai gratuit, et ce qui se passe le premier jour.",
    bodyHtml: `
      <p>Cliquez sur <strong>« Commencer gratuitement »</strong> sur la page d'accueil pour créer
      votre espace de travail. Vous fournirez votre nom, votre e-mail, un mot de passe et le nom de
      votre entreprise \u2014 c'est tout. Aucune carte n'est requise, et vous devenez automatiquement le
      premier <strong>Administrateur d'entreprise</strong> de votre nouvel espace de travail.</p>

      <h3>Votre essai</h3>
      <p>Chaque nouvel espace de travail commence par un essai de 30 jours avec une limite de 10
      actifs. Vous pouvez enregistrer jusqu'à 10 actifs et utiliser chaque fonctionnalité en
      profondeur \u2014 le moteur d'intelligence, le scan, les affectations, le flux de mise au rebut,
      les rapports \u2014 rien n'est restreint pendant l'essai. Lorsque vous êtes prêt à ajouter plus de
      10 actifs ou avez besoin de plus de sièges d'équipe, passez à un forfait payant (Basic, Pro ou
      Enterprise) depuis <strong>Facturation</strong>.</p>

      <h3>Que faire en premier</h3>
      <ol>
        <li>Allez dans <strong>Actifs \u2192 Ajouter un actif</strong> et enregistrez votre premier
        équipement. Saisissez un prix d'achat et une catégorie, et le moteur de dépréciation estime
        immédiatement sa valeur actuelle, sa durée de vie utile et sa valeur résiduelle.</li>
        <li>Allez dans <strong>Emplacements</strong> et ajoutez votre premier point de contrôle (un
        entrepôt, un bureau) \u2014 c'est là que votre équipe scannera les actifs.</li>
        <li>Allez dans <strong>Équipe</strong> et invitez votre premier collègue si vous ne
        travaillez pas seul.</li>
      </ol>

      <p>Consultez la <strong>Liste de contrôle de démarrage rapide</strong> pour le chemin le plus
      rapide de zéro à un espace de travail entièrement configuré.</p>
    `,
  },
  {
    title: 'Liste de contrôle de démarrage rapide',
    slug: 'quick-start-checklist',
    locale: 'fr',
    category: 'Bien démarrer', categorySortOrder: 0, sortOrder: 2,
    excerpt: "Le chemin le plus rapide entre l'inscription et un espace de travail pleinement fonctionnel.",
    bodyHtml: `
      <p>Si vous préférez aller vite plutôt que de lire chaque article en premier, voici le chemin
      réel le plus court vers une configuration fonctionnelle.</p>

      <h3>1. Configurez vos catégories et emplacements (5 minutes)</h3>
      <p>Consultez <strong>Actifs \u2192 Catégories</strong> pour les catégories par défaut
      (Ordinateurs portables, Véhicules, Mobilier de bureau, etc.) et ajustez le profil de durée de
      vie utile/valeur résiduelle pour chacune si votre équipement vieillit différemment de ce que
      supposent les valeurs par défaut. Ajoutez ensuite vos véritables points de contrôle sous
      <strong>Emplacements</strong> \u2014 un entrepôt, chaque agence, chaque chantier.</p>

      <h3>2. Enregistrez vos actifs réels (quelle que soit la longueur de votre liste)</h3>
      <p>Pour chaque actif : nom, catégorie, prix d'achat, date d'achat. C'est le minimum pour que le
      moteur de dépréciation fonctionne. Si vous souhaitez une notation de santé/panne plus riche
      immédiatement, ouvrez également la section « Données du moteur d'intelligence des actifs » du
      formulaire et renseignez l'intensité d'utilisation, l'historique de maintenance et
      l'environnement \u2014 plus vous en fournissez, plus les scores de l'IA sont fiables dès le
      premier jour.</p>

      <h3>3. Imprimez ou affichez vos codes QR</h3>
      <p>Chaque actif reçoit un code QR dès sa création \u2014 ouvrez l'actif et cliquez sur
      <strong>Télécharger le QR</strong>. Imprimez-le sur une étiquette ou affichez-le simplement sur
      un écran près de l'équipement pour l'instant.</p>

      <h3>4. Invitez votre équipe</h3>
      <p>Allez dans <strong>Équipe \u2192 Ajouter un membre</strong>. Chaque personne invitée reçoit un
      mot de passe temporaire par e-mail et doit définir son propre mot de passe (avec une
      configuration A2F optionnelle) avant de pouvoir accéder à quoi que ce soit d'autre.</p>

      <h3>5. Effectuez un vrai scan</h3>
      <p>Depuis <strong>Scanner</strong>, utilisez la caméra de votre téléphone pour scanner le code QR
      d'un actif et l'enregistrer dans un emplacement. Cela confirme que tout votre flux \u2014
      génération de QR, scan, suivi de localisation \u2014 fonctionne de bout en bout.</p>

      <p>C'est tout \u2014 tout le reste (affectations, flux de mise au rebut, rapports) s'appuie sur
      cette même base et vous pouvez vous en emparer selon vos besoins.</p>
    `,
  },
  {
    title: 'Rôles et permissions',
    slug: 'roles-and-permissions',
    locale: 'fr',
    category: 'Bien démarrer', categorySortOrder: 0, sortOrder: 3,
    excerpt: "Ce que peuvent faire respectivement l'Administrateur d'entreprise, le Responsable et le Personnel.",
    bodyHtml: `
      <p>Chaque personne de votre espace de travail possède l'un des trois rôles. Il n'existe pas de
      système de permissions personnalisé/granulaire au-delà de ces trois rôles \u2014 ils sont conçus
      pour s'aligner clairement sur la façon dont la plupart des équipes opérationnelles sont
      réellement structurées.</p>

      <table style="width:100%;border-collapse:collapse;margin:1rem 0;">
        <thead><tr style="text-align:left;border-bottom:2px solid #E2E8F0;">
          <th style="padding:0.5rem;">Rôle</th><th style="padding:0.5rem;">Peut faire</th>
        </tr></thead>
        <tbody>
          <tr style="border-bottom:1px solid #EDF2F7;">
            <td style="padding:0.5rem;vertical-align:top;"><strong>Administrateur d'entreprise</strong></td>
            <td style="padding:0.5rem;">Tout \u2014 y compris la facturation, l'invitation/le retrait de
            membres de l'équipe, et l'approbation finale dans le flux de mise au rebut. La personne
            qui s'inscrit en premier devient automatiquement Administrateur d'entreprise ; vous
            pouvez en avoir plusieurs.</td>
          </tr>
          <tr style="border-bottom:1px solid #EDF2F7;">
            <td style="padding:0.5rem;vertical-align:top;"><strong>Responsable</strong></td>
            <td style="padding:0.5rem;">Actifs, affectations, le flux de mise au rebut (étape de
            revue du responsable), emplacements et rapports. Ne peut pas accéder à la Facturation ni
            à la gestion de l'Équipe.</td>
          </tr>
          <tr>
            <td style="padding:0.5rem;vertical-align:top;"><strong>Personnel</strong></td>
            <td style="padding:0.5rem;">Accès opérationnel quotidien : enregistrer et scanner des
            actifs, consulter et créer des affectations. Ne peut pas approuver les mises au rebut,
            gérer l'équipe, ni voir la facturation.</td>
          </tr>
        </tbody>
      </table>

      <p>Les rôles sont définis lorsque vous invitez quelqu'un depuis <strong>Équipe \u2192 Ajouter un
      membre</strong>, et un Administrateur d'entreprise peut modifier le rôle de n'importe qui plus
      tard depuis la même page.</p>
    `,
  },
];

module.exports = frenchGettingStarted;
