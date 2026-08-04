module.exports = [
  {
    title: 'Politique de confidentialité',
    slug: 'privacy-policy',
    locale: 'fr',
    showInFooter: true,
    isPublished: true,
    bodyHtml: `
      <p class="th-legal-updated">Dernière mise à jour : 2 août 2026</p>

      <p>TraceHub Inventory (« TraceHub », « nous », « notre ») fournit un logiciel multi-locataire
      de gestion des actifs et des stocks à des organisations (« Clients », « vous ») et à leurs
      utilisateurs autorisés. Cette Politique de confidentialité explique quelles informations nous
      collectons, pourquoi nous les collectons, comment elles sont utilisées, et les choix qui
      s'offrent à vous \u2014 en langage clair, sans jargon juridique superflu.</p>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">1</span> Informations que nous collectons</h3>
        <p><strong>Informations de compte et de profil.</strong> Nom, adresse e-mail, numéro de
        téléphone, rôle, et mot de passe (stocké sous forme de hachage salé \u2014 nous ne voyons ni ne
        stockons jamais votre mot de passe en clair) lorsque vous ou votre Administrateur d'entreprise
        créez un compte.</p>
        <p><strong>Informations sur l'entreprise/l'espace de travail.</strong> Le nom de votre
        organisation, son secteur, sa devise, et les détails de facturation saisis lors de la
        création d'un espace de travail.</p>
        <p><strong>Données d'actifs et opérationnelles.</strong> Tout ce que vous enregistrez sur
        votre équipement \u2014 noms, catégories, prix d'achat, historique de maintenance, photos,
        champs personnalisés \u2014 ainsi que les scans de points de contrôle, affectations, et
        dossiers de mise au rebut que votre équipe crée en utilisant la plateforme.</p>
        <p><strong>Données de points de contrôle de localisation.</strong> Lorsqu'un membre de
        l'équipe scanne le code QR d'un actif, nous enregistrons à quel point de contrôle (entrepôt,
        agence, site) il a été scanné et à quel moment.</p>
        <div class="th-legal-callout"><strong>Important :</strong> TraceHub n'utilise pas de suivi
        GPS continu ni n'installe de matériel de suivi \u2014 les données de localisation ne se
        mettent à jour que lorsqu'un scan délibéré a lieu.</div>
        <p style="margin-top:0.9rem;"><strong>Journaux d'utilisation et de sécurité.</strong>
        Horodatages de connexion, adresse IP, et un journal d'audit des actions significatives (qui
        a créé, modifié, ou supprimé quoi) \u2014 conservés pour la sécurité du compte, la prévention
        des abus, et pour que votre Administrateur d'entreprise puisse répondre à « qui a modifié
        ceci ».</p>
        <p><strong>Informations de paiement.</strong> Les paiements d'abonnement sont traités par
        <strong>Flutterwave</strong>. TraceHub ne reçoit ni ne stocke votre numéro de carte
        complet \u2014 Flutterwave gère directement la collecte des paiements et ne partage que ce qui
        est nécessaire pour confirmer un paiement réussi (montant, forfait, référence de
        transaction).</p>
        <p><strong>Données d'authentification à deux facteurs.</strong> Si vous activez l'A2F, nous
        stockons le secret d'authentification nécessaire pour vérifier vos codes. Nous n'avons pas
        accès à votre application d'authentification elle-même.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">2</span> Comment nous utilisons vos informations</h3>
        <ul>
          <li>Pour exploiter votre espace de travail et fournir les fonctionnalités que vous
          utilisez activement \u2014 calculs de dépréciation, notation de santé, recommandations de
          mise au rebut, suivi des affectations, et rapports.</li>
          <li>Pour envoyer des e-mails transactionnels : réinitialisations de mot de passe,
          configuration de l'A2F, invitations du personnel, rappels de retour d'affectation, et
          alertes d'actifs en retard.</li>
          <li>Pour détecter et prévenir la fraude, les abus, ou l'accès non autorisé à votre espace
          de travail.</li>
          <li>Pour générer des résumés et des informations assistés par IA. Lorsque les
          fonctionnalités d'IA de la plateforme font appel à un fournisseur tiers de modèle de
          langage, nous n'envoyons que les statistiques agrégées ou les données d'actifs spécifiques
          nécessaires pour répondre à la demande \u2014 pas l'intégralité de votre base de données, et
          pas les données d'autres clients.</li>
          <li>Pour améliorer la plateforme sur la base de modèles d'utilisation agrégés et
          anonymisés.</li>
        </ul>
        <div class="th-legal-callout"><strong>Nous ne vendons pas vos données</strong>, et nous ne
        les utilisons pas pour entraîner des profils publicitaires tiers.</div>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">3</span> Vos données restent isolées à votre entreprise</h3>
        <p>TraceHub est multi-locataire : chaque actif, utilisateur, et enregistrement est
        circonscrit à une seule entreprise au niveau de la base de données. Les utilisateurs et
        administrateurs d'une entreprise ne peuvent pas voir les données d'une autre entreprise. Le
        rôle Super Admin propre à TraceHub peut accéder aux données opérationnelles au niveau de la
        plateforme (statut d'abonnement, comptes d'utilisation) pour faire fonctionner le service,
        mais n'utilise pas vos données d'actifs opérationnelles à des fins autres que le support et
        l'exploitation de la plateforme.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">4</span> Conservation et suppression des données</h3>
        <p>Nous conservons vos données aussi longtemps que votre espace de travail est actif. Si
        vous annulez votre abonnement, vos données restent accessibles pendant une période de grâce
        raisonnable au cas où vous souhaiteriez réactiver votre compte, après quoi elles peuvent
        être supprimées. Les Administrateurs d'entreprise peuvent demander l'exportation ou la
        suppression des données de leur espace de travail à tout moment en nous contactant.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">5</span> Vos droits</h3>
        <p>Selon votre lieu de résidence, vous pouvez avoir le droit d'accéder à, de corriger,
        d'exporter, ou de demander la suppression de vos informations personnelles. Pour exercer ces
        droits, contactez votre Administrateur d'entreprise (pour les données contrôlées par votre
        organisation) ou contactez-nous directement en utilisant les coordonnées figurant sur notre
        site web.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">6</span> Confidentialité des enfants</h3>
        <p>TraceHub est un outil professionnel qui ne s'adresse pas, et n'est pas sciemment utilisé
        par, des enfants de moins de 16 ans. Nous ne collectons pas sciemment d'informations
        personnelles auprès d'enfants.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">7</span> Modifications de cette politique</h3>
        <p>Nous mettrons à jour la date de « Dernière mise à jour » ci-dessus chaque fois que cette
        politique change, et publierons la version révisée ici. Les changements substantiels seront
        communiqués aux Administrateurs d'entreprise par e-mail.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">8</span> Nous contacter</h3>
        <p>Les questions concernant cette politique ou vos données peuvent être adressées à
        l'Administrateur d'entreprise de votre espace de travail ou au support TraceHub via les
        canaux listés sur notre site web.</p>
      </div>

      <p class="th-legal-disclaimer">Cette politique vise à décrire fidèlement la manière dont
      TraceHub Inventory traite réellement les données à la date ci-dessus. Elle ne remplace pas un
      conseil juridique \u2014 si vous opérez dans une juridiction ayant des exigences réglementaires
      spécifiques (RGPD, loi ghanéenne sur la protection des données, CCPA, ou similaire), faites
      examiner cette politique par un conseiller juridique qualifié avant de vous y fier à des fins
      de conformité.</p>
    `,
  },
  {
    title: "Conditions d'utilisation",
    slug: 'terms-of-service',
    locale: 'fr',
    showInFooter: true,
    isPublished: true,
    bodyHtml: `
      <p class="th-legal-updated">Dernière mise à jour : 2 août 2026</p>

      <p>Ces Conditions d'utilisation (les « Conditions ») régissent l'accès à TraceHub Inventory
      (le « Service ») et son utilisation. En créant un espace de travail ou en acceptant une
      invitation à en rejoindre un, vous acceptez ces Conditions en votre nom et, le cas échéant, au
      nom de votre organisation.</p>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">1</span> Comptes et admissibilité</h3>
        <p>Vous devez fournir des informations exactes lors de la création d'un compte et garder vos
        identifiants de connexion \u2014 y compris tout mot de passe temporaire délivré lors d'une
        invitation \u2014 confidentiels. Vous êtes responsable de toute activité se produisant sous
        votre compte. Les Administrateurs d'entreprise sont responsables de la gestion de l'accès à
        leur espace de travail et du niveau de permission accordé.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">2</span> Forfaits d'abonnement et facturation</h3>
        <p>TraceHub propose un essai gratuit et des niveaux d'abonnement payants (Basique, Pro,
        Entreprise), chacun avec ses propres limites d'actifs et d'utilisateurs. Les forfaits payants
        sont facturés en USD et traités via Flutterwave.</p>
        <div class="th-legal-callout"><strong>Renouvellement automatique :</strong> sauf annulation,
        les abonnements se renouvellent automatiquement à la fin de chaque cycle de facturation.
        Vous pouvez annuler le renouvellement automatique à tout moment depuis la page Facturation
        de votre espace de travail \u2014 votre forfait reste actif et pleinement fonctionnel jusqu'à
        la fin de la période déjà payée.</div>
        <p style="margin-top:0.9rem;">Si un paiement échoue, nous tenterons de vous en informer et
        pourrons restreindre temporairement l'accès aux fonctionnalités payantes jusqu'à résolution
        du problème, sans supprimer vos données.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">3</span> Vos données et votre contenu</h3>
        <p><strong>Vous (ou votre organisation) êtes propriétaire</strong> des données d'actifs,
        d'inventaire, et opérationnelles que vous saisissez dans TraceHub. Nous ne revendiquons
        aucune propriété sur ces données, et nous ne les utilisons à aucune autre fin que celle de
        fournir et d'améliorer le Service comme décrit dans notre Politique de confidentialité. Vous
        êtes responsable de l'exactitude des données que vous saisissez \u2014 y compris les données
        de dépréciation, les prix d'achat, et tout chiffre utilisé dans les calculs automatisés de la
        plateforme.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">4</span> Utilisation acceptable</h3>
        <p>Vous acceptez de ne pas :</p>
        <ul>
          <li>Utiliser le Service pour stocker, suivre, ou traiter quoi que ce soit d'illégal.</li>
          <li>Tenter d'accéder aux données de l'espace de travail d'une autre entreprise, ou de
          contourner les contrôles d'accès multi-locataires qui maintiennent les espaces de travail
          isolés.</li>
          <li>Faire de l'ingénierie inverse, du scraping, ou tenter d'extraire le logiciel
          sous-jacent, ou utiliser des moyens automatisés pour surcharger le Service.</li>
          <li>Utiliser le Service pour envoyer du spam, des logiciels malveillants, ou du contenu
          portant atteinte à la propriété intellectuelle d'autrui.</li>
          <li>Détourner les fonctionnalités de scan QR ou d'affectation pour dénaturer
          l'emplacement, la garde, ou l'état d'un actif.</li>
        </ul>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">5</span> Contenu généré par IA</h3>
        <p>Les fonctionnalités d'IA de TraceHub (recommandations exécutives, suggestions de mise au
        rebut, l'assistant de discussion, les informations du tableau de bord) sont générées à
        partir de vos propres données en utilisant des modèles de notation déterministes et, dans
        certains cas, un modèle de langage tiers.</p>
        <div class="th-legal-callout">Ces résultats sont des outils d'aide à la décision,
        <strong>pas des garanties</strong> \u2014 vous restez responsable des décisions commerciales
        que vous prenez sur leur base, y compris les décisions de mise au rebut, de réparation, et
        financières concernant les actifs.</div>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">6</span> Disponibilité du service</h3>
        <p>Nous visons à maintenir TraceHub disponible et fiable, mais le Service est fourni « tel
        quel » sans garantie de disponibilité engagée, sauf accord de niveau de service écrit
        séparé conclu entre vous et TraceHub. Nous pouvons effectuer une maintenance programmée et
        ferons des efforts raisonnables pour minimiser les perturbations.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">7</span> Limitation de responsabilité</h3>
        <p>Dans toute la mesure permise par la loi, TraceHub n'est pas responsable des dommages
        indirects, accessoires, ou consécutifs découlant de l'utilisation du Service, y compris les
        décisions prises sur la base des estimations de dépréciation, des scores de santé, ou des
        recommandations de mise au rebut générées par la plateforme. Notre responsabilité totale
        pour toute réclamation liée au Service est limitée au montant que vous nous avez versé au
        cours des douze mois précédant la réclamation.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">8</span> Résiliation</h3>
        <p>Vous pouvez annuler votre abonnement à tout moment. Nous pouvons suspendre ou résilier
        l'accès au Service pour les comptes qui enfreignent ces Conditions, y compris les
        dispositions d'utilisation acceptable ci-dessus, après un préavis raisonnable lorsque cela
        est possible.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">9</span> Droit applicable</h3>
        <p>Ces Conditions sont régies par les lois de la République du Ghana, sans égard aux
        principes de conflit de lois, sauf accord signé séparé entre vous et TraceHub stipulant
        autrement.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">10</span> Modifications de ces Conditions</h3>
        <p>Nous mettrons à jour la date de « Dernière mise à jour » ci-dessus lorsque ces Conditions
        changent, et informerons les Administrateurs d'entreprise des changements substantiels par
        e-mail. La poursuite de l'utilisation du Service après l'entrée en vigueur d'un changement
        constitue une acceptation des Conditions révisées.</p>
      </div>

      <p class="th-legal-disclaimer">Il s'agit d'un projet réel et complet, rédigé pour refléter
      fidèlement le fonctionnement réel de TraceHub Inventory à la date ci-dessus \u2014 pas un texte
      générique. Il ne remplace pas un conseil juridique spécifique à votre juridiction ; faites
      examiner ce document par un conseiller juridique qualifié avant de vous y fier pour un
      lancement public.</p>
    `,
  },
  {
    title: 'Politique de cookies',
    slug: 'cookie-policy',
    locale: 'fr',
    showInFooter: true,
    isPublished: true,
    bodyHtml: `
      <p class="th-legal-updated">Dernière mise à jour : 2 août 2026</p>

      <p>Cette politique explique précisément ce que TraceHub Inventory stocke réellement dans votre
      navigateur \u2014 pas un modèle générique.</p>

      <div class="th-legal-callout">À la date ci-dessus, TraceHub ne place aucun cookie HTTP
      traditionnel. Il utilise à la place le <strong>stockage local</strong> de votre navigateur, un
      mécanisme de stockage côté navigateur similaire, pour un ensemble restreint et spécifique de
      finalités.</div>

      <div class="th-legal-section" style="margin-top:1.1rem;">
        <h3><span class="th-legal-badge">1</span> Ce que nous stockons, et pourquoi</h3>
        <ul>
          <li><strong>Jetons de session.</strong> Lorsque vous vous connectez, un jeton d'accès et
          un jeton de rafraîchissement sont stockés dans le stockage local afin que vous restiez
          connecté en naviguant dans l'application, sans avoir à ressaisir votre mot de passe à
          chaque page.</li>
          <li><strong>Préférences d'interface.</strong> Le thème que vous avez choisi (Clair,
          Sombre, ou Émeraude) est mémorisé afin que l'application conserve l'apparence que vous lui
          avez donnée lors de votre prochaine visite.</li>
        </ul>
        <p>C'est la liste complète. Nous ne plaçons pas de cookies publicitaires, n'utilisons pas de
        traceurs d'analyse tiers, et ne partageons pas les données de stockage du navigateur avec des
        réseaux publicitaires \u2014 parce que nous n'en avons aucun.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">2</span> Pourquoi le stockage local plutôt que des cookies</h3>
        <p>Le stockage local conserve ces données sur votre appareil et ne les envoie aux propres
        serveurs de TraceHub que lorsque l'application en a besoin (par exemple, pour joindre votre
        jeton de session à une requête API) \u2014 elles ne sont pas transmises automatiquement à
        chaque requête comme le sont les cookies traditionnels, et elles ne sont pas accessibles à
        d'autres sites web.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">3</span> Gérer ou effacer ces données</h3>
        <p>Vous pouvez effacer le stockage local à tout moment via les paramètres de votre
        navigateur (généralement sous « Effacer les données de navigation » ou « Paramètres du
        site »). Cela vous déconnectera et réinitialisera votre préférence de thème par défaut, mais
        n'affectera aucune donnée stockée dans votre espace de travail TraceHub lui-même.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">4</span> Services tiers</h3>
        <p>Le traitement des paiements (Flutterwave) et, lorsqu'activée, la livraison d'e-mails
        passent par des services tiers distincts qui peuvent placer leurs propres cookies pendant le
        paiement ou dans les e-mails transactionnels, régis par leurs propres politiques de
        confidentialité et de cookies plutôt que par celle-ci.</p>
      </div>

      <div class="th-legal-section">
        <h3><span class="th-legal-badge">5</span> Modifications de cette politique</h3>
        <p>Si TraceHub commence un jour à utiliser des cookies ou des mécanismes de stockage
        supplémentaires \u2014 pour l'analyse ou autre \u2014 nous mettrons à jour cette page et la date
        de « Dernière mise à jour » ci-dessus plutôt que de modifier silencieusement ce qui est
        divulgué ici.</p>
      </div>

      <p class="th-legal-disclaimer">Cette politique décrit la mise en œuvre technique réelle de
      TraceHub à la date ci-dessus, pas un texte générique standard. Elle ne remplace pas un conseil
      juridique spécifique aux exigences de cookies/consentement de votre juridiction (comme les
      règles ePrivacy de l'UE) \u2014 faites examiner ce document par un conseiller juridique qualifié
      avant de vous y fier à des fins de conformité.</p>
    `,
  },
];
