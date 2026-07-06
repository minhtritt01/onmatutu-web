import type { IconProps } from "@/components/result-icons/icon-system";
import {
  Bulb,
  Box,
  Checkmark,
  ScribbleLine,
  Sun,
  DotInCircle,
  HeartOutline,
  Shield,
  ZigzagLine,
  FlatLine,
} from "@/components/result-icons/primitives";

export const bigFiveIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  openness_high: Bulb,
  openness_low: Box,
  conscientiousness_high: Checkmark,
  conscientiousness_low: ScribbleLine,
  extraversion_high: Sun,
  extraversion_low: DotInCircle,
  agreeableness_high: HeartOutline,
  agreeableness_low: Shield,
  neuroticism_high: ZigzagLine,
  neuroticism_low: FlatLine,
};
