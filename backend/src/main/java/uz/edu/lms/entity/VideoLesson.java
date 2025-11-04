package uz.edu.lms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "video_lessons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String videoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VideoType videoType = VideoType.URL;

    private Integer duration;

    private String thumbnailUrl;

    @Column(columnDefinition = "TEXT")
    private String transcript;

    private String pdfUrl;

    private String pdfFileName;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum VideoType {
        URL, UPLOAD
    }
}
