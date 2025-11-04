package uz.edu.lms.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import uz.edu.lms.service.FileUploadService;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileUploadService fileUploadService;

    @PostMapping("/upload/video")
    public ResponseEntity<Map<String, String>> uploadVideo(@RequestParam("file") MultipartFile file) {
        try {
            log.info("Uploading video: {}, size: {} bytes", file.getOriginalFilename(), file.getSize());
            String filePath = fileUploadService.uploadFile(file, "videos");
            log.info("Video uploaded successfully: {}", filePath);
            Map<String, String> response = new HashMap<>();
            response.put("filePath", filePath);
            response.put("fileName", file.getOriginalFilename());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error uploading video: {}", file.getOriginalFilename(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/upload/pdf")
    public ResponseEntity<Map<String, String>> uploadPdf(@RequestParam("file") MultipartFile file) {
        try {
            String filePath = fileUploadService.uploadFile(file, "pdfs");
            Map<String, String> response = new HashMap<>();
            response.put("filePath", filePath);
            response.put("fileName", file.getOriginalFilename());
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteFile(@RequestParam String filePath) {
        try {
            fileUploadService.deleteFile(filePath);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
