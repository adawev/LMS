import { Routes, Route } from 'react-router-dom'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import TeacherLessons from './pages/TeacherLessons'
import StudentLesson from './pages/StudentLesson'
import UploadVideo from './pages/UploadVideo'
import VideoList from './pages/VideoList'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher-lessons" element={<TeacherLessons />} />
        <Route path="/student-lesson/:lessonId" element={<StudentLesson />} />
        <Route path="/upload-video" element={<UploadVideo />} />
        <Route path="/video-list" element={<VideoList />} />
      </Routes>
    </div>
  )
}

export default App
