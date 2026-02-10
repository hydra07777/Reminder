## Application d’objectifs & d’habitudes avec coach personnel (Expo / React Native)

Cette application mobile permet de :

- **Créer un objectif / défi** sur plusieurs jours
- **Suivre chaque journée** comme réussie ou échouée (calendrier + historique)
- **Recevoir 3 notifications quotidiennes** jouées par un “coach” :
  - ✅ Rappel du défi
  - ✅ Encouragement personnalisé
  - ✅ Petit conseil du jour / motivation quotidienne

Techno principale : **Expo + React Native + expo-router**.

---

## Installation & lancement

1. **Installer les dépendances**

   ```bash
   npm install
   ```

2. **Lancer l’app en développement**

   ```bash
   npm start
   # ou
   npx expo start
   ```

   Puis ouvrir :

   - dans un **development build** Expo,
   - ou dans un **émulateur Android** / **simulateur iOS**,
   - ou sur un vrai appareil via **Expo Go** (avec certaines limitations, surtout pour les notifications sur Android).

---

## Fonctionnalités principales

- **Gestion des objectifs**
  - Création d’un objectif avec durée en jours.
  - Stockage local avec `AsyncStorage`.

- **Suivi journalier**
  - Écran de détail d’un objectif : `app/objective/[id].tsx`.
  - Calendrier mensuel avec :
    - jours réussis / échoués / futurs / en attente,
    - statistiques (taux de réussite, jours restants, etc.).
  - Historique des jours :
    - possibilité de marquer un jour passé **Réussi** ou **Échoué** via un appui.

- **Notifications**
  - Fichier principal : `utils/notificationService.ts`.
  - Programmation de **3 notifications quotidiennes** (matin, midi, soir).
  - Messages générés par `utils/motivationalMessages.ts` + `utils/coachMessages.ts` :
    - rappel du défi,
    - encouragement personnalisé,
    - conseil du jour,
    - motivation quotidienne,
    - personnalisation avec les stats de l’objectif actif.

---

## Notifications : configuration

- Permissions gérées dans `requestNotificationPermissions` (`notificationService.ts`).
- Android :
  - canal `motivational` créé avec `expo-notifications`,
  - importance haute + vibrations + son.
- Les heures des notifications sont définies dans `getNotificationTime` :
  - matin,
  - midi,
  - soir.

Pour reprogrammer les notifications après un changement d’objectif :  
`scheduleMotivationalNotifications(objectives)` (appelé depuis le contexte / settings).

---

## Build Android (aperçu)

Le projet est configuré pour un build Android avec :

- **minSdkVersion 24** (Hermes / React Native modernes).
- Fichiers importants :
  - `android/build.gradle`
  - `android/gradle.properties`
  - `android/local.properties` (chemin SDK Android, à adapter en local).

Build classique en local :

```bash
cd android
./gradlew assembleDebug
```

Un `Dockerfile.android` et un `docker-compose.build.yml` sont aussi présents pour automatiser le build Android dans un conteneur.

---

## Structure globale

- `app/`
  - `index.tsx` : écran d’accueil / liste des objectifs.
  - `add-objective.tsx` : création d’un nouvel objectif.
  - `objective/[id].tsx` : détail, calendrier, historique, suppression.
  - `settings.tsx` : paramètres liés aux notifications / comportement.
- `context/`
  - `ObjectivesContext.tsx` : gestion des objectifs, stats, persistance.
  - `SettingsContextProvider.tsx` : préférences utilisateur (notifications, etc.).
- `utils/`
  - `notificationService.ts` : configuration et planification des notifications.
  - `motivationalMessages.ts` : composition des messages en fonction du moment de la journée + stats.
  - `coachMessages.ts` : listes de phrases (rappel, encouragement, conseils, motivation quotidienne).

---

## Scripts NPM utiles

Les scripts principaux (voir `package.json`) :

- `npm start` : lance le serveur Expo.
- `npm run android` : lance l’app sur un appareil / émulateur Android (si configuré).
- `npm run ios` : lance l’app sur simulateur iOS (macOS uniquement).

---

## Notes de développement

- Projet basé sur **Expo** (React Native).
- Routage avec **expo-router** (file-based routing).
- Stockage local avec **AsyncStorage**.
- Notifications avec **expo-notifications** (attention aux limitations d’Expo Go sur Android).

Ce README décrit l’état actuel de l’application telle qu’elle est développée dans ce dépôt.
