package uz.edu.lms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {

    private final String uploadDir = "uploads";
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/metadata")
    public ResponseEntity<Map<String, String>> saveMetadata(@RequestBody Map<String, String> metadata) {
        try {
            Path metadataPath = Paths.get(uploadDir, "metadata").toAbsolutePath();
            if (!Files.exists(metadataPath)) {
                Files.createDirectories(metadataPath);
            }

            String videoFileName = metadata.get("videoFileName");
            String metadataFileName = videoFileName.substring(0, videoFileName.lastIndexOf('.')) + ".json";
            Path metadataFile = metadataPath.resolve(metadataFileName);

            objectMapper.writeValue(metadataFile.toFile(), metadata);

            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> listVideos() {
        try {
            Path videosPath = Paths.get(uploadDir, "videos").toAbsolutePath();
            Path pdfsPath = Paths.get(uploadDir, "pdfs").toAbsolutePath();
            Path metadataPath = Paths.get(uploadDir, "metadata").toAbsolutePath();

            if (!Files.exists(videosPath)) {
                return ResponseEntity.ok(new ArrayList<>());
            }

            List<Map<String, Object>> videos = new ArrayList<>();

            Files.list(videosPath)
                    .filter(Files::isRegularFile)
                    .forEach(videoPath -> {
                        try {
                            Map<String, Object> videoInfo = new HashMap<>();
                            String videoFileName = videoPath.getFileName().toString();
                            String videoId = videoFileName.substring(0, videoFileName.lastIndexOf('.'));

                            videoInfo.put("id", videoId);
                            videoInfo.put("name", videoFileName);
                            videoInfo.put("videoUrl", "/api/videos/stream/" + videoFileName);
                            videoInfo.put("size", Files.size(videoPath));

                            // Load metadata
                            Path metadataFile = metadataPath.resolve(videoId + ".json");
                            if (Files.exists(metadataFile)) {
                                Map<String, Object> metadata = objectMapper.readValue(metadataFile.toFile(), Map.class);
                                videoInfo.put("title", metadata.get("title"));
                                videoInfo.put("description", metadata.get("description"));
                            }

                            // Check for PDF
                            if (Files.exists(pdfsPath)) {
                                Files.list(pdfsPath)
                                        .filter(p -> p.getFileName().toString().startsWith(videoId))
                                        .findFirst()
                                        .ifPresent(pdfPath -> {
                                            String pdfFileName = pdfPath.getFileName().toString();
                                            videoInfo.put("pdfUrl", "/api/videos/pdf/" + pdfFileName);
                                            videoInfo.put("pdfName", pdfFileName);
                                        });
                            }

                            videos.add(videoInfo);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });

            return ResponseEntity.ok(videos);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/stream/{filename:.+}")
    public ResponseEntity<Resource> streamVideo(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir, "videos", filename).toAbsolutePath();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType("video/mp4"))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/pdf/{filename:.+}")
    public ResponseEntity<Resource> downloadPdf(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir, "pdfs", filename).toAbsolutePath();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
