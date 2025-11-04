package uz.edu.lms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uz.edu.lms.entity.Course;
import uz.edu.lms.entity.Enrollment;
import uz.edu.lms.entity.User;
import uz.edu.lms.repository.CourseRepository;
import uz.edu.lms.repository.EnrollmentRepository;
import uz.edu.lms.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public List<Enrollment> getStudentEnrollments(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return enrollmentRepository.findByStudent(student);
    }

    public Enrollment enrollStudent(Long studentId, Long courseId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .status(Enrollment.EnrollmentStatus.ACTIVE)
                .build();

        return enrollmentRepository.save(enrollment);
    }

    public Enrollment updateProgress(Long enrollmentId, Double progress) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        enrollment.setProgress(progress);
        if (progress >= 100.0) {
            enrollment.setStatus(Enrollment.EnrollmentStatus.COMPLETED);
        }
        return enrollmentRepository.save(enrollment);
    }
}
