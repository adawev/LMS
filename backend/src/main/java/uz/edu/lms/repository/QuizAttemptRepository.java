package uz.edu.lms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.edu.lms.entity.Quiz;
import uz.edu.lms.entity.QuizAttempt;
import uz.edu.lms.entity.User;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByQuizAndStudentOrderByStartedAtDesc(Quiz quiz, User student);
    int countByQuizAndStudent(Quiz quiz, User student);
}
