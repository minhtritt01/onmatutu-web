import type { IconProps } from "@/components/result-icons/icon-system";
import { Anchor, ZigzagLine, Shield, CrackedHeart } from "@/components/result-icons/primitives";

export const attachmentStyleIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  secure: Anchor,
  anxious: ZigzagLine,
  avoidant: Shield,
  fearful: CrackedHeart,
};
