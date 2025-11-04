import { useNavigate } from 'react-router-dom'

function TeacherDashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">Ta'lim Nazariyasi LMS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/video-list')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
              >
                📺 Video Darslar
              </button>
              <button
                onClick={() => navigate('/upload-video')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                📹 Video Yuklash
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Darslarim</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Talabalar</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Yuklangan Videolar</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Tezkor havolalar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/video-list')}
              className="p-4 border-2 border-green-500 rounded-lg hover:bg-green-50 text-left"
            >
              <div className="text-3xl mb-2">📺</div>
              <h3 className="font-semibold text-gray-800">Video Darslar</h3>
              <p className="text-sm text-gray-600">Videolarni ko'rish va yuklab olish</p>
            </button>

            <button
              onClick={() => navigate('/upload-video')}
              className="p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 text-left"
            >
              <div className="text-3xl mb-2">📹</div>
              <h3 className="font-semibold text-gray-800">Video Yuklash</h3>
              <p className="text-sm text-gray-600">Video va PDF yuklang</p>
            </button>

            <button
              onClick={() => navigate('/courses')}
              className="p-4 border-2 border-purple-500 rounded-lg hover:bg-purple-50 text-left"
            >
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-semibold text-gray-800">Kurslar</h3>
              <p className="text-sm text-gray-600">Kurslarni ko'rish</p>
            </button>

            <button
              className="p-4 border-2 border-orange-500 rounded-lg hover:bg-orange-50 text-left"
            >
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold text-gray-800">Statistika</h3>
              <p className="text-sm text-gray-600">Hisobotlar va natijalar</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard
