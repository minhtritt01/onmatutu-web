import type { IconProps } from "@/components/result-icons/icon-system";
import {
  Checkmark,
  HeartOutline,
  Star,
  Teardrop,
  MagnifyingGlass,
  Shield,
  Burst,
  Chevron,
  ConcentricCircles,
} from "@/components/result-icons/primitives";

export const enneagramIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  type1: Checkmark,
  type2: HeartOutline,
  type3: Star,
  type4: Teardrop,
  type5: MagnifyingGlass,
  type6: Shield,
  type7: Burst,
  type8: Chevron,
  type9: ConcentricCircles,
};
