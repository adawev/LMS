package uz.edu.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateLessonRequest {
    private String title;
    private String description;
    private String videoUrl;
    private String pdfUrl;
    private String pdfFileName;
    private Long moduleId;
    private Integer duration;
    private String thumbnailUrl;
    private String transcript;
}
