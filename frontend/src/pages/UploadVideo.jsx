import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function UploadVideo() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoFile: null,
    pdfFile: null,
  })
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ video: 0, pdf: 0 })

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.videoFile) {
      alert('Iltimos, video faylni tanlang!')
      return
    }

    setUploading(true)

    try {
      // Upload video
      console.log('Video yuklanmoqda...')
      const videoResult = await uploadFile(formData.videoFile, 'video')
      console.log('Video yuklandi:', videoResult)

      // Upload PDF if exists
      let pdfResult = null
      if (formData.pdfFile) {
        console.log('PDF yuklanmoqda...')
        pdfResult = await uploadFile(formData.pdfFile, 'pdf')
        console.log('PDF yuklandi:', pdfResult)
      }

      alert('Fayllar muvaffaqiyatli yuklandi! Video Darslar sahifasiga o\'tasiz.')
      console.log('Video URL:', videoResult.filePath)
      if (pdfResult) {
        console.log('PDF URL:', pdfResult.filePath)
      }

      // Navigate to video list
      setTimeout(() => {
        navigate('/video-list')
      }, 1000)

      // Reset file inputs
      document.getElementById('videoFile').value = ''
      document.getElementById('pdfFile').value = ''

    } catch (error) {
      console.error('Xatolik:', error)
      alert('Yuklashda xatolik yuz berdi!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Video va PDF Yuklash</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Orqaga
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dars nomi
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masalan: 1-dars. Kirish"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tavsif
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dars haqida qisqacha ma'lumot..."
              />
            </div>

            {/* Video File */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video fayl *
              </label>
              <input
                type="file"
                id="videoFile"
                name="videoFile"
                accept="video/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {formData.videoFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Tanlangan: {formData.videoFile.name} ({(formData.videoFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              {uploading && uploadProgress.video > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Video yuklanmoqda...</span>
                    <span>{uploadProgress.video}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.video}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* PDF File */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF fayl (uyga vazifa)
              </label>
              <input
                type="file"
                id="pdfFile"
                name="pdfFile"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {formData.pdfFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Tanlangan: {formData.pdfFile.name} ({(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              {uploading && uploadProgress.pdf > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>PDF yuklanmoqda...</span>
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

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading}
                className={`flex-1 py-3 px-6 rounded-md text-white font-medium ${
                  uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {uploading ? 'Yuklanmoqda...' : 'Yuklash'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                disabled={uploading}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Bekor qilish
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium text-blue-900 mb-2">Ko'rsatma:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Video faylni yuklash majburiy</li>
              <li>• PDF fayl ixtiyoriy (uyga vazifa uchun)</li>
              <li>• Maksimal video hajmi: 500 MB</li>
              <li>• Video formatlar: MP4, AVI, MOV, va boshqalar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadVideo
