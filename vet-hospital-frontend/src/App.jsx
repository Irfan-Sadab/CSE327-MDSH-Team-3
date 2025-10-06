import { useState } from 'react';
import { Heart, Calendar, Clock, Phone, Mail, MapPin, Stethoscope, Shield, Award, MessageCircle } from 'lucide-react';

/**
 * VetHospitalLanding Component
 * 
 * Main landing page for the veterinary hospital website.
 * Features: Navigation, Hero section, Services, Contact info, and interactive modals
 * 
 * @returns {JSX.Element} The complete landing page
 */
export default function App() {
  // State management for modals and chatbot visibility
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* 
        Navigation Bar
        - Fixed position for always-visible navigation
        - Contains logo and authentication buttons
        - Semi-transparent with backdrop blur for modern look
      */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-2">
              <Heart className="text-blue-600 w-8 h-8" />
              <span className="text-2xl font-bold text-gray-800">PawCare Veterinary</span>
            </div>
            
            {/* Authentication Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 
        Hero Section
        - Main headline and value proposition
        - Primary call-to-action buttons
        - Centered layout with large typography
      */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Compassionate Care for Your
              <span className="text-blue-600"> Beloved Pets</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Providing exceptional veterinary services with state-of-the-art facilities and a team of experienced professionals who treat your pets like family.
            </p>
            
            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Book Appointment</span>
              </button>
              <button className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Emergency Call</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 
        Features Section
        - Highlights key advantages of the hospital
        - Three column grid layout
        - Icon + title + description format
      */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose PawCare?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1: Expert Veterinarians */}
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Stethoscope className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert Veterinarians</h3>
              <p className="text-gray-600">
                Our team of certified veterinarians has over 50 years of combined experience in animal care and treatment.
              </p>
            </div>

            {/* Feature Card 2: 24/7 Emergency Care */}
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">24/7 Emergency Care</h3>
              <p className="text-gray-600">
                We're always here when you need us most. Our emergency services are available around the clock.
              </p>
            </div>

            {/* Feature Card 3: Advanced Technology */}
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Advanced Technology</h3>
              <p className="text-gray-600">
                State-of-the-art diagnostic equipment ensures accurate diagnosis and effective treatment for your pets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        Services Section
        - Grid display of all available services
        - Responsive layout (1/2/4 columns based on screen size)
        - Each service has an icon and title
      */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Our Services
          </h2>
          
          {/* Services Grid - maps through array of service names */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['General Checkups', 'Vaccinations', 'Surgery', 'Dental Care', 'Grooming', 'Pet Boarding', 'Laboratory Tests', 'Nutrition Counseling'].map((service, idx) => (
              <div key={idx} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-600">
                <Award className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        Contact Section
        - Displays contact information
        - Three column layout with icons
        - Blue gradient background for emphasis
      */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Get In Touch</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Phone Contact */}
            <div className="flex flex-col items-center">
              <Phone className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p>+1 (555) 123-4567</p>
            </div>
            
            {/* Email Contact */}
            <div className="flex flex-col items-center">
              <Mail className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p>care@pawcare.vet</p>
            </div>
            
            {/* Physical Location */}
            <div className="flex flex-col items-center">
              <MapPin className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p>123 Pet Street, Animal City</p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        Footer
        - Copyright information
        - Dark background for visual separation
      */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2025 PawCare Veterinary Hospital. All rights reserved.</p>
        </div>
      </footer>

      {/* 
        Floating Chatbot Button
        - Fixed position in bottom-right corner
        - Toggles chatbot modal visibility
        - Always visible for easy access
      */}
      <button
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-110 flex items-center justify-center z-50"
      >
        <MessageCircle className="w-8 h-8" />
      </button>

      {/* 
        Login Modal
        - Conditional rendering based on showLoginModal state
        - Overlay background with centered modal
        - Email and password input fields
      */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome Back</h2>
            
            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-600"
            />
            
            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:border-blue-600"
            />
            
            {/* Submit Button */}
            <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-4">
              Login
            </button>
            
            {/* Cancel Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 
        Register Modal
        - Conditional rendering based on showRegisterModal state
        - Similar layout to login modal
        - Additional field for full name
      */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Create Account</h2>
            
            {/* Full Name Input */}
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-600"
            />
            
            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-600"
            />
            
            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:border-blue-600"
            />
            
            {/* Submit Button */}
            <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-4">
              Register
            </button>
            
            {/* Cancel Button */}
            <button
              onClick={() => setShowRegisterModal(false)}
              className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 
        Chatbot Modal
        - Conditional rendering based on showChatbot state
        - Fixed position in bottom-right, above chatbot button
        - Contains header, message area, and input field
      */}
      {showChatbot && (
        <div className="fixed bottom-28 right-8 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col">
          {/* Chatbot Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-bold text-lg">PawCare Assistant</h3>
            <button
              onClick={() => setShowChatbot(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          
          {/* Chat Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <p className="text-gray-800">Hello! How can I help you today?</p>
            </div>
          </div>
          
          {/* Message Input Area */}
          <div className="p-4 border-t">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}