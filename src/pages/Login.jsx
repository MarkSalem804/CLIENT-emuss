/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import depedLogo from "../assets/deped_logo.png";
import depedImage from "../assets/Logo-DepEd-1.png";
import bagongPilipinasLogo from "../assets/Bagong-Pilipinas-Logo.png";
import doctorConsultation from "../assets/doctor-consultation.png";
import doctorVisit from "../assets/doctor-visit.png";
import medicalReport from "../assets/medical-report.png";
import sampleImage1 from "../assets/LSRFM.jpg";
import sampleImage2 from "../assets/LSRFM2.jpg";

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slideshow data
  const slides = [
    {
      id: 1,
      image: doctorConsultation,
      title: "Medical Consultations",
      description:
        "Schedule and manage comprehensive medical consultations with healthcare professionals",
      color: "from-emerald-500 to-teal-600",
    },
    {
      id: 2,
      image: doctorVisit,
      title: "Doctor Visits",
      description:
        "Streamline doctor visits and patient appointments with our integrated scheduling system",
      color: "from-teal-500 to-cyan-600",
    },
    {
      id: 3,
      image: medicalReport,
      title: "Medical Records",
      description:
        "Maintain secure and organized electronic medical records for all patients and staff",
      color: "from-cyan-500 to-emerald-600",
    },
    {
      id: 4,
      image: sampleImage1,
      title: "Sample Image 1",
      description:
        "Maintain secure and organized electronic medical records for all patients and staff",
      color: "from-cyan-500 to-emerald-600",
    },
    {
      id: 5,
      image: sampleImage2,
      title: "Sample Image 2",
      description:
        "Maintain secure and organized electronic medical records for all patients and staff",
      color: "from-cyan-500 to-emerald-600",
    },
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-emerald-400 to-emerald-600 rounded-full -mr-48 -mt-48 opacity-15"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-gradient-to-tr from-teal-400 to-teal-600 rounded-full -ml-48 -mb-48 opacity-15"></div>
        <div className="absolute right-1/3 bottom-1/3 w-64 h-64 bg-gradient-to-tl from-cyan-300 to-emerald-400 rounded-full opacity-12"></div>
        <div className="absolute left-1/4 top-1/4 w-80 h-80 bg-gradient-to-br from-emerald-300 to-teal-500 rounded-full opacity-10"></div>
      </div>

      {/* Navigation Links - Top Left */}
      <div className="absolute top-6 left-6 flex space-x-6 z-10">
        <a
          href="/about-us"
          className="text-gray-700 font-medium hover:text-emerald-600 transition-colors"
        >
          About Us
        </a>
        <a
          href="https://wp.depedimuscity.com/?page_id=70"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 font-medium hover:text-emerald-600 transition-colors"
        >
          Citizen's Charter
        </a>
        <a
          href="https://csm.depedimuscity.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 font-medium hover:text-emerald-600 transition-colors"
        >
          Feedback
        </a>
      </div>

      {/* Logos - Bottom Right */}
      <div className="absolute bottom-6 right-6 flex items-center space-x-4 z-10">
        <img
          src={depedImage}
          alt="DepEd"
          className="h-12 w-auto object-contain"
        />
        <img
          src={bagongPilipinasLogo}
          alt="Bagong Pilipinas"
          className="h-16 w-auto object-contain"
        />
        <img
          src={depedLogo}
          alt="DepEd Logo"
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Left Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mb-6">
              <img
                src={depedLogo}
                alt="DepEd Logo"
                className="h-16 w-16 object-contain rounded-full"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">EMUSS</h2>
            <p className="text-gray-700 mb-1">
              ELECTRONIC MEDICAL RECORDS AND UNIFIED SCHEDULING SYSTEM
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      error
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      error
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign in
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Demo Credentials */}
          <div className="bg-emerald-50 rounded-lg p-4 text-center border border-emerald-200">
            <p className="text-sm text-emerald-800 font-medium mb-2">
              Demo Credentials:
            </p>
            <p className="text-xs text-emerald-600">
              Email: <span className="font-mono">dr.smith@emuss.com</span>
            </p>
            <p className="text-xs text-emerald-600">
              Password: <span className="font-mono">any password</span>
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium">
              © SDO - Imus City 2025
            </p>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-bold text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                Contact administrator
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Slideshow */}
      <div className="w-1/2 relative overflow-hidden">
        {/* Latest News Title */}
        <div className="absolute top-8 left-8 z-20">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">
            Latest News
          </h2>
        </div>

        <div className="h-full flex items-center justify-center">
          {/* Slideshow Container */}
          <div className="relative w-full h-full bg-gradient-to-br from-emerald-50 to-teal-50">
            {/* Current Slide */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-full h-full bg-gradient-to-br ${slides[currentSlide].color} flex flex-col items-center justify-center p-12 text-white relative overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-full"></div>
                  <div className="absolute top-1/2 right-10 w-16 h-16 border-2 border-white rounded-full"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center w-full px-12">
                  <div className="mb-4">
                    <div className="w-[48rem] h-[32rem] mx-auto flex items-center justify-center bg-white/10 rounded-2xl backdrop-blur-sm">
                      <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        className="object-contain rounded-xl drop-shadow-2xl"
                        style={{ width: "46rem", height: "30rem" }}
                      />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">
                    {slides[currentSlide].title}
                  </h3>
                  <p className="text-lg opacity-90 leading-relaxed">
                    {slides[currentSlide].description}
                  </p>
                </div>

                {/* Navigation Dots */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-white scale-125"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() =>
                    setCurrentSlide(
                      (prev) => (prev - 1 + slides.length) % slides.length
                    )
                  }
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    setCurrentSlide((prev) => (prev + 1) % slides.length)
                  }
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
