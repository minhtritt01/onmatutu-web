import type { IconProps } from "@/components/result-icons/icon-system";
import { TriangleUp, TriangleDown, SpeechBubble, Anchor, ZigzagLine, Ruler, Blob } from "@/components/result-icons/primitives";

export const discIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  D_high: TriangleUp,
  D_low: TriangleDown,
  I_high: (props) => <SpeechBubble dots={3} {...props} />,
  I_low: (props) => <SpeechBubble dots={1} {...props} />,
  S_high: Anchor,
  S_low: ZigzagLine,
  C_high: Ruler,
  C_low: Blob,
};
