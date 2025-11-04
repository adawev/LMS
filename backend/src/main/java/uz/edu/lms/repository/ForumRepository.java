package uz.edu.lms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.edu.lms.entity.Course;
import uz.edu.lms.entity.Forum;
import uz.edu.lms.entity.Module;

import java.util.List;

@Repository
public interface ForumRepository extends JpaRepository<Forum, Long> {
    List<Forum> findByCourse(Course course);
    List<Forum> findByModule(Module module);
}
