package uz.edu.lms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.edu.lms.entity.Certificate;
import uz.edu.lms.entity.Course;
import uz.edu.lms.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByCertificateCode(String certificateCode);
    Optional<Certificate> findByStudentAndCourse(User student, Course course);
    List<Certificate> findByStudent(User student);
}
