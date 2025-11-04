package uz.edu.lms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uz.edu.lms.entity.VideoLesson;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoLessonRepository extends JpaRepository<VideoLesson, Long> {

    Optional<VideoLesson> findByModuleId(Long moduleId);

    @Query("SELECT vl FROM VideoLesson vl JOIN FETCH vl.module m WHERE m.course.id = :courseId ORDER BY m.orderNumber")
    List<VideoLesson> findByCourseIdOrderByModuleOrder(@Param("courseId") Long courseId);

    @Query("SELECT COUNT(vl) FROM VideoLesson vl JOIN vl.module m WHERE m.course.id = :courseId")
    Long countByCourseId(@Param("courseId") Long courseId);
}
