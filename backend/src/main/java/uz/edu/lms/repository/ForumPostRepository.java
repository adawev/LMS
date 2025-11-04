package uz.edu.lms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.edu.lms.entity.Forum;
import uz.edu.lms.entity.ForumPost;

import java.util.List;

@Repository
public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {
    List<ForumPost> findByForumAndParentPostIsNullOrderByCreatedAtDesc(Forum forum);
    List<ForumPost> findByParentPostOrderByCreatedAtAsc(ForumPost parentPost);
}
