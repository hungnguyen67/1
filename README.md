# SmartUni - Hệ thống Quản lý Đại học Thông minh

## Mô tả Dự án

SmartUni là một hệ thống quản lý đại học toàn diện được xây dựng để hỗ trợ các hoạt động đào tạo, quản lý sinh viên, giảng viên và các quy trình học thuật. Dự án bao gồm hai phần chính: backend được phát triển bằng Spring Boot (Java) và frontend sử dụng Angular (TypeScript). Hệ thống cung cấp giao diện web thân thiện cho người dùng và API RESTful mạnh mẽ cho việc tích hợp.

### Tính năng Chính

- **Quản lý Người dùng và Phân quyền**: Hỗ trợ nhiều vai trò (Admin, Giảng viên, Sinh viên) với xác thực JWT và OAuth2 (Google).
- **Cấu trúc Đào tạo**: Quản lý chuyên ngành, khối kiến thức, môn học và chương trình đào tạo.
- **Quản lý Khóa học và Lịch học**: Tạo và quản lý lớp học phần, lịch giảng dạy, thi cử.
- **Đăng ký và Điểm số**: Sinh viên có thể đăng ký khóa học, theo dõi điểm số và tiến độ học tập.
- **Điểm danh và Tham gia**: Theo dõi sự tham gia của sinh viên trong các buổi học.
- **Thông báo**: Gửi thông báo đến người dùng theo phạm vi (tất cả, theo vai trò, lớp, khóa học).
- **Báo cáo và Thống kê**: Cung cấp các báo cáo về kết quả học tập, thống kê đào tạo.

### Kiến trúc Hệ thống

- **Backend (Spring Boot)**: Xử lý logic nghiệp vụ, API REST, bảo mật, và tương tác cơ sở dữ liệu.
- **Frontend (Angular)**: Giao diện người dùng responsive, sử dụng Tailwind CSS cho styling.
- **Cơ sở dữ liệu**: MySQL với schema được định nghĩa trong `data.sql`.
- **Triển khai**: Sử dụng Docker và Docker Compose để container hóa ứng dụng.

## Công nghệ Sử dụng

- **Backend**:
  - Java 17+
  - Spring Boot 3.x
  - Spring Security (JWT, OAuth2)
  - Spring Data JPA
  - MySQL 8.0
  - Maven

- **Frontend**:
  - Angular 15+
  - TypeScript
  - Tailwind CSS
  - RxJS

- **DevOps**:
  - Docker & Docker Compose
  - GitHub Actions (CI/CD)
  - Nginx (cho frontend production)

## Yêu cầu Hệ thống

- **Java**: JDK 17 hoặc cao hơn
- **Node.js**: 18+ (cho Angular)
- **MySQL**: 8.0+
- **Docker**: 20.10+
- **Docker Compose**: 2.0+

## Cài đặt và Chạy Dự án

### 1. Clone Repository

```bash
git clone <your-repository-url>
cd SmartUni
```

### 2. Cấu hình Cơ sở dữ liệu

- Cài đặt MySQL và tạo database `smartuni`.
- Import schema từ `backend/src/main/resources/data.sql`.

### 3. Chạy Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend sẽ chạy trên `http://localhost:8001`.

### 4. Chạy Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend sẽ chạy trên `http://localhost:4200`.

### 5. Triển khai với Docker (Khuyến nghị)

```bash
# Build và start services
docker-compose up --build -d

# Stop services
docker-compose down
```

- Backend: `http://localhost:8001`
- Frontend: `http://localhost:4200`

## Cấu trúc Dự án

```
SmartUni/
├── backend/                 # Spring Boot application
│   ├── src/main/java/com/example/demo/
│   │   ├── config/          # Cấu hình bảo mật, CORS, v.v.
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # JPA repositories
│   │   └── service/         # Business logic services
│   ├── src/main/resources/
│   │   ├── application.properties  # Cấu hình ứng dụng
│   │   └── data.sql         # Database schema & sample data
│   └── pom.xml              # Maven dependencies
├── frontend/                # Angular application
│   ├── src/app/
│   │   ├── components/      # Angular components
│   │   ├── services/        # Angular services
│   │   ├── shared/          # Shared components & layouts
│   │   └── app.module.ts    # App module
│   ├── angular.json         # Angular CLI config
│   └── package.json         # NPM dependencies
├── docker-compose.yml       # Docker Compose config
└── README.md                # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Đặt lại mật khẩu

### User Management
- `GET /api/users` - Lấy danh sách người dùng
- `POST /api/users` - Tạo người dùng mới
- `PUT /api/users/{id}` - Cập nhật người dùng
- `DELETE /api/users/{id}` - Xóa người dùng

### Academic Management
- `GET /api/majors` - Lấy danh sách chuyên ngành
- `GET /api/knowledge-blocks` - Lấy danh sách khối kiến thức
- `GET /api/subjects` - Lấy danh sách môn học
- `GET /api/schedules` - Lấy lịch học

*(Chi tiết API có thể được tìm thấy trong Swagger UI khi chạy backend)*

## Cấu hình

### Backend (application.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smartuni
spring.datasource.username=your_username
spring.datasource.password=your_password
jwt.secret=your_jwt_secret
```

### Frontend (environment files)
- `src/environments/environment.ts` - Cấu hình development
- `src/environments/environment.prod.ts` - Cấu hình production

## CI/CD với GitHub Actions

Dự án sử dụng GitHub Actions để tự động build và push Docker images lên Docker Hub.

### Thiết lập Secrets
Trong repository settings, thêm:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

Workflow sẽ trigger khi push lên branch `main`.

## Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## Giấy phép

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## Liên hệ

- **Tác giả**: [Tên của bạn]
- **Email**: [Email của bạn]
- **GitHub**: [Link GitHub]

---

*Để biết thêm thông tin chi tiết, vui lòng tham khảo tài liệu trong code hoặc liên hệ với đội ngũ phát triển.*
