package uz.edu.lms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uz.edu.lms.entity.*;
import uz.edu.lms.exception.ResourceNotFoundException;
import uz.edu.lms.repository.QuizAttemptRepository;
import uz.edu.lms.repository.QuizRepository;
import uz.edu.lms.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final UserRepository userRepository;

    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", id));
    }

    public Quiz createQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    public QuizAttempt submitQuiz(Long quizId, Long studentId, List<Answer> answers) {
        Quiz quiz = getQuizById(quizId);
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", studentId));

        int totalScore = 0;
        int maxScore = 0;

        for (Answer answer : answers) {
            maxScore += answer.getQuestion().getPoints();
            if (answer.getCorrect()) {
                totalScore += answer.getQuestion().getPoints();
            }
        }

        double percentage = (totalScore * 100.0) / maxScore;
        boolean passed = percentage >= quiz.getPassingScore();

        QuizAttempt attempt = QuizAttempt.builder()
                .quiz(quiz)
                .student(student)
                .answers(answers)
                .score(totalScore)
                .percentage(percentage)
                .passed(passed)
                .completedAt(LocalDateTime.now())
                .build();

        return quizAttemptRepository.save(attempt);
    }

    public List<QuizAttempt> getStudentAttempts(Long quizId, Long studentId) {
        Quiz quiz = getQuizById(quizId);
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", studentId));
        return quizAttemptRepository.findByQuizAndStudentOrderByStartedAtDesc(quiz, student);
    }
}
