import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import StudentDashboard from './pages/StudentDashboard'
import CourseListing from './pages/CourseListing'
import TeacherDashboard from './pages/TeacherDashboard'
import TeacherLessons from './pages/TeacherLessons'
import StudentLesson from './pages/StudentLesson'
import UploadVideo from './pages/UploadVideo'
import VideoList from './pages/VideoList'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1f2937',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#FF6636',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/courses" element={<CourseListing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<MyProfile />} />
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
