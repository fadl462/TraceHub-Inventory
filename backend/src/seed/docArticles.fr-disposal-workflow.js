const frenchDisposalWorkflow = [
  {
    title: 'Le flux de mise au rebut en six étapes',
    slug: 'six-stage-disposal-workflow',
    locale: 'fr',
    category: 'Flux de mise au rebut', categorySortOrder: 5, sortOrder: 0,
    excerpt: 'De Signalé à Mis au rebut, avec de véritables portes d\u2019approbation et une journalisation d\u2019audit.',
    bodyHtml: `
      <p>Lorsqu'un actif atteint la fin de sa durée de vie utile, TraceHub suit un flux formel en six
      étapes plutôt qu'un simple bouton « marquer comme mis au rebut » \u2014 adapté aux organisations
      qui ont besoin d'une véritable piste d'approbation pour les décisions relatives aux
      immobilisations.</p>
      <ol>
        <li><strong>Signalé</strong> \u2014 un dossier de mise au rebut est ouvert, soit manuellement,
        soit en cliquant sur « Signaler pour mise au rebut » lorsque le moteur de mise au rebut le
        recommande.</li>
        <li><strong>Revue du responsable</strong> \u2014 un Responsable ou Administrateur d'entreprise
        examine le dossier.</li>
        <li><strong>Revue financière</strong> \u2014 une étape de validation financière.</li>
        <li><strong>Approuvé</strong> \u2014 autorisé à procéder.</li>
        <li><strong>Enchères / Vente / Don / Rebut / Recyclage</strong> \u2014 la méthode de mise au
        rebut réelle, enregistrée avec un montant de vente final le cas échéant.</li>
        <li><strong>Mis au rebut</strong> \u2014 étape finale ; le statut de l'actif se met
        automatiquement à jour vers « Mis au rebut ».</li>
      </ol>
      <p>Un dossier peut aussi être <strong>rejeté</strong> à n'importe quelle étape avec un motif
      requis \u2014 cela alimente directement la boucle d'apprentissage de l'IA (voir <strong>Score de
      confiance IA et la boucle d'apprentissage</strong>), qui vérifie plus tard si une véritable
      panne a suivi la décision de garder l'actif en service.</p>
      <p>Chaque transition est enregistrée dans la piste d'audit avec un véritable horodatage, et
      apparaît également sur la chronologie propre de l'actif.</p>
    `,
  },
  {
    title: "Signaler un actif et les restrictions par rôle",
    slug: 'flagging-and-role-gates',
    locale: 'fr',
    category: 'Flux de mise au rebut', categorySortOrder: 5, sortOrder: 1,
    excerpt: 'Qui peut faire quoi à chaque étape.',
    bodyHtml: `
      <p>Tout membre de l'équipe avec un accès Personnel ou supérieur peut signaler un actif pour
      mise au rebut depuis sa page de détail. À partir de là, les transitions d'étape nécessitent le
      rôle approprié : les Responsables peuvent faire avancer un dossier à travers la revue du
      responsable ; la validation au niveau financier et l'approbation finale nécessitent un accès
      Administrateur d'entreprise. Cela garantit qu'une seule personne ne peut pas faire passer
      unilatéralement un équipement par la mise au rebut sans que les bonnes personnes ne se
      prononcent.</p>
      <p>Suivez tous les dossiers ouverts depuis <strong>Dossiers de mise au rebut</strong>,
      filtrables par étape.</p>
    `,
  },
  {
    title: 'Rejeter un dossier de mise au rebut',
    slug: 'rejecting-a-disposal-case',
    locale: 'fr',
    category: 'Flux de mise au rebut', categorySortOrder: 5, sortOrder: 2,
    excerpt: 'Ce qui se passe lorsque vous décidez de garder un actif que le moteur recommandait de mettre au rebut.',
    bodyHtml: `
      <p>À n'importe quelle étape, un dossier de mise au rebut peut être rejeté avec un motif requis \u2014
      une décision commerciale légitime, pas un échec du système. Motifs courants : calendrier de
      trésorerie, un renouvellement de parc prévu le trimestre prochain, ou une confiance réelle que
      l'actif continuera à bien fonctionner malgré les chiffres.</p>
      <p>Rejeter un dossier alimente discrètement la <strong>boucle d'apprentissage de l'IA</strong> :
      TraceHub note le nombre d'incidents de l'actif à ce moment-là et vérifie 30 jours plus tard si
      une véritable panne a suivi. Avec le temps, cela construit le propre taux de fiabilité des
      recommandations de votre entreprise, visible sur le panneau de boucle d'apprentissage du
      tableau de bord une fois qu'un historique suffisant existe (au moins 5 rejets évalués) \u2014 voir
      <strong>Score de confiance IA et la boucle d'apprentissage</strong>.</p>
    `,
  },
];

module.exports = frenchDisposalWorkflow;
