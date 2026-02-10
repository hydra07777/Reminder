export type CoachCategory =
  | "rappel-defi"
  | "encouragement"
  | "conseil-jour"
  | "motivation-quotidienne";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * ✅ Rappel du défi
 * Ton coach te rappelle ton engagement du jour.
 */
export const RAPPEL_DEFI_MESSAGES: string[] = [
  "N’oublie pas ton défi du jour, c’est maintenant que ça se joue.",
  "Ton objectif ne va pas se faire tout seul… c’est le bon moment pour avancer.",
  "Petit rappel : tu as un engagement avec toi-même aujourd’hui.",
  "Reviens à ton défi, même cinq minutes comptent.",
  "Ton futur toi te dira merci si tu agis maintenant.",
  "Tu as un défi en cours. Une petite action aujourd’hui peut tout changer.",
  "Rappelle-toi pourquoi tu as commencé. Ton défi t’attend.",
  "Ton objectif n’a pas disparu, il te regarde… tu t’y remets ?",
  "Ce message est ton signe pour avancer sur ton défi.",
  "Ta progression dépend de ce que tu fais aujourd’hui, pas demain.",
  "Tu t’étais promis de bosser sur ce défi. Tiens ta parole.",
  "Si tu as deux minutes, elles peuvent aller dans ton objectif maintenant.",
  "Ne laisse pas cette journée filer sans un pas vers ton défi.",
  "Ton défi ne demande pas la perfection, juste un petit mouvement aujourd’hui.",
  "C’est l’instant parfait pour cocher ton action du jour.",
  "Tu es à un geste de faire avancer ton objectif. Vas-y.",
  "Tu n’as pas besoin d’être motivé, juste discipliné. Rappelle-toi ton défi.",
  "Ton défi est toujours là, patient. Montre-lui que toi, tu ne lâches pas.",
  "Aujourd’hui compte dans ta série. Garde ta chaîne de jours intacts.",
  "Rappelle-toi : ce défi, c’est un engagement envers une meilleure version de toi.",
  "Fais quelque chose maintenant pour ne pas regretter ce soir.",
  "Si tu procrastines, ton objectif recule. Si tu agis, il se rapproche.",
  "Reconnecte-toi à ton défi : une petite action, maintenant.",
  "Tu t’es donné un défi. Honore cette décision aujourd’hui.",
  "Tu n’as qu’un seul pas à faire maintenant : ouvrir ton défi et t’y mettre.",
  "Cette notification est un réveil pour ton engagement. Tu réponds présent ?",
  "Ton objectif du jour est toujours faisable. Commence par 2 minutes.",
  "Chaque jour où tu agis, tu changes un peu ton identité.",
  "Tu peux ignorer ce message… ou en faire le déclencheur d’un vrai progrès.",
  "Ton défi est prioritaire. Le reste peut attendre quelques minutes.",
  "Le temps passe de toute façon. Fais-le travailler pour ton objectif.",
  "Rappelle-toi que rien ne change si rien ne change. Agis sur ton défi.",
  "Ce défi, tu l’as choisi. Maintenant, choisis d’y consacrer un instant.",
  "La personne que tu veux devenir ferait quoi maintenant ? Elle avance sur son défi.",
  "Si tu veux être fier de ta journée, touche à ton objectif maintenant.",
  "Même une micro-action compte. Ne laisse pas ton défi à zéro aujourd’hui.",
  "Tu es plus près de l’abandon que du succès… ou l’inverse. À toi de décider.",
  "Ta constance vaut plus que tes excuses. Retourne à ton défi.",
  "Tu peux scroller… ou cocher ton action. Ce rappel te propose la deuxième option.",
  "Ce défi te dépasse peut-être, mais une petite action ne te dépasse pas.",
  "Tu veux des résultats différents ? Traite ton défi comme une priorité.",
  "Le moment parfait n’existe pas. Celui-ci est suffisant pour avancer.",
  "Ta journée n’est pas finie tant que tu n’as pas touché à ton défi.",
  "Le plus dur, c’est de commencer. Ça tombe bien, tu peux commencer maintenant.",
  "Rappelle-toi la raison profonde derrière ce défi. Elle mérite 5 minutes.",
  "Tu es déjà assez occupé, mais es-tu occupé par ce qui compte vraiment ?",
  "Ce défi, c’est une promesse à toi-même. Tiens-la aujourd’hui.",
  "Ne laisse pas une petite flemme détruire un grand objectif.",
  "Tu peux faire un minuscule pas, mais fais-le aujourd’hui.",
  "Pense à l’effet cumulatif : ce que tu fais maintenant se verra plus tard.",
  "Tu as déjà raté assez de jours. Celui-ci peut être différent.",
  "Ton défi, c’est ton terrain d’entraînement. Viens t’y entraîner aujourd’hui.",
  "C’est ton rappel quotidien que tu vaux mieux que “je le ferai plus tard”.",
  "Ton objectif ne demande pas une heure, juste que tu commences.",
  "Tu ne contrôles pas tout, mais tu contrôles ce pas-là maintenant.",
  "Ne laisse pas ce défi devenir encore une promesse oubliée.",
];

/**
 * ✅ Encouragement personnalisé
 * Ton coach te parle directement (parfois doux, parfois cash).
 */
export const ENCOURAGEMENT_MESSAGES: string[] = [
  "Tu es capable de beaucoup plus que ce que tu montres quand tu te caches derrière la flemme.",
  "Je sais que ce n’est pas facile, mais tu as déjà surmonté pire.",
  "Tu n’as pas besoin d’être parfait, juste régulier. Et aujourd’hui fait partie de cette régularité.",
  "Tu peux continuer à te raconter des excuses… ou te prouver que tu vaux mieux.",
  "Chaque fois que tu tiens ton engagement, tu renforces ta confiance en toi.",
  "Oui, tu es fatigué. Mais tu es aussi plus fort que ça.",
  "Tu n’es pas en compétition avec les autres, seulement avec la version de toi qui abandonne.",
  "Tu as le droit de douter, mais agis quand même.",
  "Tu n’es pas en retard : tu es exactement au bon moment pour reprendre.",
  "Ce n’est pas “tout ou rien”. Un pas imparfait reste un pas en avant.",
  "Tu as déjà prouvé que tu pouvais tenir. Reprends cette énergie aujourd’hui.",
  "Tu n’as pas besoin d’y croire pour agir. Agis, et la croyance suivra.",
  "Tu peux être tendre avec toi-même sans te mentir : tu peux faire mieux, et tu le sais.",
  "Le courage, ce n’est pas ne pas avoir peur, c’est avancer avec la peur.",
  "Tu ne verras peut-être pas la différence aujourd’hui, mais ton futur toi, oui.",
  "Arrête de sous-estimer l’impact des petites actions répétées.",
  "Tu as déjà commencé ce défi, ce n’est pas pour lâcher au milieu.",
  "Tu es plus persistant que ce que ton cerveau veut te faire croire.",
  "Tu n’es pas “nul”, tu es simplement en train d’apprendre à être constant.",
  "Tu peux décider que ce jour sera une preuve de plus que tu ne lâches pas.",
  "Même si tu as raté hier, tu peux gagner aujourd’hui.",
  "Ce n’est pas grave d’avoir des jours faibles, grave c’est d’abandonner complètement.",
  "Tu n’es pas obligé d’aimer l’effort pour apprécier les résultats.",
  "Tu as le droit d’être fier de toi pour un petit pas. Vraiment.",
  "Tu vaux mieux que l’auto-sabotage que tu répètes parfois.",
  "Tu n’as pas besoin d’attendre “la bonne version de toi-même” pour agir. C’est maintenant que tu la construis.",
  "Tu progresses, même si tu ne le vois pas encore clairement.",
  "Il y a un jour où tu seras content de ne pas avoir abandonné aujourd’hui.",
  "Sois le genre de personne qui fait ce qu’elle a dit, même quand personne ne regarde.",
  "Tu as le droit d’être fatigué. Mais tu as aussi le pouvoir de faire un petit effort.",
  "Ta discipline doit être plus forte que ta haine de toi-même les mauvais jours.",
  "Tes erreurs passées ne déterminent pas ce que tu fais maintenant.",
  "Tu as tenu d’autres engagements dans ta vie, tu peux tenir celui-là.",
  "Ce n’est pas “trop tard”. C’est juste inconfortable. Et tu peux gérer l’inconfort.",
  "Tu peux te surprendre toi-même, mais il faut que tu essayes vraiment.",
  "Tu es la seule personne qui sait vraiment à quel point cet objectif compte pour toi.",
  "Ce n’est pas parce que tu ne vois pas encore le résultat que rien ne se passe.",
  "Tu n’es pas obligé d’aller vite, mais tu ne peux plus rester immobile.",
  "Écoute cette petite voix en toi qui sait que tu peux faire mieux.",
  "Tu n’as pas besoin de motivation. Tu as besoin d’un choix clair : j’avance.",
  "Tu ne redémarres pas de zéro, tu redémarres avec toute l’expérience que tu as déjà.",
  "C’est normal que ce soit difficile : tu es en train de sortir de ton confort.",
  "Même quand tu doutes, tu peux poser une brique de plus.",
  "Ne laisse pas un mauvais moment définir toute ta journée.",
  "Tu peux être bienveillant avec toi-même sans abandonner ton exigence.",
  "Tu es en train de construire une preuve : “je suis quelqu’un qui termine ce qu’il commence”.",
  "Pendant que tu hésites, le temps passe. Pendant que tu agis, tu avances.",
  "Tu es plus résilient que tu ne le penses. Tu as déjà traversé des choses bien plus dures.",
  "Tu peux pleurer, râler, être frustré… mais fais quand même ton petit pas.",
  "Tu mérites mieux que la version de toi qui abandonne au premier inconfort.",
  "Si tu tombes dix fois, prouve-toi que tu peux te relever onze fois.",
  "Tu n’es pas seul à lutter, mais tu es le seul à pouvoir agir pour toi.",
  "C’est peut-être difficile, mais c’est précisément ce qui te fera grandir.",
  "Tu ne vas pas changer ta vie en un jour, mais ce jour compte dans la construction.",
  "Tu n’as pas besoin que tout le monde y croit. Il suffit que toi, tu persistes.",
  "Tu peux transformer ta frustration en énergie pour avancer.",
  "Tu sais ce que tu dois faire. Maintenant il reste juste à le faire.",
];

/**
 * ✅ Petit conseil du jour
 * Un tip concret et actionnable.
 */
export const CONSEIL_JOUR_MESSAGES: string[] = [
  "Fais aujourd’hui une version “mini” de ton action, plutôt que rien du tout.",
  "Planifie ton prochain petit pas juste après avoir fini celui d’aujourd’hui.",
  "Prépare ton environnement pour qu’il soit facile de réussir et difficile d’abandonner.",
  "Pose-toi cette question : “Qu’est-ce que je peux faire en 5 minutes pour avancer ?”.",
  "Note quelque part pourquoi cet objectif est important pour toi, et relis-le souvent.",
  "Coupe une distraction pendant 10 minutes et consacre-les à ton défi.",
  "Quand tu n’as pas envie, raccourcis la tâche au lieu de l’annuler.",
  "Visualise comment tu te sentiras ce soir en ayant tenu ton engagement.",
  "Remplace la phrase “je dois” par “je choisis de” pour reprendre le contrôle.",
  "Découpe ton objectif en étapes ridiculement petites.",
  "Utilise un minuteur de 5 ou 10 minutes : commence, le reste suivra.",
  "Prépare à l’avance ce dont tu as besoin pour ton action de demain.",
  "Termine toujours ta séance en sachant exactement quoi faire la prochaine fois.",
  "Célèbre mentalement chaque petite victoire, même si personne ne la voit.",
  "Quand tu rates un jour, analyse pourquoi au lieu de juste culpabiliser.",
  "Identifie le moment de la journée où tu es le plus en forme et protège-le pour ton défi.",
  "Évite de prendre des décisions compliquées : rends ton action simple et évidente.",
  "Pense “processus” plutôt que “résultat” : concentre-toi sur la prochaine étape, pas sur la montagne.",
  "Si tu as peur d’échouer, donne-toi le droit d’essayer imparfaitement.",
  "Crée un petit rituel avant de travailler sur ton objectif (boisson, musique, respiration).",
  "Range ou prépare ton espace avant de commencer : ton mental te remerciera.",
  "Quand tu n’as pas d’énergie, concentre-toi sur une tâche minimale liée à ton objectif.",
  "Écris ce que tu as déjà accompli : ta progression n’est peut-être pas si invisible.",
  "Limite les “je verrai plus tard”, transforme-les en créneaux précis.",
  "Quand tu procrastines, demande-toi : “De quoi j’ai vraiment peur ?”.",
  "Utilise un rappel visuel (post-it, fond d’écran) lié à ton défi.",
  "Parle de ton engagement à quelqu’un pour augmenter ta responsabilité.",
  "Apprends à commencer sans attendre d’être motivé : fais le premier geste mécanique.",
  "Choisis à l’avance ce que tu feras les jours où tu n’auras vraiment pas d’énergie.",
  "Fais une revue rapide de ta semaine : qu’est-ce qui t’a aidé, qu’est-ce qui t’a freiné ?",
  "Simplifie les choix : moins tu dois réfléchir, plus tu as de chances d’agir.",
  "Rappelle-toi que la constance est un muscle : plus tu l’utilises, plus il devient naturel.",
  "Remplace une habitude inutile par une micro-action vers ton objectif.",
  "Note 3 choses qui t’aident à rester sur ton défi et garde-les en tête.",
  "Crée une phrase-clé que tu te répètes quand tu veux lâcher (ex : “je fais juste 5 minutes”).",
  "Observe à quel moment de la journée tu décroches, et prépare un plan pour ce moment.",
  "Transforme ton téléphone en allié : supprime une distraction, ajoute un rappel utile.",
  "Quand tu réussis, analyse aussi pourquoi : répète ce qui marche.",
  "Fixe-toi une règle simple : “Je touche à mon objectif au moins 2 minutes par jour”.",
  "Réduis la friction : supprime un obstacle concret qui te freine aujourd’hui.",
  "Utilise un “si… alors…” (ex : “si je finis de manger, alors je fais 5 min sur mon défi”).",
  "Quand tu te sens nul, rappelle-toi un moment où tu as été fier de toi.",
  "Prévois quoi faire lors de ta prochaine baisse de motivation, tant que tu es lucide.",
  "Au lieu de viser “faire bien”, vise d’abord “faire”.",
  "Parle-toi comme tu parlerais à un ami qui essaie de tenir un défi.",
  "Quand tu n’avances pas, regarde si ton objectif est clair ou trop flou.",
  "Ajoute une touche de plaisir à ton rituel (musique, boisson, ambiance).",
  "Garde une trace visible de tes jours réussis pour renforcer ta motivation.",
  "Utilise la règle : “Pas deux jours de suite sans avancer sur mon objectif”.",
  "Accepte que progresser, c’est parfois seulement ne pas régresser.",
  "Revois ton objectif si nécessaire : ajuster n’est pas abandonner.",
  "Souviens-toi : la petite action que tu fais aujourd’hui a plus de valeur que le plan parfait que tu ne fais jamais.",
];

/**
 * ✅ Motivation quotidienne
 * Phrases plus “vision / identité” pour booster le fond.
 */
export const MOTIVATION_QUOTIDIENNE_MESSAGES: string[] = [
  "Chaque petite action que tu fais aujourd’hui dessine la personne que tu deviens.",
  "Tu n’es pas en train de cocher une case, tu es en train de changer ton histoire.",
  "Ce défi n’est pas juste une tâche : c’est un entraînement pour ta discipline.",
  "Tu es en train de prouver que tu peux compter sur toi-même.",
  "Chaque jour tenu est une brique de plus dans ta confiance.",
  "Tu ne construis pas seulement un résultat, tu construis une identité.",
  "Ta constance vaut plus que des pics de motivation éphémères.",
  "Tu ne joues pas la partie d’un jour, tu joues le long terme.",
  "Ce que tu fais aujourd’hui, même petit, t’éloigne de la version de toi qui abandonne.",
  "Un jour, tu regarderas en arrière et tu seras fier d’avoir tenu même les jours moyens.",
  "Ce n’est pas l’énorme effort d’un jour qui compte, mais les efforts modestes répétés.",
  "Tu n’es pas défini par tes échecs, mais par ce que tu décides d’en faire.",
  "Chaque fois que tu respectes ton engagement, tu élèves ton standard personnel.",
  "Tu es en train d’apprendre à ton cerveau que tes décisions comptent.",
  "Tu n’es pas obligé d’être exceptionnel, mais tu peux être fiable envers toi-même.",
  "Ce défi est un prétexte pour devenir plus solide intérieurement.",
  "Tu n’es pas juste en train de “tenir un défi”, tu entraînes ta capacité à ne pas lâcher.",
  "Les résultats visibles viendront, mais le vrai changement commence à l’intérieur.",
  "Ton sérieux envers ce petit objectif prépare le terrain pour de plus grands projets.",
  "Aujourd’hui est une opportunité de te rapprocher de la personne que tu veux être.",
  "Tu peux choisir que ta nouvelle normalité, ce soit la régularité.",
  "Tu n’es pas condamné à répéter les mêmes schémas : tu es en train d’en créer de nouveaux.",
  "Chaque oui à ton objectif est un non à la version de toi qui renonce.",
  "Tu construis une force tranquille, un jour à la fois.",
  "Tu es en train d’apprendre que tu peux agir même sans en avoir envie.",
  "Ta valeur ne dépend pas de ce défi, mais ce défi peut renforcer la perception que tu as de toi.",
  "Tu n’attends plus que les choses changent, tu participes au changement.",
  "Tu montres à ton cerveau qu’il peut te faire confiance quand tu prends une décision.",
  "Tu n’as pas besoin d’aller vite pour aller loin, tu as besoin de continuer.",
  "Cette habitude que tu construis peut transformer bien plus de domaines que tu ne le crois.",
  "Tu peux laisser derrière toi l’ancien toi qui remettait toujours à plus tard.",
  "Tu es en train de remplacer “je commence un truc et j’abandonne” par “je tiens ce que je commence”.",
  "Tu n’es pas ton passé : tu es ce que tu décides de faire aujourd’hui.",
  "Même si personne ne le voit, ce travail intérieur comptera énormément.",
  "Tu apprends à te respecter en respectant tes propres engagements.",
  "Ce défi est un terrain d’entraînement pour la vie, pas juste un jeu.",
  "Tu n’es pas faible, tu es en train d’apprendre à être plus fort de façon durable.",
  "Si tu continues comme ça, la question ne sera plus “si” tu réussiras, mais “quand”.",
  "Tu es en train de construire quelque chose de solide, pas de faire un coup d’éclat.",
  "Un futur toi, plus confiant et plus serein, te remerciera pour ces efforts discrets.",
  "Tu peux décider que “je tiens mes engagements” fait partie de ta nouvelle identité.",
  "Tu n’es pas juste en train de mieux gérer un objectif, tu apprends à mieux te gérer toi-même.",
  "Chaque jour où tu tiens, la prochaine fois devient un peu plus facile.",
  "Cette persévérance silencieuse a plus de valeur que tous les grands discours.",
  "Tu n’as pas besoin d’être quelqu’un d’autre, tu as besoin d’être cohérent avec toi-même.",
  "Tu es peut-être loin de ton idéal, mais tu es sur le chemin — et c’est ça qui compte.",
  "Ce défi est une preuve concrète que tu peux changer quelque chose dans ta vie.",
  "Tu peux être la personne qui n’abandonne pas au premier obstacle.",
  "Aujourd’hui peut être un simple jour sur le calendrier, ou un jour de plus où tu t’es choisi.",
  "Tu ne pourras pas toujours contrôler les résultats, mais tu peux toujours contrôler l’effort.",
  "Tu es en train de semer des graines : la récolte viendra plus tard, mais elle viendra.",
  "Garde en tête que ce que tu fais maintenant construit ton futur quotidien.",
  "Tu n’as pas besoin que tout le monde comprenne ce que tu fais, c’est ton chemin.",
  "Tu peux transformer ce petit défi en preuve permanente que tu es capable de changer.",
];

export function getRandomRappelDefi(): string {
  return pickRandom(RAPPEL_DEFI_MESSAGES);
}

export function getRandomEncouragement(): string {
  return pickRandom(ENCOURAGEMENT_MESSAGES);
}

export function getRandomConseilJour(): string {
  return pickRandom(CONSEIL_JOUR_MESSAGES);
}

export function getRandomMotivationQuotidienne(): string {
  return pickRandom(MOTIVATION_QUOTIDIENNE_MESSAGES);
}

