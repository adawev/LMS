package uz.edu.lms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.edu.lms.dto.CreateLessonRequest;
import uz.edu.lms.dto.VideoLessonDTO;
import uz.edu.lms.entity.Module;
import uz.edu.lms.entity.VideoLesson;
import uz.edu.lms.repository.ModuleRepository;
import uz.edu.lms.repository.VideoLessonRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoLessonService {

    private final VideoLessonRepository videoLessonRepository;
    private final ModuleRepository moduleRepository;

    @Transactional
    public VideoLessonDTO createLesson(CreateLessonRequest request) {
        Module module = moduleRepository.findById(request.getModuleId())
                .orElseThrow(() -> new RuntimeException("Module not found with id: " + request.getModuleId()));

        // Check if module already has a video lesson
        if (module.getVideoLesson() != null) {
            throw new RuntimeException("Module already has a video lesson");
        }

        VideoLesson videoLesson = VideoLesson.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .videoUrl(request.getVideoUrl())
                .pdfUrl(request.getPdfUrl())
                .pdfFileName(request.getPdfFileName())
                .duration(request.getDuration())
                .thumbnailUrl(request.getThumbnailUrl())
                .transcript(request.getTranscript())
                .videoType(VideoLesson.VideoType.UPLOAD)
                .module(module)
                .build();

        VideoLesson saved = videoLessonRepository.save(videoLesson);
        return toDTO(saved);
    }

    @Transactional
    public VideoLessonDTO updateLesson(Long id, CreateLessonRequest request) {
        VideoLesson videoLesson = videoLessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video lesson not found with id: " + id));

        if (request.getTitle() != null) {
            videoLesson.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            videoLesson.setDescription(request.getDescription());
        }
        if (request.getVideoUrl() != null) {
            videoLesson.setVideoUrl(request.getVideoUrl());
        }
        if (request.getPdfUrl() != null) {
            videoLesson.setPdfUrl(request.getPdfUrl());
        }
        if (request.getPdfFileName() != null) {
            videoLesson.setPdfFileName(request.getPdfFileName());
        }
        if (request.getDuration() != null) {
            videoLesson.setDuration(request.getDuration());
        }
        if (request.getThumbnailUrl() != null) {
            videoLesson.setThumbnailUrl(request.getThumbnailUrl());
        }
        if (request.getTranscript() != null) {
            videoLesson.setTranscript(request.getTranscript());
        }

        VideoLesson updated = videoLessonRepository.save(videoLesson);
        return toDTO(updated);
    }

    @Transactional(readOnly = true)
    public VideoLessonDTO getLessonById(Long id) {
        VideoLesson videoLesson = videoLessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video lesson not found with id: " + id));
        return toDTO(videoLesson);
    }

    @Transactional(readOnly = true)
    public List<VideoLessonDTO> getLessonsByCourseId(Long courseId) {
        return videoLessonRepository.findByCourseIdOrderByModuleOrder(courseId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VideoLessonDTO> getAllLessons() {
        return videoLessonRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteLesson(Long id) {
        if (!videoLessonRepository.existsById(id)) {
            throw new RuntimeException("Video lesson not found with id: " + id);
        }
        videoLessonRepository.deleteById(id);
    }

    private VideoLessonDTO toDTO(VideoLesson videoLesson) {
        Module module = videoLesson.getModule();
        return VideoLessonDTO.builder()
                .id(videoLesson.getId())
                .title(videoLesson.getTitle())
                .description(videoLesson.getDescription())
                .videoUrl(videoLesson.getVideoUrl())
                .pdfUrl(videoLesson.getPdfUrl())
                .pdfFileName(videoLesson.getPdfFileName())
                .duration(videoLesson.getDuration())
                .thumbnailUrl(videoLesson.getThumbnailUrl())
                .transcript(videoLesson.getTranscript())
                .moduleId(module.getId())
                .moduleName(module.getTitle())
                .moduleOrder(module.getOrderNumber())
                .courseId(module.getCourse().getId())
                .courseName(module.getCourse().getTitle())
                .createdAt(videoLesson.getCreatedAt())
                .updatedAt(videoLesson.getUpdatedAt())
                .build();
    }
}
