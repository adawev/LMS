package uz.edu.lms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uz.edu.lms.entity.Course;
import uz.edu.lms.entity.Module;
import uz.edu.lms.repository.CourseRepository;
import uz.edu.lms.repository.ModuleRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final CourseRepository courseRepository;

    public List<Module> getModulesByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return moduleRepository.findByCourseOrderByOrderNumberAsc(course);
    }

    public Module getModuleById(Long id) {
        return moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found"));
    }

    public Module createModule(Module module, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        module.setCourse(course);
        return moduleRepository.save(module);
    }

    public Module updateModule(Long id, Module moduleDetails) {
        Module module = getModuleById(id);
        module.setTitle(moduleDetails.getTitle());
        module.setDescription(moduleDetails.getDescription());
        module.setOrderNumber(moduleDetails.getOrderNumber());
        return moduleRepository.save(module);
    }

    public void deleteModule(Long id) {
        moduleRepository.deleteById(id);
    }
}
