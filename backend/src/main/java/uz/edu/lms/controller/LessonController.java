package uz.edu.lms.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.edu.lms.dto.CreateLessonRequest;
import uz.edu.lms.dto.VideoLessonDTO;
import uz.edu.lms.service.VideoLessonService;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LessonController {

    private final VideoLessonService videoLessonService;

    @PostMapping
    public ResponseEntity<VideoLessonDTO> createLesson(@RequestBody CreateLessonRequest request) {
        try {
            VideoLessonDTO lesson = videoLessonService.createLesson(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(lesson);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<VideoLessonDTO> updateLesson(
            @PathVariable Long id,
            @RequestBody CreateLessonRequest request) {
        try {
            VideoLessonDTO lesson = videoLessonService.updateLesson(id, request);
            return ResponseEntity.ok(lesson);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoLessonDTO> getLessonById(@PathVariable Long id) {
        try {
            VideoLessonDTO lesson = videoLessonService.getLessonById(id);
            return ResponseEntity.ok(lesson);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<VideoLessonDTO>> getAllLessons() {
        List<VideoLessonDTO> lessons = videoLessonService.getAllLessons();
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<VideoLessonDTO>> getLessonsByCourse(@PathVariable Long courseId) {
        List<VideoLessonDTO> lessons = videoLessonService.getLessonsByCourseId(courseId);
        return ResponseEntity.ok(lessons);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        try {
            videoLessonService.deleteLesson(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
