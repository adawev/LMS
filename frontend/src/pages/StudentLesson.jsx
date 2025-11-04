import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api, { BASE_URL } from '../services/api'
import toast from 'react-hot-toast'
import Logo from '../components/Logo'
import useAuthStore from '../store/useAuthStore'

function StudentLesson() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const { isAuthenticated, user } = useAuthStore()

  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Laura Hipster',
      date: 'October 03, 2022',
      text: 'Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus. At eget euismod cursus non. Molestie dignissim sed volutpat feugiat vel erat sit.',
      replies: []
    },
    {
      id: 2,
      author: 'Laura Hipster',
      date: 'October 03, 2022',
      text: 'Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus. At eget euismod cursus non. Molestie dignissim sed volutpat feugiat vel erat sit.',
      replies: [
        {
          id: 21,
          author: 'Laura Hipster',
          date: 'October 03, 2022',
          text: 'Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus. At eget euismod cursus non. Molestie dignissim sed volutpat feugiat vel erat sit.'
        }
      ]
    },
    {
      id: 3,
      author: 'Laura Hipster',
      date: 'October 03, 2022',
      text: 'Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus. At eget euismod cursus non. Molestie dignissim sed volutpat feugiat vel erat sit.',
      replies: []
    }
  ])

  useEffect(() => {
    loadLesson()
  }, [lessonId])

  const loadLesson = async () => {
    try {
      const response = await api.get(`/lessons/${lessonId}`)
      setLesson(response.data)
    } catch (error) {
      console.error('Error loading lesson:', error)
      toast.error('Failed to load lesson')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPdf = () => {
    if (lesson.pdfUrl) {
      const pdfFilename = lesson.pdfUrl.split('/')[1]
      const link = document.createElement('a')
      link.href = `${BASE_URL}/api/videos/pdf/${pdfFilename}`
      link.download = lesson.pdfFileName || pdfFilename
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('PDF download started!')
    }
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (comment.trim()) {
      setComments([...comments, {
        id: Date.now(),
        author: user?.firstName + ' ' + user?.lastName || 'Anonymous',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        text: comment,
        replies: []
      }])
      setComment('')
      toast.success('Comment posted!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-700">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900 text-xl mb-4">Lesson not found</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <Logo className="w-8 h-8 mr-2" />
                <span className="text-xl font-bold text-gray-900">MoreEduce</span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <a href="/" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">Home</a>
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

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <a href="/" className="hover:text-orange-500">Homepage</a>
            <svg className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <a href="#" className="hover:text-orange-500">Blog</a>
            <svg className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Academic Lessons (Will there ever be a React 1...</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Lesson Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{lesson.title}</h1>

            {/* Video Player */}
            <div className="bg-gray-900 rounded-xl overflow-hidden mb-6">
              <video
                ref={videoRef}
                className="w-full"
                controls
                onError={(e) => {
                  console.error('Video error:', e)
                  toast.error('Error loading video. Please try again.')
                }}
                controlsList="nodownload"
              >
                <source
                  src={`${BASE_URL}/api/videos/stream/${lesson.videoUrl.split('/')[1]}`}
                />
                Your browser does not support the video player.
              </video>
            </div>

            {/* Lesson Description */}
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <p className="text-gray-700 leading-relaxed mb-6">
                {lesson.description || `React Hooks or React.js or React is a new kind of JavaScript framework. It's been one of the most controversial frameworks out there. Because React is very old and (even named) React framework, its API and functionality very much mimic(read) those of that React. Use here Revel Application you create, that React code which adds user interfaces will be completely in React. Because of this comparison, most of the folks prefer to use.`}
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                Because React is not considered with the ever-evolving landscape of various technologies and components(like, for React's DOM, React (formerly known as React Remotely)), this package is available for several browsers that do not support it via various packages available to the community. We'll note here React hooks at the very little place of React, Facebook and some big frameworks like reactCore (which is new) that is useful to serve user interfaces (or components) within complex frontend applications.
              </p>

              <p className="text-gray-700 leading-relaxed">
                Because this simple to understand API offers significant value compared to various React approaches and modules, the React Hooks has generated growing excitement among React users due to the many promises it makes about React's development experience. That said, the React Core team did manage to fully integrate the process in their workflow when moving fully to React 3X, which we must recommend React to users who are on future React's API.
              </p>
            </div>

            {/* PDF Download */}
            {lesson.pdfUrl && (
              <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <svg className="h-10 w-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-gray-900 font-medium">Course Materials</h4>
                      <p className="text-sm text-gray-500">{lesson.pdfFileName}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadPdf}
                    className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 font-medium text-sm transition-colors"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            )}

            {/* Social Share */}
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Share this:</span>
                <div className="flex gap-3">
                  <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white hover:bg-sky-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments</h3>
              <p className="text-sm text-gray-600 mb-6">{comments.length} Comments</p>

              {/* Comment List */}
              <div className="space-y-6 mb-8">
                {comments.map((comment, index) => (
                  <div key={comment.id}>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-gray-900">{comment.author}</h4>
                          <span className="text-sm text-gray-500">{comment.date}</span>
                        </div>
                        <p className="text-gray-700 mb-3">{comment.text}</p>
                        <button className="text-sm text-orange-500 hover:text-orange-600 font-medium">Reply</button>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-12 mt-4 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-4">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-bold text-gray-900">{reply.author}</h4>
                                    <span className="text-sm text-gray-500">{reply.date}</span>
                                  </div>
                                  <p className="text-gray-700 mb-3">{reply.text}</p>
                                  <button className="text-sm text-orange-500 hover:text-orange-600 font-medium">Reply</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {index < comments.length - 1 && <div className="border-t border-gray-200 my-6"></div>}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 mb-8">
                <button className="w-10 h-10 rounded-full bg-gray-900 text-white font-medium flex items-center justify-center hover:bg-gray-800">
                  1
                </button>
                <button className="w-10 h-10 rounded-full bg-white text-gray-700 font-medium flex items-center justify-center hover:bg-gray-100">
                  2
                </button>
                <button className="w-10 h-10 rounded-full bg-white text-gray-700 font-medium flex items-center justify-center hover:bg-gray-100">
                  3
                </button>
                <button className="w-10 h-10 rounded-full bg-white text-gray-700 font-medium flex items-center justify-center hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Leave Comment Form */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Leave A Comment</h3>
                <p className="text-sm text-gray-600 mb-6">Your email address will not be published. Required fields are marked *</p>

                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Name"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <textarea
                    placeholder="Comment"
                    rows="6"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  ></textarea>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="save-info"
                      className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="save-info" className="text-sm text-gray-700">
                      Save my name, email in this bowser for the next time I comment
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 font-medium transition-colors"
                  >
                    Post Comments
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Course Category */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-4">Kurslar Kategoriyasi</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Metodology', count: 15 },
                    { name: 'Academic lessons', count: 15 },
                    { name: 'History', count: 15 },
                    { name: 'Studio', count: 15 },
                    { name: 'University', count: 15 },
                  ].map((category) => (
                    <label key={category.name} className="flex items-center justify-between cursor-pointer hover:text-orange-500 transition-colors">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Methodology lessons for Teachers',
                      image: 'https://via.placeholder.com/60x60'
                    },
                    {
                      title: 'Spelling Mistakes Search for Enterprise',
                      image: 'https://via.placeholder.com/60x60'
                    }
                  ].map((post, index) => (
                    <div key={index} className="flex gap-3 cursor-pointer hover:opacity-75 transition-opacity">
                      <img src={post.image} alt={post.title} className="w-16 h-16 rounded object-cover" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{post.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'UI/UX', 'C#5', 'C#', 'Java', 'Javascript'].map((tag) => (
                    <button
                      key={tag}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-orange-500 hover:text-white transition-colors"
                    >
                      {tag}
                    </button>
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

export default StudentLesson
