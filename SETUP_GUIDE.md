# Learning Theory LMS - O'rnatish Qo'llanmasi

## Talablar
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+

## Backend O'rnatish

### 1. Ma'lumotlar bazasini yaratish
```sql
CREATE DATABASE learning_theory_lms;
```

### 2. application.yml ni sozlash
`backend/src/main/resources/application.yml` faylida ma'lumotlar bazasi ma'lumotlarini yangilang:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/learning_theory_lms
    username: postgres
    password: sizning_parolingiz
```

### 3. Backend serverni ishga tushirish
```bash
cd backend
./mvnw spring-boot:run
```

Backend http://localhost:8080 da ishga tushadi

## Frontend O'rnatish

### 1. Dependencies o'rnatish
```bash
cd frontend
npm install
```

### 2. Development serverni ishga tushirish
```bash
npm run dev
```

Frontend http://localhost:3000 da ishga tushadi

## Birinchi Foydalanuvchi Yaratish

### Admin yaratish (SQL orqali):
```sql
INSERT INTO users (email, password, first_name, last_name, role, active, created_at)
VALUES (
  'admin@lms.uz',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: admin123
  'Admin',
  'User',
  'ADMIN',
  true,
  NOW()
);
```

Keyin login sahifasidan kirish:
- Email: admin@lms.uz
- Parol: admin123

## Loyiha Strukturasi

```
learning-theory-lms/
├── backend/
│   ├── src/main/java/uz/edu/lms/
│   │   ├── entity/          # Database entities
│   │   ├── repository/      # JPA repositories
│   │   ├── service/         # Business logic
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Data transfer objects
│   │   ├── config/          # Configuration
│   │   └── security/        # Security & JWT
│   └── src/main/resources/
│       └── application.yml  # Configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # State management
│   │   ├── i18n/            # Translations
│   │   └── utils/           # Utility functions
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- POST /api/auth/register - Ro'yxatdan o'tish
- POST /api/auth/login - Kirish

### Users (Admin)
- GET /api/admin/users - Barcha foydalanuvchilar
- GET /api/admin/users/{id} - Foydalanuvchi ma'lumotlari
- POST /api/admin/users - Yangi foydalanuvchi
- PUT /api/admin/users/{id} - Foydalanuvchi yangilash
- DELETE /api/admin/users/{id} - Foydalanuvchi o'chirish

### Courses
- GET /api/courses - Barcha kurslar
- GET /api/courses/{id} - Kurs ma'lumotlari
- POST /api/courses - Yangi kurs (Teacher/Admin)
- PUT /api/courses/{id} - Kurs yangilash (Teacher/Admin)
- DELETE /api/courses/{id} - Kurs o'chirish (Admin)

## Qo'shimcha Xususiyatlar (To'ldirish Kerak)

Quyidagi funksionalliklar asosiy strukturaga ega, lekin to'ldirilishi kerak:

### Backend Service va Controllerlar:
1. ModuleService va ModuleController
2. QuizService va QuizController
3. ReflectionService va ReflectionController
4. PortfolioService va PortfolioController
5. CertificateService va CertificateController
6. ForumService va ForumController
7. ChatService va ChatController (WebSocket)
8. NotificationService va NotificationController
9. EnrollmentService va EnrollmentController

### Frontend Components:
1. Video Player component (react-player)
2. Quiz Taking interface
3. Reflection submission form
4. Portfolio dashboard
5. Forum threads
6. Real-time chat
7. Certificate viewer
8. Analytics dashboard

## Muhim Eslatmalar

1. **Security**: JWT secret key'ni production'da alohida sozlang
2. **File Upload**: File upload funksionallik uchun storage sozlash kerak
3. **Email**: SMTP sozlamalari email notification uchun
4. **WebSocket**: Chat funksionallik uchun WebSocket sozlash
5. **Translations**: Ko'proq tarjimalar qo'shish mumkin i18n/config.js da

## Development Tips

### Backend Testing
```bash
cd backend
./mvnw test
```

### Frontend Build
```bash
cd frontend
npm run build
```

### Database Migration
Hibernate DDL auto-update ishlatiladi. Production uchun Flyway yoki Liquibase tavsiya etiladi.

## Xatoliklarni Bartaraf Etish

### Backend ishlamasa:
1. PostgreSQL ishlab turganini tekshiring
2. Database credentials to'g'ri ekanini tekshiring
3. Port 8080 band emasligini tekshiring

### Frontend ishlamasa:
1. npm install to'liq bajarilganini tekshiring
2. Backend ishlab turganini tekshiring
3. Port 3000 band emasligini tekshiring

## Texnik Yordam

Muammolar yuzaga kelsa, quyidagilarni tekshiring:
1. Loglarni ko'ring (backend console va browser console)
2. Network tabni tekshiring (browser DevTools)
3. Database connectionni tekshiring
