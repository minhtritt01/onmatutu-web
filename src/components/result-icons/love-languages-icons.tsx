import type { IconProps } from "@/components/result-icons/icon-system";
import { SpeechBubble, Clock, GiftBox, Wrench, HeartFilled } from "@/components/result-icons/primitives";

export const loveLanguagesIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  wordsOfAffirmation: (props) => <SpeechBubble dots={2} {...props} />,
  qualityTime: Clock,
  receivingGifts: GiftBox,
  actsOfService: Wrench,
  physicalTouch: HeartFilled,
};
