import type { IconProps } from "@/components/result-icons/icon-system";
import { FallbackIcon } from "@/components/result-icons/icon-system";
import { bigFiveIcons } from "@/components/result-icons/big-five-icons";
import { mbtiIcons } from "@/components/result-icons/mbti-icons";
import { enneagramIcons } from "@/components/result-icons/enneagram-icons";
import { discIcons } from "@/components/result-icons/disc-icons";
import { loveLanguagesIcons } from "@/components/result-icons/love-languages-icons";
import { attachmentStyleIcons } from "@/components/result-icons/attachment-style-icons";

const REGISTRY: Record<string, Record<string, (props: IconProps) => React.JSX.Element>> = {
  "big-five": bigFiveIcons,
  mbti: mbtiIcons,
  enneagram: enneagramIcons,
  disc: discIcons,
  "love-languages": loveLanguagesIcons,
  "attachment-style": attachmentStyleIcons,
};

export function getResultIcon(quizId: string, key: string): (props: IconProps) => React.JSX.Element {
  return REGISTRY[quizId]?.[key] ?? FallbackIcon;
}
