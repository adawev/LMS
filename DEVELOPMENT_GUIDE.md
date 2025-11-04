# Development Guide - Qo'shimcha Funksionalliklar Qo'shish

## Backend Development

### 1. Yangi Service Yaratish Pattern

```java
package uz.edu.lms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uz.edu.lms.entity.YourEntity;
import uz.edu.lms.repository.YourRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class YourService {

    private final YourRepository repository;

    public List<YourEntity> getAll() {
        return repository.findAll();
    }

    public YourEntity getById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Not found"));
    }

    public YourEntity create(YourEntity entity) {
        return repository.save(entity);
    }

    public YourEntity update(Long id, YourEntity entity) {
        YourEntity existing = getById(id);
        // Update fields
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
```

### 2. Yangi Controller Yaratish Pattern

```java
package uz.edu.lms.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.edu.lms.entity.YourEntity;
import uz.edu.lms.service.YourService;

import java.util.List;

@RestController
@RequestMapping("/api/your-endpoint")
@RequiredArgsConstructor
public class YourController {

    private final YourService service;

    @GetMapping
    public ResponseEntity<List<YourEntity>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<YourEntity> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<YourEntity> create(@RequestBody YourEntity entity) {
        return ResponseEntity.ok(service.create(entity));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<YourEntity> update(@PathVariable Long id, @RequestBody YourEntity entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
```

## Frontend Development

### 1. Yangi Page Yaratish Pattern

```jsx
import { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import { yourService } from '../services/api'

function YourPage() {
  const [data, setData] = useState(null)

  const { data: items, isLoading } = useQuery('items', yourService.getAll)

  const mutation = useMutation(yourService.create, {
    onSuccess: () => {
      // Refetch or update state
    }
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Page</h1>
      {/* Your content */}
    </div>
  )
}

export default YourPage
```

### 2. API Service Qo'shish

`frontend/src/services/api.js` ga qo'shing:

```javascript
export const yourService = {
  getAll: () => api.get('/your-endpoint'),
  getById: (id) => api.get(`/your-endpoint/${id}`),
  create: (data) => api.post('/your-endpoint', data),
  update: (id, data) => api.put(`/your-endpoint/${id}`, data),
  delete: (id) => api.delete(`/your-endpoint/${id}`),
}
```

## To'ldirish Kerak Bo'lgan Qismlar

### 1. Module Management (YUQORI PRIORITET)

**Backend:**
- ModuleService.java
- ModuleController.java
- VideoLessonService.java
- VideoLessonController.java

**Frontend:**
- ModuleList.jsx component
- ModuleDetail.jsx component
- VideoPlayer.jsx component

### 2. Quiz System (YUQORI PRIORITET)

**Backend:**
- QuizService.java - Test yaratish, tahrirlash
- QuizAttemptService.java - Test topshirish, baholash
- QuestionService.java - Savol boshqarish

**Frontend:**
- QuizBuilder.jsx - O'qituvchi uchun test yaratish
- QuizTaker.jsx - Talaba uchun test topshirish
- QuizResults.jsx - Natijalarni ko'rish

### 3. Reflection Assignments

**Backend:**
- ReflectionAssignmentService.java
- ReflectionSubmissionService.java

**Frontend:**
- AssignmentForm.jsx
- SubmissionList.jsx
- GradingInterface.jsx

### 4. Portfolio

**Backend:**
- PortfolioService.java
- PortfolioItemService.java

**Frontend:**
- Portfolio.jsx
- PortfolioBuilder.jsx

### 5. Certificate System

**Backend:**
- CertificateService.java
- CertificateGenerator util class (PDF generation)

**Frontend:**
- CertificateViewer.jsx
- CertificateList.jsx

### 6. Forum

**Backend:**
- ForumService.java
- ForumPostService.java

**Frontend:**
- ForumList.jsx
- ForumThread.jsx
- PostEditor.jsx

### 7. Chat (WebSocket)

**Backend:**
- WebSocketConfig.java
- ChatMessageService.java
- ChatController.java (WebSocket)

**Frontend:**
- Chat.jsx component
- useWebSocket hook

### 8. Analytics Dashboard

**Backend:**
- AnalyticsService.java
- StatisticsDTO.java

**Frontend:**
- AdminAnalytics.jsx
- TeacherAnalytics.jsx
- StudentProgress.jsx
- Charts components (recharts)

### 9. Notifications

**Backend:**
- NotificationService.java
- EmailService.java

**Frontend:**
- NotificationBell.jsx component
- NotificationList.jsx

### 10. File Upload

**Backend:**
- FileStorageService.java
- FileUploadController.java

**Frontend:**
- FileUpload.jsx component
- useFileUpload hook

## Database Seeding (Test ma'lumotlari)

`backend/src/main/resources/data.sql` yarating:

```sql
-- Sample course
INSERT INTO courses (title, description, teacher_id, active, created_at)
VALUES ('Ta''lim Nazariyasi', 'Ta''lim nazariyasi asoslari', 1, true, NOW());

-- Sample modules
INSERT INTO modules (title, description, course_id, order_number, created_at)
VALUES
  ('Kirish', 'Ta''lim nazariyasiga kirish', 1, 1, NOW()),
  ('Biheviorizm', 'Biheviorizm nazariyasi', 1, 2, NOW());
```

## Testing

### Backend Unit Tests

```java
@SpringBootTest
class YourServiceTest {

    @Autowired
    private YourService service;

    @MockBean
    private YourRepository repository;

    @Test
    void testGetAll() {
        // Test implementation
    }
}
```

### Frontend Testing

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

## Best Practices

1. **Clean Code**: O'qilishi oson kod yozing
2. **Error Handling**: Xatolarni to'g'ri ushlang
3. **Validation**: Input validatsiya qo'shing
4. **Security**: Role-based access control
5. **Performance**: Lazy loading, pagination
6. **Responsive**: Mobile-friendly design
7. **Accessibility**: ARIA labels, keyboard navigation

## Git Workflow

```bash
# Yangi feature uchun branch yaratish
git checkout -b feature/module-management

# Commit qilish
git add .
git commit -m "Add module management feature"

# Push qilish
git push origin feature/module-management
```

## Production Deployment

1. **Backend JAR Build**:
```bash
cd backend
./mvnw clean package
java -jar target/learning-theory-lms-1.0.0.jar
```

2. **Frontend Build**:
```bash
cd frontend
npm run build
# dist papkasini static serverga deploy qiling
```

3. **Environment Variables**:
- Database credentials
- JWT secret
- SMTP settings
- File storage path
