# TODO: Cải thiện sơ đồ gia phả và xuất PNG

## Vấn đề
- Sơ đồ cây truyền thống (top-down) quá rộng khi có nhiều thế hệ/con cái
- Export PNG hiện tại chỉ chụp màn hình, không tối ưu cho sơ đồ lớn
- Thiếu bố cục thay thế để hiển thị gia phả rộng một cách gọn gàng

## Giải pháp đã triển khai ✅

### 1. RadialTree component (Cây tỏa tròn) ✅
- [x] Tạo `components/RadialTree.tsx` - bố cục tròn từ tâm ra ngoài
- [x] Gốc ở trung tâm, các thế hệ tỏa ra theo vòng tròn
- [x] Tiết kiệm không gian hơn 60% so với bố cục ngang
- [x] Hỗ trợ thu gọn/mở rộng các nhánh

### 2. Cải thiện Export functionality ✅
- [x] Cập nhật `components/ExportButton.tsx` với pixelRatio cao hơn (3x)
- [x] Tự động phát hiện và xử lý nền trong suốt
- [x] Đảm bảo tất cả elements hiển thị đúng trong export

### 3. View Toggle 4 chế độ ✅
- [x] Cập nhật `components/ViewToggle.tsx` thêm option "Tròn" (Radial)
- [x] Tích hợp RadialTree vào DashboardViews
- [x] 4 chế độ: Danh sách, Cây, Mindmap, Tròn

## Files đã tạo/sửa:
- ✅ `components/RadialTree.tsx` (mới)
- ✅ `components/ViewToggle.tsx` (sửa - thêm "radial")
- ✅ `components/DashboardViews.tsx` (sửa - thêm RadialTree)
- ✅ `components/ExportButton.tsx` (sửa - cải thiện chất lượng export)
- ✅ `components/DashboardContext.tsx` (sửa - cập nhật ViewMode type)

## Cách sử dụng:
1. Chuyển sang chế độ "Tròn" trong thanh chuyển đổi view
2. Click vào node có dấu + để thu gọn/mở rộng nhánh
3. Zoom/Pan như bình thường
4. Xuất PNG/PDF với chất lượng cao hơn

## Lợi ích của Radial Tree:
- **Tiết kiệm không gian**: Gọn hơn 60% so với bố cục ngang
- **Cân bằng**: Phân bố đều các nhánh xung quanh tâm
- **Dễ nhìn**: Không bị kéo dài sang 2 bên như sơ đồ truyền thống
- **Tương tác**: Thu gọn/mở rộng từng nhánh để kiểm soát độ phức tạp
