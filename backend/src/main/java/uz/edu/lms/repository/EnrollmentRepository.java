package uz.edu.lms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.edu.lms.entity.Course;
import uz.edu.lms.entity.Enrollment;
import uz.edu.lms.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Optional<Enrollment> findByStudentAndCourse(User student, Course course);
    List<Enrollment> findByStudent(User student);
    List<Enrollment> findByCourse(Course course);
}
