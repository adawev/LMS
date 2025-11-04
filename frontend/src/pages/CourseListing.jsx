import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Logo from '../components/Logo'
import useAuthStore from '../store/useAuthStore'

function CourseListing() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [lessons, setLessons] = useState([])
  const [filteredLessons, setFilteredLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const lessonsPerPage = 6

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedInstructors, setSelectedInstructors] = useState([])
  const [selectedPrices, setSelectedPrices] = useState([])
  const [selectedLevels, setSelectedLevels] = useState([])

  useEffect(() => {
    loadLessons()
  }, [])

  useEffect(() => {
    filterLessons()
  }, [lessons, searchTerm, selectedCategories, selectedInstructors, selectedPrices, selectedLevels])

  const loadLessons = async () => {
    try {
      const response = await api.get('/lessons')
      setLessons(response.data)
      setFilteredLessons(response.data)
    } catch (error) {
      console.error('Error loading lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterLessons = () => {
    let filtered = [...lessons]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Add more filters here as needed
    setFilteredLessons(filtered)
    setCurrentPage(1)
  }

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  // Pagination
  const indexOfLastLesson = currentPage * lessonsPerPage
  const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage
  const currentLessons = filteredLessons.slice(indexOfFirstLesson, indexOfLastLesson)
  const totalPages = Math.ceil(filteredLessons.length / lessonsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <Logo className="w-8 h-8 mr-2" />
                <span className="text-xl font-bold text-gray-900">MoreEduce</span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <a href="/" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">Home</a>
                <a href="/courses" className="text-orange-500 px-3 py-2 text-sm font-medium border-b-2 border-orange-500">Courses</a>
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

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <a href="/" className="hover:text-orange-500">Homepage</a>
            <svg className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Course</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Academic Lessons</h1>

              {/* Search and View Options */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : currentLessons.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No courses found</p>
              </div>
            ) : (
              <>
                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {currentLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
                      onClick={() => navigate(`/student-lesson/${lesson.id}`)}
                    >
                      {/* Course Image */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center overflow-hidden">
                        <div className="absolute top-3 left-3 z-10">
                          <span className="bg-gray-900 text-white px-3 py-1 rounded text-xs font-semibold">
                            Photography
                          </span>
                        </div>
                        <div className="text-white text-6xl font-bold opacity-80 group-hover:scale-110 transition-transform">
                          <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>

                      {/* Course Details */}
                      <div className="p-5">
                        <div className="text-xs text-gray-500 mb-2">
                          by <span className="text-orange-500 font-medium">Pamelah Panambakings</span>
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`w-10 h-10 rounded-full font-medium ${
                          currentPage === index + 1
                            ? 'bg-gray-900 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              {/* Course Category */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Course Category</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Spelling mistakes', count: 15 },
                    { name: 'Methodology lessons', count: 15 },
                    { name: 'Academic lessons', count: 15 },
                    { name: 'Educate', count: 15 },
                    { name: 'Single family home', count: 15 },
                    { name: 'Studio', count: 15 },
                    { name: 'University', count: 15 },
                  ].map((category) => (
                    <label key={category.name} className="flex items-center justify-between cursor-pointer hover:text-orange-500 transition-colors">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.name)}
                          onChange={() => toggleCategory(category.name)}
                          className="mr-3 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Instructors */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Instructors</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Kenny White', count: 15 },
                    { name: 'John Doe', count: 15 },
                  ].map((instructor) => (
                    <label key={instructor.name} className="flex items-center justify-between cursor-pointer hover:text-orange-500 transition-colors">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm">{instructor.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{instructor.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Price</h3>
                <div className="space-y-3">
                  {[
                    { name: 'All', count: 15 },
                    { name: 'Free', count: 15 },
                    { name: 'Paid', count: 15 },
                  ].map((price) => (
                    <label key={price.name} className="flex items-center justify-between cursor-pointer hover:text-orange-500 transition-colors">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm">{price.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{price.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Review */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Review</h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center justify-between cursor-pointer hover:text-orange-500 transition-colors">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">(1,025)</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Level</h3>
                <div className="space-y-3">
                  {[
                    { name: 'All levels', count: 15 },
                    { name: 'Beginner', count: 15 },
                    { name: 'Intermediate', count: 15 },
                    { name: 'Expert', count: 15 },
                  ].map((level) => (
                    <label key={level.name} className="flex items-center justify-between cursor-pointer hover:text-orange-500 transition-colors">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm">{level.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{level.count}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Logo className="w-8 h-8 mr-2" />
                <span className="text-xl font-bold text-gray-900">MoreEduce</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">GET HELP</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Latest Articles</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">FAQ</a></li>
              </ul>
            </div>

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

export default CourseListing
