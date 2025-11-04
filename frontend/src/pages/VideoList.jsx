import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { BASE_URL } from '../services/api'

function VideoList() {
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      const response = await api.get('/videos/list')
      setVideos(response.data)
      if (response.data.length > 0) {
        setSelectedVideo(response.data[0])
      }
    } catch (error) {
      console.error('Videolarni yuklashda xatolik:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleDownloadPdf = (pdfUrl, pdfName) => {
    const link = document.createElement('a')
    link.href = `${BASE_URL}${pdfUrl}`
    link.download = pdfName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Yuklanmoqda...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-medium text-gray-900">Video Darslar</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              Bosh sahifa
            </button>
            <button
              onClick={() => navigate('/upload-video')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Video Yuklash
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {videos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-6">Hali videolar yo'q</p>
            <button
              onClick={() => navigate('/upload-video')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Video Yuklash
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Video Player - 3/4 width */}
            <div className="lg:col-span-3">
              <div className="bg-white">
                {/* Video Info */}
                <div className="mb-4">
                  <h2 className="text-2xl font-medium text-gray-900 mb-2">
                    {selectedVideo?.title || selectedVideo?.name}
                  </h2>
                  {selectedVideo?.description && (
                    <p className="text-gray-600">{selectedVideo.description}</p>
                  )}
                </div>

                {/* Video Player */}
                <div className="bg-black rounded overflow-hidden mb-6">
                  <video
                    key={selectedVideo?.videoUrl}
                    className="w-full"
                    controls
                    controlsList="nodownload"
                  >
                    <source
                      src={`${BASE_URL}${selectedVideo?.videoUrl}`}
                      type="video/mp4"
                    />
                    Brauzeringiz video playerni qo'llab-quvvatlamaydi.
                  </video>
                </div>

                {/* PDF Download Section */}
                {selectedVideo?.pdfUrl && (
                  <div className="border border-gray-200 rounded p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Uyga vazifa (PDF)</h3>
                        <p className="text-sm text-gray-500">{selectedVideo.pdfName}</p>
                      </div>
                      <button
                        onClick={() => handleDownloadPdf(selectedVideo.pdfUrl, selectedVideo.pdfName)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Yuklab olish
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Video List - 1/4 width */}
            <div className="lg:col-span-1">
              <div className="bg-white">
                <h3 className="font-medium text-gray-900 mb-4">
                  Barcha darslar ({videos.length})
                </h3>
                <div className="space-y-2">
                  {videos.map((video, index) => (
                    <div
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className={`p-3 border rounded cursor-pointer transition ${
                        selectedVideo?.id === video.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-medium text-gray-700">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
                            {video.title || video.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {formatFileSize(video.size)}
                            </span>
                            {video.pdfUrl && (
                              <span className="text-xs text-blue-600">• PDF</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoList
