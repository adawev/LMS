import { Routes, Route } from 'react-router-dom'
import TeacherDashboard from './pages/TeacherDashboard'
import UploadVideo from './pages/UploadVideo'
import VideoList from './pages/VideoList'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<TeacherDashboard />} />
        <Route path="/upload-video" element={<UploadVideo />} />
        <Route path="/video-list" element={<VideoList />} />
      </Routes>
    </div>
  )
}

export default App
