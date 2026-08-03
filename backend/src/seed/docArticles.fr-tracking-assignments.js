const frenchTrackingAssignments = [
  {
    title: 'Configurer les emplacements',
    slug: 'setting-up-locations',
    locale: 'fr',
    category: 'Suivi et scan', categorySortOrder: 3, sortOrder: 0,
    excerpt: 'Points de contrôle, adresses, et la carte en direct.',
    bodyHtml: `
      <p>Les emplacements sont les points de contrôle où vos actifs sont scannés à l'entrée et à la
      sortie \u2014 un entrepôt, une agence, un chantier. Ajoutez-en un depuis
      <strong>Emplacements \u2192 Ajouter un emplacement</strong> avec un nom et, optionnellement, une
      adresse et des coordonnées.</p>

      <h3>Définir les coordonnées</h3>
      <p>Vous pouvez saisir directement la latitude/longitude, ou cliquer sur la carte interactive
      dans le formulaire pour déposer une épingle \u2014 aucun service de géocodage séparé ni clé API
      n'est nécessaire. Une fois qu'un emplacement possède des coordonnées, il apparaît sur la carte
      en direct aux côtés de la liste des emplacements, qui affiche par défaut une vue mondiale
      puisque TraceHub ne fait aucune supposition sur l'emplacement de vos opérations.</p>

      <h3>Modifier et supprimer</h3>
      <p>Utilisez l'icône crayon sur n'importe quel emplacement pour mettre à jour ses détails, ou
      l'icône corbeille pour le supprimer. Supprimer un emplacement ne supprime pas l'historique des
      actifs qui y ont été scannés autrefois \u2014 cela le retire seulement comme destination de scan
      future.</p>
    `,
  },
  {
    title: 'Scanner des actifs',
    slug: 'scanning-assets',
    locale: 'fr',
    category: 'Suivi et scan', categorySortOrder: 3, sortOrder: 1,
    excerpt: 'Deux façons de scanner, et ce qui se passe réellement quand vous le faites.',
    bodyHtml: `
      <p>Il existe deux façons de scanner un actif à l'entrée ou à la sortie d'un emplacement :</p>
      <ol>
        <li><strong>Scanner une étiquette QR physique avec n'importe quelle caméra de téléphone.</strong>
        Cela ouvre la véritable URL encodée dans l'étiquette, vous connecte si nécessaire, et vous
        amène au scanner intégré à l'application avec cet actif déjà recherché.</li>
        <li><strong>Utiliser directement le scanner intégré à l'application.</strong> Allez dans
        <strong>Scanner</strong>, et utilisez soit la caméra de votre appareil en direct (fonctionne
        sur téléphone ou ordinateur portable avec webcam), soit saisissez manuellement un jeton si
        vous n'avez pas accès à une caméra.</li>
      </ol>

      <p>Une fois l'actif trouvé, choisissez l'emplacement dans le menu déroulant et confirmez \u2014
      cela met à jour immédiatement l'<strong>emplacement actuel</strong> de l'actif et enregistre un
      véritable événement de localisation horodaté.</p>

      <h3>Important : ceci est un suivi par point de contrôle, pas du GPS</h3>
      <p>L'« emplacement actuel » d'un actif est l'endroit où il a été <em>scanné en dernier</em> \u2014
      il ne se met pas à jour en continu et aucun matériel GPS n'est impliqué. Si personne ne scanne
      un actif pendant trois semaines, il affichera toujours l'emplacement d'il y a trois semaines.
      C'est un choix de conception délibéré et économique (aucun matériel à installer ou à
      entretenir), pas une limitation à contourner \u2014 voir <strong>Historique de localisation et
      chronologie de l'actif</strong> pour savoir comment consulter l'historique complet des scans
      pour n'importe quel actif.</p>
    `,
  },
  {
    title: "Historique de localisation et chronologie de l'actif",
    slug: 'location-history-and-timeline',
    locale: 'fr',
    category: 'Suivi et scan', categorySortOrder: 3, sortOrder: 2,
    excerpt: "Où voir partout où un actif est passé.",
    bodyHtml: `
      <p>La propre page de chaque actif possède une véritable <strong>chronologie</strong> \u2014 un
      unique historique chronologique fusionnant chaque enregistrement daté existant réellement pour
      lui : date d'achat, historique d'affectation/de retour, scans de localisation, inspections, et
      changements d'étape du flux de mise au rebut. Rien ici n'est inventé \u2014 si un actif n'a pas
      de date d'achat enregistrée, la chronologie omet correctement cette entrée plutôt que d'en
      deviner une.</p>

      <p>Pour une vue à l'échelle de l'entreprise sur tous les actifs, allez dans
      <strong>Rapports \u2192 Activité par emplacement</strong>, qui répertorie chaque événement de
      scan sur tout votre parc avec des filtres d'emplacement et de type d'événement, exportable en
      CSV, PDF ou PowerPoint.</p>
    `,
  },
  {
    title: 'Affecter des actifs à des personnes',
    slug: 'assigning-assets-to-people',
    locale: 'fr',
    category: 'Affectations', categorySortOrder: 4, sortOrder: 0,
    excerpt: 'Personnel interne et contacts externes, dates de retour attendues, et frais de location.',
    bodyHtml: `
      <p>Allez dans <strong>Affectations \u2192 Nouvelle affectation</strong>. Vous pouvez affecter un
      actif à un coéquipier déjà présent dans votre espace de travail, ou à un contact externe par
      nom (avec e-mail et téléphone optionnels) si vous prêtez de l'équipement à quelqu'un en dehors
      de votre organisation \u2014 un sous-traitant, un locataire.</p>

      <h3>Date de retour attendue</h3>
      <p>Définir une date de retour attendue est ce qui active le système de rappels \u2014 voir
      <strong>Rappels de retour et alertes de retard</strong>. La laisser vide signifie que l'actif
      est affecté indéfiniment sans suivi de rappel.</p>

      <h3>Frais de location</h3>
      <p>Si vous louez de l'équipement moyennant des frais (courant pour les machines, générateurs,
      véhicules), définissez un montant et une devise de frais de location sur l'affectation. Cela
      apparaît dans la liste des affectations avec un bouton bascule Payé/Non payé qu'un Responsable
      ou Administrateur d'entreprise peut cliquer pour marquer le paiement reçu.</p>
    `,
  },
  {
    title: 'Rappels de retour et alertes de retard',
    slug: 'return-reminders-and-overdue-alerts',
    locale: 'fr',
    category: 'Affectations', categorySortOrder: 4, sortOrder: 1,
    excerpt: 'Exactement quand les e-mails partent, et à qui.',
    bodyHtml: `
      <p>TraceHub envoie de véritables rappels automatiques par e-mail liés à la date de retour
      attendue d'une affectation \u2014 rien ici ne vous demande de vous souvenir de relancer qui que
      ce soit manuellement.</p>
      <ol>
        <li><strong>3 jours avant</strong> la date de retour attendue : un rappel à la personne
        détenant l'actif.</li>
        <li><strong>Le jour de l'échéance lui-même</strong> : un autre rappel, et le statut de
        l'affectation bascule vers « en retard » s'il n'a pas été rendu.</li>
        <li><strong>Chaque jour où il reste en retard</strong> : une nouvelle alerte est envoyée \u2014
        pas une seule fois \u2014 à <em>la fois</em> la personne détenant l'actif et <em>chaque</em>
        Administrateur d'entreprise de votre espace de travail, avec un véritable décompte de jours en
        cours (« En retard de 4 jours ») plutôt qu'un vague rappel.</li>
      </ol>
      <p>Sur la liste des affectations et le panneau « Actifs actuellement affectés » du tableau de
      bord, un élément en retard s'affiche en rouge gras avec le nombre exact de jours détenus et de
      jours de retard \u2014 pas besoin de faire le calcul vous-même.</p>
    `,
  },
  {
    title: 'Marquer un actif comme rendu',
    slug: 'marking-an-asset-returned',
    locale: 'fr',
    category: 'Affectations', categorySortOrder: 4, sortOrder: 2,
    excerpt: "Clôturer une affectation et ce qui se passe automatiquement.",
    bodyHtml: `
      <p>Depuis la liste des affectations, cliquez sur <strong>Marquer comme rendu</strong> sur
      n'importe quelle affectation active ou en retard. Cela effectue immédiatement : le statut de
      l'affectation passe à « rendu », le statut de l'actif revient à « disponible », toute autre
      alerte de retard pour cette affectation s'arrête, et une véritable entrée « Rendu » horodatée
      est enregistrée sur la chronologie de l'actif.</p>
    `,
  },
];

module.exports = frenchTrackingAssignments;
