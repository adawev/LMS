package uz.edu.lms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uz.edu.lms.entity.Certificate;
import uz.edu.lms.entity.Course;
import uz.edu.lms.entity.User;
import uz.edu.lms.repository.CertificateRepository;
import uz.edu.lms.repository.CourseRepository;
import uz.edu.lms.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public Certificate generateCertificate(Long studentId, Long courseId, Double finalScore) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        String grade = calculateGrade(finalScore);
        String certificateCode = UUID.randomUUID().toString();

        Certificate certificate = Certificate.builder()
                .student(student)
                .course(course)
                .certificateCode(certificateCode)
                .finalScore(finalScore)
                .grade(grade)
                .issuedBy(course.getTeacher())
                .build();

        return certificateRepository.save(certificate);
    }

    public Certificate verifyCertificate(String certificateCode) {
        return certificateRepository.findByCertificateCode(certificateCode)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));
    }

    public List<Certificate> getStudentCertificates(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return certificateRepository.findByStudent(student);
    }

    private String calculateGrade(Double score) {
        if (score >= 90) return "A'LO";
        if (score >= 80) return "YAXSHI";
        if (score >= 70) return "O'RTA";
        if (score >= 60) return "QONIQARLI";
        return "QONIQARSIZ";
    }
}
