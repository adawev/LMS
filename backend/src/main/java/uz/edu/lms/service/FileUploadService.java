package uz.edu.lms.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
public class FileUploadService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        // Create folder if doesn't exist - use absolute path
        Path folderPath = Paths.get(uploadDir, folder).toAbsolutePath();
        log.debug("Creating folder: {}", folderPath);
        if (!Files.exists(folderPath)) {
            Files.createDirectories(folderPath);
            log.info("Folder created: {}", folderPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // Save file - use absolute path
        Path filePath = folderPath.resolve(uniqueFilename);
        log.debug("Saving file to: {}", filePath);
        file.transferTo(filePath.toFile());
        log.info("File saved successfully: {}", uniqueFilename);

        // Return relative path
        return folder + "/" + uniqueFilename;
    }

    public void deleteFile(String filePath) throws IOException {
        Path path = Paths.get(uploadDir, filePath);
        if (Files.exists(path)) {
            Files.delete(path);
        }
    }
}
