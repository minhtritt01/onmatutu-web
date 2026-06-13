import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Không tìm thấy trang",
  description: "Trang bạn tìm kiếm không tồn tại.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-brand-yellow">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Trang không tìm thấy</h1>
      <p className="mt-3 text-foreground/60">
        Ổn mà — trang này chỉ là đi lạc thôi, không phải bạn.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-brand-yellow px-6 py-2.5 text-sm font-medium text-foreground transition hover:opacity-90"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
