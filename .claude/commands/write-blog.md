# write-blog

Viết bài blog mới cho @onmatutu từ kế hoạch nội dung tháng 1.

## Cách dùng
`/write-blog [ngày]` — ví dụ: `/write-blog 2`, `/write-blog Ngày 4`, `/write-blog 15`,
hoặc chỉ `/write-blog` (không có tham số) để tự động chọn ngày tiếp theo.

## Quy trình thực hiện

### Bước 0 — Xác định ngày cần viết (chỉ khi không có tham số)
Nếu `$ARGUMENTS` rỗng:
1. Đọc `content/blog/.write-blog-state.json` → lấy mảng `writtenDays`.
2. Quét lần lượt ngày 1 → 30, chọn **ngày nhỏ nhất chưa có trong `writtenDays`**
   (điều này tự động ưu tiên lấp các ngày bị bỏ sót trước khi đi tiếp).
3. Nếu cả 30 ngày đã có trong `writtenDays`, dừng lại và báo cho người dùng
   biết kế hoạch tháng 1 đã viết hết — không tạo file nào cả.
4. Dùng ngày vừa chọn làm `$ARGUMENTS` cho các bước tiếp theo.

Nếu `$ARGUMENTS` có giá trị, dùng trực tiếp như bình thường (bỏ qua bước này).

### Bước 1 — Đọc kế hoạch
Đọc file `onmatutu_thang1_stories.md` (ở root của project).
Tìm `### NGÀY <ngày đã xác định ở Bước 0>` (hoặc số tương ứng).
Lấy: **Chủ đề**, **Cảm xúc**, **nhân vật + câu chuyện**, **Quote**.

### Bước 2 — Tính episode tiếp theo
Đếm số file `.mdx` trong `content/blog/vi/` → episode tiếp theo = count + 1.
Format: `ep004`, `ep005`, ... (3 chữ số, zero-padded).
episodeId: `EP004`, `EP005`, ...

### Bước 3 — Sinh slug
Từ **Chủ đề** trong kế hoạch, tạo kebab-case slug tiếng Việt không dấu.
Ví dụ: "Sống xa nhà" → `song-xa-nha`, "Bị mắng oan ở công ty" → `bi-mang-oan-o-cong-ty`.
Tên file: `ep00N-<slug>.mdx`

### Bước 4 — Viết bản tiếng Việt
Tạo `content/blog/vi/ep00N-<slug>.mdx` với:

**Frontmatter:**
```yaml
---
title: "<tiêu đề hấp dẫn từ chủ đề>"
description: "<1 câu: tên nhân vật + tình huống cụ thể + điều họ phải đối mặt>"
date: "<ngày hôm nay ISO>"
pillar: "<A hoặc B — xem bên dưới>"
episodeId: "EP00N"
videoUrl: ""
tags: ["<3–4 tags tiếng Việt>"]
---
```

Pillar:
- **A** = câu chuyện về nỗ lực, kiên trì, vượt khó (xa nhà, làm thêm, bị oan, tài chính)
- **B** = mindset, nhịp riêng, so sánh bản thân, tự tha thứ

**Nội dung (300–500 chữ):**
- Mở đầu: chi tiết cụ thể ngay lập tức — giờ giấc / số tiền / hành động / địa điểm. KHÔNG mở bằng câu hỏi tu từ kiểu "Bạn có bao giờ..."
- Dùng đúng tên nhân vật từ kế hoạch. Không dùng placeholder.
- Cấu trúc: **setup** (hoàn cảnh cụ thể) → **tension** (khoảnh khắc khó) → **pivot** (quyết định nhỏ, thầm lặng) → **kết mở** (không giáo huấn)
- Ngắt đoạn bằng `---` giữa các nhịp câu chuyện
- Kết bài: quote từ kế hoạch, in đậm nghiêng: `***"..."***`
- Câu cuối: câu hỏi mở 1 dòng gửi đến người đọc, in đậm

**Từ bị cấm:** "hành trình", "vươn lên", "tỏa sáng", "thành công"
**Quote KHÔNG được bắt đầu bằng:** "Hãy", "Bạn phải", "Đừng"

### Bước 5 — Viết bản tiếng Anh
Tạo `content/blog/en/ep00N-<slug>.mdx` — **dịch và viết lại**, không phải dịch máy.

**Frontmatter:** title và description bằng tiếng Anh tự nhiên, tags bằng tiếng Anh.
**Nội dung:** Giữ nguyên tên nhân vật (Lan, Hùng, Tú...), giữ số tiền VND, giữ chi tiết văn hóa (mì gói, ký túc xá, xe buýt...). Giọng văn tiếng Anh tự nhiên, không dịch cứng.

### Bước 6 — Kiểm tra build
Chạy `npm run build` để xác nhận không có lỗi.

### Bước 7 — Cập nhật state file
Sau khi build pass, cập nhật `content/blog/.write-blog-state.json`:
- Thêm ngày vừa viết vào mảng `writtenDays` (sắp xếp tăng dần, không trùng lặp).
- Cập nhật `lastEpisode` thành episode slug vừa tạo (ví dụ `"ep007"`).

---

## Ví dụ kết quả cho Ngày 2

**vi:** `content/blog/vi/ep004-song-xa-nha.mdx`
**en:** `content/blog/en/ep004-song-xa-nha.mdx`

Nhân vật: **Lan**, 19 tuổi, Cần Thơ lên Sài Gòn, tài khoản 87,000đ, gói mì thứ 3 trong ngày, thấy ảnh ba mẹ bán lúa trong nhóm chat, đặt điện thoại xuống, không gọi xin tiền.
Quote: *"Gọi đi. Mẹ không bao giờ phiền vì con cần mẹ đâu."*

## Ví dụ dùng không tham số

Chạy `/write-blog` (không có ngày). Giả sử `writtenDays` hiện tại là `[1, 2, 4, 9]`
→ hệ thống tự chọn **Ngày 3** (ngày nhỏ nhất chưa viết), viết bài như bình thường,
rồi cập nhật `writtenDays` thành `[1, 2, 3, 4, 9]`. Lần chạy `/write-blog` kế tiếp
sẽ tự chọn **Ngày 5**.
