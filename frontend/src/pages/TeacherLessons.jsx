import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Logo from '../components/Logo'

function TeacherLessons() {
  const navigate = useNavigate()
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [lessonToDelete, setLessonToDelete] = useState(null)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    videoFile: null,
    pdfFile: null,
  })
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ video: 0, pdf: 0 })

  useEffect(() => {
    loadLessons()
  }, [])

  const loadLessons = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8080/api/lessons')
      setLessons(response.data)
    } catch (error) {
      console.error('Error loading lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files && files[0]) {
      setUploadForm(prev => ({ ...prev, [name]: files[0] }))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUploadForm(prev => ({ ...prev, [name]: value }))
  }

  const uploadFile = async (file, type) => {
    const data = new FormData()
    data.append('file', file)

    const response = await axios.post(
      `http://localhost:8080/api/files/upload/${type}`,
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(prev => ({ ...prev, [type]: percentCompleted }))
        }
      }
    )
    return response.data
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault()

    if (!uploadForm.videoFile) {
      toast.error('Please select a video file!')
      return
    }

    setUploading(true)
    const loadingToast = toast.loading('Uploading lesson...')

    try {
      // Upload video
      const videoResult = await uploadFile(uploadForm.videoFile, 'video')

      // Upload PDF if exists
      let pdfResult = null
      if (uploadForm.pdfFile) {
        pdfResult = await uploadFile(uploadForm.pdfFile, 'pdf')
      }

      // Create lesson
      const lessonData = {
        title: uploadForm.title,
        description: uploadForm.description,
        videoUrl: videoResult.filePath,
        pdfUrl: pdfResult?.filePath || null,
        pdfFileName: pdfResult?.fileName || null,
      }

      await axios.post('http://localhost:8080/api/lessons', lessonData)

      toast.success('Lesson created successfully! 🎉', { id: loadingToast })
      setShowUploadModal(false)
      setUploadForm({
        title: '',
        description: '',
        videoFile: null,
        pdfFile: null,
      })
      setUploadProgress({ video: 0, pdf: 0 })
      loadLessons()
    } catch (error) {
      console.error('Error creating lesson:', error)
      toast.error('Failed to create lesson. Please try again.', { id: loadingToast })
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteClick = (lesson) => {
    setLessonToDelete(lesson)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!lessonToDelete) return

    const loadingToast = toast.loading('Deleting lesson...')

    try {
      await axios.delete(`http://localhost:8080/api/lessons/${lessonToDelete.id}`)
      toast.success('Lesson deleted successfully!', { id: loadingToast })
      setShowDeleteModal(false)
      setLessonToDelete(null)
      loadLessons()
    } catch (error) {
      console.error('Error deleting lesson:', error)
      toast.error('Failed to delete lesson!', { id: loadingToast })
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setLessonToDelete(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation - Same as Student Dashboard */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Logo className="w-10 h-10 mr-3" />
                <div>
                  <span className="text-xl font-bold text-gray-900 block leading-none">MoreEduce</span>
                  <span className="text-xs text-orange-600 font-medium">Teaching Portal</span>
                </div>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <a href="#" onClick={() => navigate('/')} className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium">Home</a>
                <a href="#" className="text-gray-900 hover:text-orange-600 px-3 py-2 text-sm font-medium">My Lessons</a>
                <a href="#" onClick={() => navigate('/teacher')} className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium">Dashboard</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-700 hover:text-orange-600 text-sm font-medium"
              >
                Student View
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-white border border-orange-600 text-orange-600 px-4 py-2 rounded hover:bg-orange-50 text-sm font-medium"
              >
                Login
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 text-sm font-medium"
              >
                + New Lesson
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Similar to Student Dashboard */}
      <div className="bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Lessons</h1>
          <p className="text-gray-600">Manage your video lessons and course materials</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-3xl font-bold text-orange-600 mb-2">{lessons.length}</p>
            <p className="text-sm text-gray-600 font-medium">Total Lessons</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-3xl font-bold text-orange-600 mb-2">{lessons.filter(l => l.pdfUrl).length}</p>
            <p className="text-sm text-gray-600 font-medium">With Materials</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-3xl font-bold text-orange-600 mb-2">0</p>
            <p className="text-sm text-gray-600 font-medium">Students</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-3xl font-bold text-orange-600 mb-2">100%</p>
            <p className="text-sm text-gray-600 font-medium">Active</p>
          </div>
        </div>

        {/* Lessons Grid - Same style as Student Dashboard */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : lessons.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first lesson.</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-orange-600 text-white px-6 py-3 rounded hover:bg-orange-700 font-medium"
            >
              + Create Lesson
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Lesson Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <div className="absolute top-3 left-3">
                    <span className="bg-orange-600 text-white px-3 py-1 rounded text-xs font-medium">
                      Lesson {index + 1}
                    </span>
                  </div>
                  <svg className="h-20 w-20 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                {/* Lesson Details */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span className="inline-flex items-center">
                      <svg className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(lesson.createdAt).toLocaleDateString()}
                    </span>
                    {lesson.pdfUrl && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center text-green-600">
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                          PDF
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[56px]">
                    {lesson.title}
                  </h3>

                  {lesson.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                      {lesson.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/student-lesson/${lesson.id}`)}
                      className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Watch
                    </button>
                    <button
                      onClick={() => handleDeleteClick(lesson)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Create New Lesson</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={uploadForm.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Introduction to Learning Theory"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={uploadForm.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Brief description of the lesson..."
                />
              </div>

              {/* Video File */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video File *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                  <input
                    type="file"
                    name="videoFile"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="videoFile"
                    required
                  />
                  <label htmlFor="videoFile" className="cursor-pointer">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      {uploadForm.videoFile ? (
                        <span className="font-medium text-orange-600">
                          {uploadForm.videoFile.name} ({(uploadForm.videoFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      ) : (
                        <>Click to upload video or drag and drop</>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">MP4, AVI, MOV up to 500MB</p>
                  </label>
                </div>
                {uploading && uploadProgress.video > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Uploading video...</span>
                      <span>{uploadProgress.video}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress.video}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* PDF File */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF Materials (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    name="pdfFile"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="pdfFile"
                  />
                  <label htmlFor="pdfFile" className="cursor-pointer">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      {uploadForm.pdfFile ? (
                        <span className="font-medium text-green-600">
                          {uploadForm.pdfFile.name} ({(uploadForm.pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      ) : (
                        <>Click to upload PDF or drag and drop</>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF up to 50MB</p>
                  </label>
                </div>
                {uploading && uploadProgress.pdf > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Uploading PDF...</span>
                      <span>{uploadProgress.pdf}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress.pdf}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`flex-1 py-3 px-6 rounded-lg text-white font-medium ${
                    uploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                >
                  {uploading ? 'Creating Lesson...' : 'Create Lesson'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && lessonToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Lesson
              </h3>

              <p className="text-sm text-gray-600 text-center mb-2">
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{lessonToDelete.title}"</span>?
              </p>

              <p className="text-sm text-gray-500 text-center mb-6">
                This action cannot be undone. All lesson data including video and PDF materials will be permanently removed.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Delete Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Same as Student Dashboard */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Logo className="w-10 h-10 mr-3" />
                <div>
                  <span className="text-xl font-bold text-gray-900 block leading-none">MoreEduce</span>
                  <span className="text-xs text-orange-600">Learning Platform</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Professional learning management system for modern education.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">GET HELP</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-orange-600">Contact Us</a></li>
                <li><a href="#" className="hover:text-orange-600">Latest Articles</a></li>
                <li><a href="#" className="hover:text-orange-600">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">PROGRAMS</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-orange-600">Art & Design</a></li>
                <li><a href="#" className="hover:text-orange-600 text-orange-600">Business</a></li>
                <li><a href="#" className="hover:text-orange-600">IT & Software</a></li>
                <li><a href="#" className="hover:text-orange-600">Programming</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">CONTACT US</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Address: Tashkent, Uzbekistan</li>
                <li>Tel: + (998) 90 123-45-67</li>
                <li>Mail: support@moreudce.uz</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>Copyright © 2024 MoreEduce LMS | Powered by Learning Theory</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default TeacherLessons
