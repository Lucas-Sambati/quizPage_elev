import type { QuizAnswers } from "@/hooks/useQuiz";

/**
 * Tipos de perfil baseados nas respostas
 */
export type ProfileType =
  | "OCUPADO"
  | "DESALINHADO"
  | "OBSTINADO"
  | "PROGRESSIVO"
  | "REATIVO"
  | "SEM_DIRECAO"
  | "BLOQUEADO"
  | "ENERGICO"
  | "EXIGENTE"
  | "MALEAVAL"
  | "LONGEVIDADE";

/**
 * Determina o perfil com base no caminho percorrido no quiz
 */
export function getProfile(answers: QuizAnswers): ProfileType {
  const {
    gymFrequency,
    lowFreqReason,
    gymDuration,
    motivationFactor,
    currentGoal,
    stagnationReason,
    changeDesire,
  } = answers;

  if (gymFrequency === "2 ou menos") {
    if (lowFreqReason === "Falta de tempo") {
      if (gymDuration === "Menos de uma hora") return "OCUPADO";
      return "DESALINHADO";
    }
    if (lowFreqReason === "Pouca motivação") {
      if (motivationFactor === "Competição") return "OBSTINADO";
      if (motivationFactor === "Perceber evoluções no seu físico")
        return "PROGRESSIVO";
      return "REATIVO";
    }
    return "SEM_DIRECAO";
  }

  // 3 à 4 vezes ou 5 ou mais
  if (currentGoal === "Me sinto estagnado e quero voltar a evoluir") {
    if (stagnationReason === "Minha rotina não se encaixa mais no meu objetivo")
      return "DESALINHADO";
    return "BLOQUEADO";
  }
  if (currentGoal === "Quero uma mudança no planejamento dos treinos") {
    if (changeDesire === "Quero um treino mais dinâmico") return "ENERGICO";
    if (changeDesire === "Quero um acompanhamento individual e personalizado")
      return "EXIGENTE";
    return "MALEAVAL";
  }
  return "LONGEVIDADE";
}

/**
 * URL base do bucket R2 público (Cloudflare)
 */
const R2_BASE_URL = "https://vsl.elevhq.com";

/**
 * Mapeamento hardcoded: perfil → nome do arquivo de vídeo no bucket R2.
 */
const PROFILE_VIDEO_MAP: Record<ProfileType, string> = {
  OCUPADO: "VSL OCUPADO",
  DESALINHADO: "VSL DESALINHADO",
  OBSTINADO: "VSL OBSTINADO",
  PROGRESSIVO: "VSL PROGRESSIVO",
  REATIVO: "VSL REATIVO",
  SEM_DIRECAO: "VSL SEM DIRECAO",
  BLOQUEADO: "VSL BLOQUEADO",
  ENERGICO: "VSL ENERGICO",
  EXIGENTE: "VSL EXIGENTE",
  MALEAVAL: "VSL MALEAVAL",
  LONGEVIDADE: "VSL LONGEVIDADE",
};

export function getVideoUrl(profile: ProfileType): string {
  const objectKey = PROFILE_VIDEO_MAP[profile];
  return `${R2_BASE_URL}/${encodeURIComponent(objectKey)}.mp4`;
}
