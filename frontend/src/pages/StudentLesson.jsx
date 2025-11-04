import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

function StudentLesson() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const videoRef = useRef(null)

  const [lesson, setLesson] = useState(null)
  const [allLessons, setAllLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [videoProgress, setVideoProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    loadLesson()
    loadAllLessons()
  }, [lessonId])

  const loadLesson = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/lessons/${lessonId}`)
      console.log('Loaded lesson:', response.data)
      const videoFilename = response.data.videoUrl?.split('/')[1]
      console.log('Video filename:', videoFilename)
      console.log('Full video URL:', `http://localhost:8080/api/videos/stream/${videoFilename}`)
      setLesson(response.data)
    } catch (error) {
      console.error('Error loading lesson:', error)
      toast.error('Failed to load lesson')
    } finally {
      setLoading(false)
    }
  }

  const loadAllLessons = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/lessons')
      setAllLessons(response.data)
    } catch (error) {
      console.error('Error loading lessons:', error)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setVideoProgress(progress)
    }
  }

  const handleDownloadPdf = () => {
    if (lesson.pdfUrl) {
      const pdfFilename = lesson.pdfUrl.split('/')[1]
      const link = document.createElement('a')
      link.href = `http://localhost:8080/api/videos/pdf/${pdfFilename}`
      link.download = lesson.pdfFileName || pdfFilename
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('PDF download started!')
    }
  }

  const goToLesson = (id) => {
    navigate(`/student-lesson/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Lesson not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-300 hover:text-white"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white">{lesson.title}</h1>
                <p className="text-xs text-gray-400">{lesson.courseName} • {lesson.moduleName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white lg:hidden"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 ${showSidebar ? 'lg:mr-96' : ''}`}>
          {/* Video Player */}
          <div className="bg-black">
            <div className="max-w-full mx-auto">
              <video
                ref={videoRef}
                className="w-full"
                controls
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={(e) => {
                  console.error('Video error:', e)
                  toast.error('Error loading video. Please try again.')
                }}
                controlsList="nodownload"
              >
                <source
                  src={`http://localhost:8080/api/videos/stream/${lesson.videoUrl.split('/')[1]}`}
                />
                Your browser does not support the video player.
              </video>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-800 px-4 py-2">
            <div className="max-w-full mx-auto">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                <span>Progress</span>
                <span>{videoProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lesson Info */}
          <div className="bg-gray-800 px-6 py-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{lesson.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="inline-flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {lesson.moduleName}
                    </span>
                    <span>•</span>
                    <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {lesson.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">About this lesson</h3>
                  <p className="text-gray-300 leading-relaxed">{lesson.description}</p>
                </div>
              )}

              {/* PDF Download */}
              {lesson.pdfUrl && (
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <svg className="h-10 w-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Course Materials</h4>
                        <p className="text-sm text-gray-400">{lesson.pdfFileName}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleDownloadPdf}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Course Content */}
        <div className={`${showSidebar ? 'fixed lg:fixed' : 'hidden'} right-0 top-16 w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto h-[calc(100vh-4rem)] z-40`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Course Content</h3>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-gray-400 hover:text-white lg:hidden"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              {allLessons.length === 0 ? (
                <p className="text-gray-400 text-sm">No lessons available</p>
              ) : (
                allLessons.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => goToLesson(item.id)}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      item.id === lesson.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          item.id === lesson.id ? 'bg-blue-700' : 'bg-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{item.title}</h4>
                        <p className="text-xs opacity-75 mt-1">{item.moduleName}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {item.pdfUrl && (
                            <span className="inline-flex items-center text-xs">
                              <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                              </svg>
                              PDF
                            </span>
                          )}
                        </div>
                      </div>
                      {item.id === lesson.id && (
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Toggle for Mobile */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 lg:hidden z-50"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default StudentLesson
