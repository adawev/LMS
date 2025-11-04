# Learning Theory LMS - Ta'lim Nazariyasi

## Loyiha Haqida
"Ta'lim nazariyasi" fanidan onlayn ta'lim platformasi. Platforma talabalar va o'qituvchilar uchun mo'ljallangan bo'lib, 10 ta moduldan iborat to'liq kursni o'z ichiga oladi.

## Texnologiyalar
- **Backend**: Java Spring Boot
- **Frontend**: React
- **Database**: PostgreSQL
- **Authentication**: JWT (Spring Security)

## Loyiha Strukturasi
```
learning-theory-lms/
├── backend/          # Spring Boot backend
├── frontend/         # React frontend
└── docs/            # Hujjatlar
```

## Foydalanuvchi Rollari
1. **Administrator** - Tizimni boshqaruvchi
2. **O'qituvchi** - Kursni olib boruvchi
3. **Talaba** - Kurs tinglovchisi

## Asosiy Funksiyalar
- Video darslar
- Testlar va quizlar
- Reflektiv topshiriqlar
- Elektron portfolio
- Sertifikat berish
- Forum va chat
- Analitika va hisobotlar
- Ko'p tillilik (O'zbek, Rus, Ingliz)

## O'rnatish va Ishga Tushirish

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Port
- Backend: http://localhost:8080
- Frontend: http://localhost:3000

## Ma'lumotlar Bazasi
PostgreSQL (Port: 5432)
Database: learning_theory_lms
