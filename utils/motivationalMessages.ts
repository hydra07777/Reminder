import type { Objective } from "../context/ObjectivesContext";
import { getObjectiveProgress } from "../context/ObjectivesContext";
import {
  getRandomConseilJour,
  getRandomEncouragement,
  getRandomMotivationQuotidienne,
  getRandomRappelDefi,
} from "./coachMessages";

export type TimeOfDay = "morning" | "noon" | "evening";

export function getMotivationalMessage(
  timeOfDay: TimeOfDay,
  objective?: Objective,
): string {
  const parts: string[] = [];

  // 1) Message principal selon le moment de la journée
  switch (timeOfDay) {
    case "morning":
      // Matin : rappel du défi + motivation quotidienne
      parts.push(getRandomRappelDefi());
      parts.push(getRandomMotivationQuotidienne());
      break;
    case "noon":
      // Midi : encouragement direct
      parts.push(getRandomEncouragement());
      break;
    case "evening":
      // Soir : petit conseil + rappel du défi
      parts.push(getRandomConseilJour());
      parts.push(getRandomRappelDefi());
      break;
  }

  // 2) Personnalisation avec les stats de l'objectif si disponible
  if (objective) {
    const { success, total, percentage } = getObjectiveProgress(objective);
    const objectiveName = objective.name;

    if (total > 0) {
      if (timeOfDay === "morning") {
        if (percentage >= 80) {
          parts.push(
            `Tu es à ${percentage}% de réussite sur "${objectiveName}" ! Continue comme ça, tu es incroyable ! 🚀`,
          );
        } else if (percentage >= 50) {
          parts.push(
            `Tu es à ${percentage}% de réussite sur "${objectiveName}". Tu es sur la bonne voie ! 💪`,
          );
        } else {
          parts.push(
            `Tu as réussi ${success} sur ${total} jours pour "${objectiveName}". Chaque jour compte ! 🌟`,
          );
        }
      } else if (timeOfDay === "noon") {
        parts.push(
          `Rappelle-toi : "${objectiveName}" - ${success}/${total} jours réussis (${percentage}%) !`,
        );
      } else {
        // evening
        if (success > 0) {
          parts.push(
            `N'oublie pas de cocher "${objectiveName}" si tu l'as respecté aujourd'hui ! Tu es à ${percentage}% de réussite ! 🎯`,
          );
        } else {
          parts.push(
            `Aujourd'hui est une nouvelle chance de progresser sur "${objectiveName}" ! 💫`,
          );
        }
      }
    }
  }

  return parts.join("\n\n");
}
