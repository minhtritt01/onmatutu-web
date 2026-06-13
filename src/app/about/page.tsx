import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: `Câu chuyện về ${siteConfig.name} và nhân vật đồng hành.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Về {siteConfig.name}</h1>

      <div className="mb-6 flex justify-center">
        <div className="relative h-48 w-48 overflow-hidden rounded-2xl border-2 border-brand-yellow">
          <Image
            src="/character/phoenix-peaceful.jpg"
            alt="Nhân vật đồng hành của Ổn Mà, Từ Từ"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="prose prose-neutral max-w-none">
        <p>
          <strong>{siteConfig.name}</strong> ({siteConfig.hashtag}) là một
          kênh hoạt hình ngắn dành cho những ai đang đi làm, đi học, và đôi khi
          cảm thấy mọi thứ hơi quá nhiều.
        </p>
        <p>
          Nhân vật chính của kênh không phải một "huấn luyện viên động lực" —
          mà giống một người bạn ngồi cạnh bạn, nói: "không sao đâu, từ từ rồi
          cũng ổn".
        </p>
        <p>
          Mỗi video là một tình huống nhỏ trong đời thường — thất bại, so
          sánh bản thân, mệt mỏi, burnout — và một góc nhìn tích cực, không
          giáo điều, không quote sáo rỗng.
        </p>
        <p>
          Theo dõi kênh trên TikTok, YouTube Shorts, Facebook & Instagram
          Reels để không bỏ lỡ câu chuyện mới mỗi tuần.
        </p>
      </div>
    </div>
  );
}
