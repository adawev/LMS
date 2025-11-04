import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

function TeacherDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ lessons: 0, students: 0, courses: 0 })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const lessonsResponse = await axios.get('http://localhost:8080/api/lessons')
      setStats(prev => ({ ...prev, lessons: lessonsResponse.data.length }))
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gray-900 rounded mr-2"></div>
                <span className="text-xl font-bold text-gray-900">MoreEduce</span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <a href="#" className="text-gray-900 hover:text-orange-600 px-3 py-2 text-sm font-medium">Dashboard</a>
                <a href="#" onClick={() => navigate('/teacher-lessons')} className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium">My Lessons</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-700 hover:text-orange-600 px-4 py-2 text-sm font-medium"
              >
                Student View
              </button>
              <button
                onClick={() => navigate('/teacher-lessons')}
                className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 font-medium"
              >
                My Lessons
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Teacher!</h1>
          <p className="text-gray-600">Here's what's happening with your courses today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Lessons</p>
                <p className="text-3xl font-bold text-gray-900">{stats.lessons}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats.students}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{stats.courses}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/teacher-lessons')}
              className="p-6 border border-gray-200 rounded-lg hover:border-orange-600 hover:shadow-md transition-all text-left group"
            >
              <div className="bg-orange-100 p-3 rounded-lg inline-block mb-3 group-hover:bg-orange-600 transition-colors">
                <svg className="h-6 w-6 text-orange-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">My Lessons</h3>
              <p className="text-sm text-gray-600">View and manage lessons</p>
            </button>

            <button
              onClick={() => navigate('/teacher-lessons')}
              className="p-6 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition-all text-left group"
            >
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-3 group-hover:bg-blue-600 transition-colors">
                <svg className="h-6 w-6 text-blue-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Create Lesson</h3>
              <p className="text-sm text-gray-600">Upload video and materials</p>
            </button>

            <button
              onClick={() => navigate('/')}
              className="p-6 border border-gray-200 rounded-lg hover:border-green-600 hover:shadow-md transition-all text-left group"
            >
              <div className="bg-green-100 p-3 rounded-lg inline-block mb-3 group-hover:bg-green-600 transition-colors">
                <svg className="h-6 w-6 text-green-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Preview</h3>
              <p className="text-sm text-gray-600">View as student</p>
            </button>

            <button
              className="p-6 border border-gray-200 rounded-lg hover:border-purple-600 hover:shadow-md transition-all text-left group"
            >
              <div className="bg-purple-100 p-3 rounded-lg inline-block mb-3 group-hover:bg-purple-600 transition-colors">
                <svg className="h-6 w-6 text-purple-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
              <p className="text-sm text-gray-600">View reports</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard
