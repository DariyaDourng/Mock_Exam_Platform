"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"
import { API_URL } from "@/config"

// Navbar Component
const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("home")

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            Mock Exam Platform
          </Link>

          {/* Nav links */}
          <div className="hidden sm:flex gap-6 items-center">
            {["home", "about", "contact"].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`text-gray-500 px-3 py-2 border-b-2 transition-all ${
                  activeSection === section
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent hover:border-indigo-400"
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            ))}
            {/* Login Button */}
            <Link href="/login" className="text-indigo-600 px-4 py-2 border border-indigo-600 rounded-md">
              Login
            </Link>
            {/* Get Started Button */}
            <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Get started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Animated Quote Component
const AnimatedQuote: React.FC<{ quote: string; author: string; delay?: number }> = ({ quote, author, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const quoteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        } else {
          setIsVisible(false)
        }
      },
      { threshold: 0.3 },
    )

    if (quoteRef.current) {
      observer.observe(quoteRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={quoteRef}
      className={`transition-all duration-1000 ease-out ${isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
    >
      <div className="text-center p-8 bg-white/90 backdrop-blur rounded-2xl border border-gray-200 shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 italic">"{quote}"</h3>
        <p className="text-lg text-gray-600">— {author}</p>
      </div>
    </div>
  )
}

// Typewriter Animation Component with Auto-Reload
const TypewriterText: React.FC<{
  text: string
  delay?: number
  speed?: number
  autoReload?: boolean
  reloadDelay?: number
}> = ({ text, delay = 0, speed = 50, autoReload = false, reloadDelay = 2000 }) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    const startTimer = setTimeout(() => {
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayedText((prev) => prev + text[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        }, speed)
        return () => clearTimeout(timer)
      } else if (currentIndex === text.length && !isComplete) {
        setIsComplete(true)

        // Auto-reload functionality
        if (autoReload) {
          setTimeout(() => {
            setDisplayedText("")
            setCurrentIndex(0)
            setIsComplete(false)
            setCycle((prev) => prev + 1)
          }, reloadDelay)
        }
      }
    }, delay)

    return () => clearTimeout(startTimer)
  }, [currentIndex, text, delay, speed, isComplete, autoReload, reloadDelay, cycle])

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse text-white">|</span>}
    </span>
  )
}

// Updated Animated Title Component with Faster Animation and Auto-Reload
const AnimatedTitle = () => {
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    // Show subtitle after title completes first time (approximately 1.8 seconds)
    const subtitleTimer = setTimeout(() => setShowSubtitle(true), 1800)
    // Show button after subtitle appears
    const buttonTimer = setTimeout(() => setShowButton(true), 2600)

    return () => {
      clearTimeout(subtitleTimer)
      clearTimeout(buttonTimer)
    }
  }, [])

  return (
    <div className="text-center grid  items-center justify-items-center">
      <h1 className="text-5xl font-bold text-white mb-6 min-h-[40px] flex items-center justify-center">
        <TypewriterText
          text="Welcome to Mock Exam Platform"
          delay={0}
          speed={50} 
          autoReload={true}
          reloadDelay={3000}
        />
      </h1>

      <div
        className={`mt-4 text-xl text-indigo-100 transition-all duration-1000 ease-out ${
          showSubtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <TypewriterText
          text="Test your skills in Math, Logic, and English!"
          delay={showSubtitle ? 0 : 1000}
          speed={50}
        />
      </div>

      {/* <div
        className={`mt-8 transition-all duration-1000 ease-out ${
          showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <Link
          href="/register"
          className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
        >
          Start Your Journey
        </Link>
      </div> */}
    </div>
  )
}

// Hero Section
const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 py-20" id="home">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedTitle />
      </div>
    </div>
  )
}

// Test Cards Section
// Subjects Cards Section (fetching from backend)
const TestCards: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([])

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(API_URL+'/api/subjects')
      const data = response.data.data || []
      setSubjects(data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

return (
    <section className="py-4 bg-gray-50" id="tests">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12 text-gray-900">Available Courses For Exam</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-100 hover:border-indigo-300 flex flex-col justify-between"
            >
              <div className="flex flex-col items-center">
                <Image
                  src={subject.imageUrl || '/placeholder.svg'}
                  alt={subject.name}
                  width={200}
                  height={200}
                  className="mx-auto mb-2"
                />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">{subject.name}</h3>
                <p className="text-lg text-gray-600 mb-4 text-center">{subject.description}</p>
              </div>
              <div className="mt-auto pt-4 text-center">
                <Link
                  href={`/login`}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  View Exam
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


// Inspirational Quotes Section (After Test Cards)
const InspirationalQuotes = () => {
  const quotes = [
    {
      quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
    },
    {
      quote: "The expert in anything was once a beginner.",
      author: "Helen Hayes",
    },
    {
      quote: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Words of Inspiration</h2>
          <p className="text-lg text-gray-600">Fuel your motivation with these powerful quotes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quotes.map((item, index) => (
            <AnimatedQuote key={index} quote={item.quote} author={item.author} delay={index * 200} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Leaderboards Section
const Leaderboard = () => {
  const leaderboards = [
    {
      subject: "Math",
      data: [
        ["Alice", 98],
        ["Bob", 96],
        ["Charlie", 95],
      ],
    },
    {
      subject: "Logic",
      data: [
        ["Kate", 97],
        ["Leo", 96],
        ["Max", 95],
      ],
    },
    {
      subject: "English",
      data: [
        ["Uma", 99],
        ["Victor", 97],
        ["Wendy", 96],
      ],
    },
  ]

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-600 font-semibold" // Gold
      case 1:
        return "text-gray-500 font-medium" // Silver
      case 2:
        return "text-amber-600 font-medium" // Bronze
      default:
        return "text-gray-700"
    }
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return "🥇"
      case 1:
        return "🥈"
      case 2:
        return "🥉"
      default:
        return `${index + 1}.`
    }
  }

  return (
    <section className="py-20 bg-gray-100" id="leaderboard">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Leaderboard</h2>
          <p className="text-lg text-gray-600">See how you rank against other test takers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leaderboards.map((board, boardIndex) => (
            <div key={boardIndex} className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{board.subject}</h3>
                <div className="w-12 h-1 bg-indigo-600 mx-auto rounded-full"></div>
              </div>

              <div className="space-y-3">
                {board.data.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      idx === 0
                        ? "bg-yellow-50 border border-yellow-200"
                        : idx === 1
                          ? "bg-gray-100 border border-gray-200"
                          : idx === 2
                            ? "bg-amber-50 border border-amber-200"
                            : "bg-white border border-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getRankIcon(idx)}</span>
                      <span className={`font-medium ${getRankStyle(idx)}`}>{entry[0]}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-semibold ${getRankStyle(idx)}`}>{entry[1]}</span>
                      <span className="text-sm text-gray-500">pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Quote Section (Original - now with animation)
const QuoteSection = () => {
  return (
    <div className="bg-indigo-600 py-16 text-center" id="quote">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-8">
          <AnimatedQuote quote="Mock exams don't just test you — they train you." author="Be Inspired to Succeed" />
        </div>
      </div>
    </div>
  )
}

// About Us Section
const About = () => {
  return (
    <section id="about" className="py-20 px-6 bg-white text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-gray-900">About Us</h2>
        <div className="bg-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200">
          <p className="text-lg text-gray-700 leading-relaxed">
            The Mock Exam Platform is designed to help students and professionals prepare for competitive exams by
            offering realistic, subject-specific practice tests in Math, Logic, and English.
          </p>
          <p className="text-lg text-gray-700 mt-4 leading-relaxed">
            Our mission is to provide a free and accessible space for learners to test their knowledge, build
            confidence, and track their progress through leaderboards and performance analytics. Whether you're
            preparing for university entrance exams, job assessments, or just want to sharpen your skills, our platform
            offers timed, scored, and challenging mock exams that simulate real test environments.
          </p>
        </div>
      </div>
    </section>
  )
}

// Bottom Inspirational Quotes Section
const BottomQuotes = () => {
  const bottomQuotes = [
    {
      quote:"Mock exams don't just test you — they train you.",
      author: "Exam Pro Tips"
    },
    {
      quote: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
    },
    {
      quote: "Your limitation—it's only your imagination.",
      author: "Unknown",
    },
    {
      quote: "Great things never come from comfort zones.",
      author: "Anonymous",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Keep Going, Keep Growing</h2>
          <p className="text-lg text-gray-600">Remember these words as you continue your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bottomQuotes.map((item, index) => (
            <div key={index} className="h-full">
              <AnimatedQuote quote={item.quote} author={item.author} delay={index * 150} />
            </div>
          ))}
        </div>

        {/* Final Motivational Message */}
        <div className="mt-16 text-center">
          <AnimatedQuote
            quote="Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown."
            author="Robin Sharma"
            delay={600}
          />
        </div>
      </div>
    </section>
  )
}

// Footer Section
const Footer = () => {
  return (
    <footer className="bg-gray-900 py-12">
      <div className="text-center">
        <p className="text-gray-300 text-sm">© Mock Exam Platform, Inc. 2025. We love our users!</p>
      </div>
      <div className="mt-6 flex justify-center space-x-6">
        <a href="#" className="text-gray-400 hover:text-white transition-colors">
          Facebook
        </a>
        <a href="#" className="text-gray-400 hover:text-white transition-colors">
          Twitter
        </a>
        <a href="#" className="text-gray-400 hover:text-white transition-colors">
          Instagram
        </a>
      </div>
    </footer>
  )
}

// Main Page combining everything
export default function HomePage() {
  return (
    <div className="scroll-smooth">
      <Navbar />
      <main>
        <HeroSection />
        <TestCards />
        <QuoteSection />
        <InspirationalQuotes />
        <Leaderboard />
        <About />
        <BottomQuotes />
      </main>
      <Footer />
    </div>
  )
}
