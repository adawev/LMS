package uz.edu.lms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.edu.lms.entity.Course;
import uz.edu.lms.entity.Module;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    List<Module> findByCourseOrderByOrderNumberAsc(Course course);
}
