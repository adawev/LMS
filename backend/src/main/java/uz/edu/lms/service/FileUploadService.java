package uz.edu.lms.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileUploadService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        // Create folder if doesn't exist - use absolute path
        Path folderPath = Paths.get(uploadDir, folder).toAbsolutePath();
        System.out.println("Creating folder: " + folderPath);
        if (!Files.exists(folderPath)) {
            Files.createDirectories(folderPath);
            System.out.println("Folder created: " + folderPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // Save file - use absolute path
        Path filePath = folderPath.resolve(uniqueFilename);
        System.out.println("Saving file to: " + filePath);
        file.transferTo(filePath.toFile());
        System.out.println("File saved successfully");

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
