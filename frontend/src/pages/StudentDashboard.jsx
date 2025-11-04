import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Logo from '../components/Logo'
import useAuthStore from '../store/useAuthStore'

function StudentDashboard() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLessons()
  }, [])

  const loadLessons = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/lessons')
      setLessons(response.data)
    } catch (error) {
      console.error('Error loading lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Logo className="w-10 h-10 mr-3" />
                <div>
                  <span className="text-xl font-bold text-gray-900 block leading-none">MoreEduce</span>
                  <span className="text-xs text-orange-600 font-medium">Learning Platform</span>
                </div>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <a href="#" className="text-gray-900 hover:text-orange-600 px-3 py-2 text-sm font-medium">Home</a>
                <a href="#" className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium">Courses</a>
                <a href="#" className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium">Teachers</a>
                <a href="#" className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium">Students</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated && user ? (
                <>
                  {user.role === 'TEACHER' && (
                    <button
                      onClick={() => navigate('/teacher-lessons')}
                      className="text-gray-700 hover:text-orange-600 text-sm font-medium"
                    >
                      My Lessons
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/profile')}
                    className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm font-medium"
                  >
                    My Profile
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white border border-orange-600 text-orange-600 px-4 py-2 rounded hover:bg-orange-50 text-sm font-medium"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                <span className="text-blue-600">MoreEduce</span> Bilan<br />
                Rivojlanish Sari Birga<br />
                Qadam Tashlaymiz.
              </h1>
              <p className="text-gray-600 mb-6">
                Ezi bilan birgalik qiling va soha
              </p>
              <button className="bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 font-medium shadow-lg">
                Free Course
              </button>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 rounded-full blur-3xl opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Courses Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Our Courses</h2>
          <button className="text-orange-600 border border-orange-600 px-6 py-2 rounded hover:bg-orange-50 font-medium">
            All Courses
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No courses available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/student-lesson/${lesson.id}`)}
              >
                {/* Course Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <div className="absolute top-3 left-3">
                    <span className="bg-orange-600 text-white px-3 py-1 rounded text-xs font-medium">
                      {lesson.courseName}
                    </span>
                  </div>
                  <svg className="h-20 w-20 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                {/* Course Details */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span className="inline-flex items-center">
                      <svg className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {lesson.moduleName}
                    </span>
                    {lesson.pdfUrl && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center text-green-600">
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                          PDF Materials
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {lesson.title}
                  </h3>

                  {lesson.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {lesson.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">
                        Module {lesson.moduleOrder}
                      </span>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                      View More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-orange-600 mb-2">{lessons.length}+</p>
              <p className="text-gray-600 font-medium">Active Lessons</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-orange-600 mb-2">101</p>
              <p className="text-gray-600 font-medium">Helpful Course</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-orange-600 mb-2">158</p>
              <p className="text-gray-600 font-medium">Instructor</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-orange-600 mb-2">100%</p>
              <p className="text-gray-600 font-medium">Satisfied Student</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div>
              <div className="flex items-center mb-4">
                <Logo className="w-10 h-10 mr-3" />
                <div>
                  <span className="text-xl font-bold text-gray-900 block leading-none">MoreEduce</span>
                  <span className="text-xs text-orange-600">Learning Platform</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            {/* Get Help */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">GET HELP</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-orange-600">Contact Us</a></li>
                <li><a href="#" className="hover:text-orange-600">Latest Articles</a></li>
                <li><a href="#" className="hover:text-orange-600">FAQ</a></li>
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">PROGRAMS</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-orange-600">Art & Design</a></li>
                <li><a href="#" className="hover:text-orange-600 text-orange-600">Business</a></li>
                <li><a href="#" className="hover:text-orange-600">IT & Software</a></li>
                <li><a href="#" className="hover:text-orange-600">Languages</a></li>
                <li><a href="#" className="hover:text-orange-600">Programming</a></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">CONTACT US</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Address: 2321 New Design St, Lorem Ipsum10</li>
                <li>Hudson, NY USA</li>
                <li>Tel: + (123) 2500-567-8988</li>
                <li>Mail: support@moreudce.com</li>
              </ul>
              <div className="flex gap-3 mt-4">
                <a href="#" className="text-gray-400 hover:text-orange-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>Copyright © 2024 LearnPress LMS | Powered by ThimPress</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default StudentDashboard
