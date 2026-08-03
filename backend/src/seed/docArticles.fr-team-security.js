const frenchTeamSecurity = [
  {
    title: "Inviter des membres de l'équipe",
    slug: 'inviting-team-members',
    locale: 'fr',
    category: 'Équipe et sécurité', categorySortOrder: 6, sortOrder: 0,
    excerpt: 'Comment fonctionnent les invitations, et ce que voit la nouvelle personne.',
    bodyHtml: `
      <p>Depuis <strong>Équipe \u2192 Ajouter un membre</strong>, saisissez son nom, son e-mail et son
      rôle (Responsable ou Personnel \u2014 Administrateur d'entreprise se définit séparément si
      besoin). La personne reçoit un e-mail avec un mot de passe temporaire généré par le
      système.</p>
      <p>La page Équipe affiche également, pour chaque membre : téléphone, dernière connexion, date
      d'adhésion, statut A2F, et un badge <strong>« Première connexion en attente »</strong> pour
      quiconque n'a pas encore effectué la configuration obligatoire de mot de passe (voir l'article
      suivant) \u2014 utile pour savoir qui a encore besoin d'une relance.</p>
    `,
  },
  {
    title: 'La configuration obligatoire du mot de passe à la première connexion',
    slug: 'mandatory-first-login-password-setup',
    locale: 'fr',
    category: 'Équipe et sécurité', categorySortOrder: 6, sortOrder: 1,
    excerpt: "Pourquoi un nouveau membre de l'équipe ne peut pas simplement utiliser son mot de passe temporaire.",
    bodyHtml: `
      <p>Un mot de passe temporaire n'est censé servir qu'à faire entrer quelqu'un une seule fois.
      Lorsqu'une personne nouvellement invitée se connecte avec, TraceHub bloque l'accès à tout le
      reste de l'application jusqu'à ce qu'elle définisse son propre mot de passe \u2014 ceci est
      appliqué par le serveur lui-même, pas seulement un écran frontal que quelqu'un pourrait
      contourner.</p>
      <p>Juste après avoir défini un nouveau mot de passe, une configuration d'authentification à
      deux facteurs d'une minute lui est proposée (scanner un code QR avec n'importe quelle
      application d'authentification, saisir le code à 6 chiffres) \u2014 optionnelle mais fortement
      encouragée, et pouvant être ignorée si la personne préfère le faire plus tard depuis
      Paramètres.</p>
    `,
  },
  {
    title: 'Authentification à deux facteurs',
    slug: 'two-factor-authentication',
    locale: 'fr',
    category: 'Équipe et sécurité', categorySortOrder: 6, sortOrder: 2,
    excerpt: "Activer ou désactiver l'A2F à tout moment.",
    bodyHtml: `
      <p>Au-delà de l'invite de première connexion, n'importe qui peut activer ou désactiver
      l'authentification à deux facteurs à tout moment depuis <strong>Paramètres</strong>. L'activer
      vous guide à travers le scan d'un code QR avec n'importe quelle application d'authentification
      standard (Google Authenticator, Authy, 1Password, et similaires) et la confirmation avec un
      code à 6 chiffres. La désactiver nécessite de ressaisir votre mot de passe, afin qu'un attaquant
      ayant seulement compromis votre session ne puisse pas simplement la désactiver.</p>
    `,
  },
  {
    title: "Le journal d'audit",
    slug: 'the-audit-log',
    locale: 'fr',
    category: 'Équipe et sécurité', categorySortOrder: 6, sortOrder: 3,
    excerpt: 'Ce qui est enregistré, et où le trouver.',
    bodyHtml: `
      <p>Chaque action significative dans votre espace de travail \u2014 qui a créé, modifié ou
      supprimé quoi, l'activité de connexion, les transitions de dossiers de mise au rebut \u2014 est
      enregistrée avec un véritable horodatage et l'utilisateur agissant. Les Super Admins peuvent
      voir un journal d'audit global sur toute la plateforme ; au sein de votre propre entreprise, cet
      historique apparaît aussi de façon contextuelle sur les chronologies individuelles des actifs
      plutôt que comme un seul journal géant indifférencié à parcourir.</p>
    `,
  },
  {
    title: "Désactiver ou retirer un membre de l'équipe",
    slug: 'disabling-removing-team-member',
    locale: 'fr',
    category: 'Équipe et sécurité', categorySortOrder: 6, sortOrder: 4,
    excerpt: "La différence entre désactiver et retirer définitivement l'accès.",
    bodyHtml: `
      <p>Depuis <strong>Équipe</strong>, un Administrateur d'entreprise peut <strong>désactiver</strong>
      un membre \u2014 bloquant immédiatement sa connexion tout en préservant son historique (qui il
      était, ce qu'il a fait, ses affectations passées) \u2014 ou le <strong>retirer</strong>
      entièrement. Désactiver est le bon choix pour quelqu'un qui part temporairement ou est en
      cours d'examen ; le retrait est pour quelqu'un qui est véritablement parti et ne reviendra pas.</p>
    `,
  },
  {
    title: 'Comment fonctionnent la connexion et les sessions',
    slug: 'how-login-and-sessions-work',
    locale: 'fr',
    category: 'Équipe et sécurité', categorySortOrder: 6, sortOrder: 5,
    excerpt: 'Jetons d\u2019accès, jetons de rafraîchissement, et ce que signifie réellement « rester connecté ».',
    bodyHtml: `
      <p>Lorsque vous vous connectez, TraceHub émet deux jetons stockés dans le stockage local de
      votre navigateur : un jeton d'accès de courte durée utilisé pour chaque requête, et un jeton
      de rafraîchissement de plus longue durée utilisé pour obtenir silencieusement un nouveau jeton
      d'accès lorsque le premier expire \u2014 c'est pourquoi vous restez généralement connecté d'une
      visite à l'autre sans ressaisir constamment votre mot de passe. Se déconnecter, ou effacer le
      stockage local de votre navigateur, met fin à la session. Voir la <strong>Politique de
      cookies</strong> pour savoir exactement ce qui est stocké et pourquoi.</p>
    `,
  },
];

module.exports = frenchTeamSecurity;
