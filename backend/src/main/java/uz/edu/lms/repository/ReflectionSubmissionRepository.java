package uz.edu.lms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.edu.lms.entity.ReflectionAssignment;
import uz.edu.lms.entity.ReflectionSubmission;
import uz.edu.lms.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReflectionSubmissionRepository extends JpaRepository<ReflectionSubmission, Long> {
    Optional<ReflectionSubmission> findByAssignmentAndStudent(ReflectionAssignment assignment, User student);
    List<ReflectionSubmission> findByAssignment(ReflectionAssignment assignment);
    List<ReflectionSubmission> findByStudent(User student);
}
