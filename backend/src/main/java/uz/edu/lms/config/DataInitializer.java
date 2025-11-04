package uz.edu.lms.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import uz.edu.lms.entity.*;
import uz.edu.lms.repository.*;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final VideoLessonRepository videoLessonRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Initializing demo data...");

        // Create demo users
        User admin = createUser("admin@test.com", "Admin", "User", "password123", User.Role.ADMIN);
        User teacher = createUser("teacher@test.com", "John", "Teacher", "password123", User.Role.TEACHER);
        User student = createUser("student@test.com", "Jane", "Student", "password123", User.Role.STUDENT);

        log.info("Demo users created:");
        log.info("Admin: admin@test.com / password123");
        log.info("Teacher: teacher@test.com / password123");
        log.info("Student: student@test.com / password123");

        // Create demo courses
        Course javaCourse = createCourse("Java Programming", "Learn Java from scratch to advanced level", teacher);
        Course pythonCourse = createCourse("Python Language", "Master Python programming", teacher);
        Course reactCourse = createCourse("React Development", "Build modern web applications with React", teacher);

        // Create modules and lessons for Java course
        uz.edu.lms.entity.Module javaModule1 = createModule("Introduction to Java", "Basic concepts of Java programming", javaCourse, 1);
        createVideoLesson(
            "Getting Started with Java",
            "In this lesson, you'll learn the basics of Java programming language and set up your development environment.",
            "https://www.youtube.com/watch?v=example1",
            javaModule1,
            600
        );

        uz.edu.lms.entity.Module javaModule2 = createModule("Object-Oriented Programming", "Learn OOP concepts in Java", javaCourse, 2);
        createVideoLesson(
            "Classes and Objects",
            "Understand classes, objects, inheritance, and polymorphism in Java.",
            "https://www.youtube.com/watch?v=example2",
            javaModule2,
            900
        );

        // Create modules and lessons for Python course
        uz.edu.lms.entity.Module pythonModule1 = createModule("Python Basics", "Introduction to Python programming", pythonCourse, 1);
        createVideoLesson(
            "Python Fundamentals",
            "Learn Python syntax, variables, data types, and basic operations.",
            "https://www.youtube.com/watch?v=example3",
            pythonModule1,
            720
        );

        uz.edu.lms.entity.Module pythonModule2 = createModule("Data Structures", "Python data structures and algorithms", pythonCourse, 2);
        createVideoLesson(
            "Lists, Tuples, and Dictionaries",
            "Master Python's built-in data structures for efficient programming.",
            "https://www.youtube.com/watch?v=example4",
            pythonModule2,
            840
        );

        // Create modules and lessons for React course
        uz.edu.lms.entity.Module reactModule1 = createModule("React Basics", "Introduction to React framework", reactCourse, 1);
        createVideoLesson(
            "Components and JSX",
            "Learn how to create React components and use JSX syntax.",
            "https://www.youtube.com/watch?v=example5",
            reactModule1,
            780
        );

        uz.edu.lms.entity.Module reactModule2 = createModule("State and Props", "Managing state in React applications", reactCourse, 2);
        createVideoLesson(
            "React Hooks",
            "Master useState, useEffect, and other React Hooks for state management.",
            "https://www.youtube.com/watch?v=example6",
            reactModule2,
            960
        );

        log.info("Demo courses and lessons created successfully!");
    }

    private User createUser(String email, String firstName, String lastName, String password, User.Role role) {
        if (userRepository.findByEmail(email).isPresent()) {
            return userRepository.findByEmail(email).get();
        }

        User user = User.builder()
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .password(passwordEncoder.encode(password))
                .role(role)
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }

    private Course createCourse(String title, String description, User teacher) {
        Course course = Course.builder()
                .title(title)
                .description(description)
                .teacher(teacher)
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        return courseRepository.save(course);
    }

    private uz.edu.lms.entity.Module createModule(String title, String description, Course course, int orderNumber) {
        uz.edu.lms.entity.Module module = uz.edu.lms.entity.Module.builder()
                .title(title)
                .description(description)
                .course(course)
                .orderNumber(orderNumber)
                .createdAt(LocalDateTime.now())
                .build();

        return moduleRepository.save(module);
    }

    private VideoLesson createVideoLesson(String title, String description, String videoUrl, uz.edu.lms.entity.Module module, int duration) {
        VideoLesson lesson = VideoLesson.builder()
                .title(title)
                .description(description)
                .videoUrl(videoUrl)
                .videoType(VideoLesson.VideoType.URL)
                .module(module)
                .duration(duration)
                .createdAt(LocalDateTime.now())
                .build();

        return videoLessonRepository.save(lesson);
    }
}
