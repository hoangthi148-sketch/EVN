
# 🔌 EVN VN - Giám sát điện EVN cho Home Assistant

---

## 🚀 Cách sử dụng

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=hoangthi148-sketch&repository=EVN)

- Tải về qua HACS sau đó khởi động lại Home Assistant
- Vào Thiết Bị Thêm EVN VN, Điền Tên Đăng Nhập, Mật Khẩu, Mã Khách Hàng Trên Ứng Dụng EVN(Ứng dụng mới dùng chung cho toàn bộ khu vực)

## ✨ Tính năng

- Sản lượng và tiền điện theo ngày, tháng, kỳ hóa đơn
- Tiền nợ và hóa đơn
- **Lịch cắt điện**: sensor `lich_cat_dien` và thẻ "Lịch Cắt Điện" trên giao diện web EVN Monitor (lấy cả lịch sắp tới trong 30 ngày)

## 🛠️ Ghi đè số liệu hóa đơn hàng tháng (tùy chọn)

Nếu EVN chưa có hoặc sai hóa đơn của một số tháng, bạn có thể nhập tay bằng file `/config/npc_monthly_override.json`. Từ bản **1.0.3**, file này khai báo **theo từng mã khách hàng**, chỉ áp dụng cho đúng mã đó, các mã khác không bị ảnh hưởng:

```json
{
  "PNNQ000010429": {
    "2026": {
      "1": [181, 426000],
      "2": [213, 517000]
    }
  }
}
```

- Cấu trúc: `"<MÃ KH>"` → `"<NĂM>"` → `"<THÁNG>": [kWh, tiền điện]`.
- Mã KH viết hoa hoặc thường đều được.
- Chỉ ghi đè năm hiện tại; tháng nào không khai báo thì lấy dữ liệu từ EVN.
- File theo định dạng cũ (khóa ngoài cùng là năm, không có mã KH) sẽ bị bỏ qua và có cảnh báo trong log Home Assistant. Hãy bọc nội dung cũ trong mã KH như ví dụ trên.
- Sửa file xong không cần khởi động lại, tải lại biểu đồ là thấy số mới.

## ❤️ Đóng góp

Nếu bạn có câu hỏi hoặc muốn cải tiến, hãy mở [Issue](https://github.com/hoangthi148-sketch/EVN/issues) hoặc gửi PR.

## 🙏 Nguồn gốc

Dự án được phát triển dựa trên [TriTue2011/npc](https://github.com/TriTue2011/npc), được chỉnh sửa và duy trì bởi [@hoangthi148-sketch](https://github.com/hoangthi148-sketch).

---

## 📜 License

MIT License.
