import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
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
      const response = await api.get('/lessons')
      setLessons(response.data)
    } catch (error) {
      console.error('Error loading lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Logo className="w-8 h-8 mr-2" />
                <span className="text-xl font-bold text-gray-900">MoreEduce</span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <a href="/" className="text-gray-900 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">Home</a>
                <a href="/courses" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">Courses</a>
                <a href="#teachers" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">Teachers</a>
                <a href="#students" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">Students</a>
                <a href="#learnpress" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">LearnPress Add-On</a>
                <a href="#premium" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">Premium Theme</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated && user ? (
                <>
                  {user.role === 'TEACHER' && (
                    <button
                      onClick={() => navigate('/teacher-lessons')}
                      className="text-gray-700 hover:text-orange-500 text-sm font-medium"
                    >
                      My Lessons
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/profile')}
                    className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 text-sm font-medium transition-colors"
                  >
                    My Profile
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-700 hover:text-orange-500 px-4 py-2 text-sm font-medium transition-colors"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-100 via-green-100 to-blue-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-blue-600">MoreEduce</span> Bilan<br />
                Rivojlanish Sari Birga<br />
                Qadam Tashlaymiz.
              </h1>
              <p className="text-gray-700 mb-8 text-lg">
                Ezi bilan birgalik qiling va soha
              </p>
              <button className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 font-medium shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-0.5">
                Free Courses
              </button>
            </div>
            <div className="hidden lg:flex justify-end items-center">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=600&fit=crop"
                  alt="Students learning together"
                  className="rounded-full w-96 h-96 object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-30 blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-green-200 rounded-full opacity-30 blur-2xl"></div>
      </div>

      {/* Our Courses Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Our Courses</h2>
          <button
            onClick={() => navigate('/courses')}
            className="text-orange-500 border border-orange-500 px-6 py-2 rounded-full hover:bg-orange-50 font-medium transition-colors"
          >
            All Courses
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No courses available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.slice(0, 6).map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/student-lesson/${lesson.id}`)}
              >
                {/* Course Image */}
                <div className="relative h-56 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center overflow-hidden">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-gray-900 text-white px-3 py-1 rounded text-xs font-semibold">
                      Photography
                    </span>
                  </div>
                  {/* Icon based on course type */}
                  <div className="text-white text-6xl font-bold opacity-80 group-hover:scale-110 transition-transform">
                    <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-6">
                  <div className="text-xs text-gray-500 mb-3">
                    by <span className="text-orange-500 font-medium">{lesson.moduleName}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {lesson.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="inline-flex items-center">
                      <svg className="h-4 w-4 mr-1 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                      </svg>
                      20Mln
                    </span>
                    <span className="inline-flex items-center">
                      <svg className="h-4 w-4 mr-1 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                      156 Students
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-green-600 font-bold text-lg">Free</span>
                    <button className="text-orange-500 hover:text-orange-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                      View More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LearnPress Add-Ons Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-10 shadow-lg">
            <div className="text-center mb-8">
              <p className="text-orange-500 text-sm font-semibold mb-2">GET MORE POWER FROM</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">LearnPress Add-Ons</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                The next level of LearnPress - LMS WordPress Plugin. More Powerful, Flexible and Magical Inside.
              </p>
            </div>

            {/* Add-ons Icons */}
            <div className="flex justify-center items-center gap-6 flex-wrap my-8">
              <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg transform hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg transform hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-cyan-400 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg transform hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg transform hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg transform hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-pink-500 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg transform hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-purple-400 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg transform hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg transform hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="text-center">
              <button className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 font-medium shadow-lg transition-all hover:shadow-xl">
                Explore Courses
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold text-orange-500 mb-2">10K+</p>
              <p className="text-gray-600 font-medium">Active Students</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-orange-500 mb-2">101</p>
              <p className="text-gray-600 font-medium">Helpful Courses</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-orange-500 mb-2">158</p>
              <p className="text-gray-600 font-medium">Instructors</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-orange-500 mb-2">100%</p>
              <p className="text-gray-600 font-medium">Satisfied Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* WordPress Theme Section */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-10 shadow-lg text-center">
            <p className="text-orange-500 text-sm font-semibold mb-2">PREMIUM LEARNING</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Education Wordpress Theme</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              The next level of LearnPress - LMS WordPress Plugin. Start creating and selling online courses.
            </p>
            <button className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 font-medium shadow-lg transition-all hover:shadow-xl">
              Explore Course
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div>
              <div className="flex items-center mb-4">
                <Logo className="w-8 h-8 mr-2" />
                <span className="text-xl font-bold text-gray-900">MoreEduce</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            {/* Get Help */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">GET HELP</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Latest Articles</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">PROGRAMS</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Art & Design</a></li>
                <li><a href="#" className="text-orange-500 font-medium">Business</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">IT & Software</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Languages</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Programming</a></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">CONTACT US</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Address: 2321 New Design St, Lorem Ipsum10 Hudson, York, USA</li>
                <li>Tel: + (123) 2500-567-8988</li>
                <li>Mail: support@eduflex.com</li>
              </ul>
              <div className="flex gap-3 mt-4">
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>Copyright © 2024 LearnPress LMS | Powered by ThimPress</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default StudentDashboard
