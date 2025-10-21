import { useEffect, useMemo, useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { useApiQuery } from './hooks/useApiQuery.js';
import {
  fetchAboutInfo,
  fetchDoctors,
  fetchHomeContent,
  fetchAppointments,
  createAppointment,
  sendChatbotMessage,
} from './api/client.js';
import NavigationBar from './components/NavigationBar.jsx';
import HeroSection from './components/HeroSection.jsx';
import ServicesSection from './components/ServicesSection.jsx';
import StatisticsStrip from './components/StatisticsStrip.jsx';
import DoctorsSection from './components/DoctorsSection.jsx';
import TestimonialsSection from './components/TestimonialsSection.jsx';
import AppointmentSection from './components/AppointmentSection.jsx';
import AppointmentModal from './components/AppointmentModal.jsx';
import UserAppointments from './components/UserAppointments.jsx';
import ContactSection from './components/ContactSection.jsx';
import ChatbotLauncher from './components/ChatbotLauncher.jsx';
import ChatbotPanel from './components/ChatbotPanel.jsx';
import LoginModal from './components/auth/LoginModal.jsx';
import RegisterModal from './components/auth/RegisterModal.jsx';

const FALLBACK_DOCTORS = [
  {
    id: 'doctor-henry',
    name: 'Dr. Robert Henry',
    specialty: 'Cardiologist',
    rating: 4.9,
    reviewCount: 102,
  },
  {
    id: 'doctor-littleton',
    name: 'Dr. Harry Littleton',
    specialty: 'Neurologist',
    rating: 4.8,
    reviewCount: 97,
  },
  {
    id: 'doctor-sharina',
    name: 'Dr. Sharina Khan',
    specialty: 'Gynecologist',
    rating: 4.7,
    reviewCount: 115,
  },
  {
    id: 'doctor-sanjeev',
    name: 'Dr. Sanjeev Kapoor',
    specialty: 'Child Specialist',
    rating: 4.9,
    reviewCount: 72,
  },
];

const FALLBACK_APPOINTMENTS = [
  {
    id: 'sample-appointment-1',
    doctorId: 'doctor-henry',
    doctorName: 'Dr. Robert Henry',
    slotStart: new Date(Date.now() + 24 * 3600000).toISOString(),
    slotEnd: new Date(Date.now() + 24 * 3600000 + 30 * 60000).toISOString(),
    status: 'confirmed',
  },
  {
    id: 'sample-appointment-2',
    doctorId: 'doctor-sharina',
    doctorName: 'Dr. Sharina Khan',
    slotStart: new Date(Date.now() + 72 * 3600000).toISOString(),
    slotEnd: new Date(Date.now() + 72 * 3600000 + 30 * 60000).toISOString(),
    status: 'pending',
  },
];

const buildFallbackSlots = (doctors) =>
  doctors.flatMap((doctor, index) => {
    const base = Date.now() + index * 3600000;
    return [
      {
        id: `${doctor.id}-slot-1`,
        doctorId: doctor.id,
        startTime: new Date(base + 4 * 3600000).toISOString(),
        endTime: new Date(base + 4 * 3600000 + 30 * 60000).toISOString(),
        available: true,
      },
      {
        id: `${doctor.id}-slot-2`,
        doctorId: doctor.id,
        startTime: new Date(base + 6 * 3600000).toISOString(),
        endTime: new Date(base + 6 * 3600000 + 30 * 60000).toISOString(),
        available: true,
      },
    ];
  });

export default function App() {
  const { user, initializing, login, register, logout, resetPassword, getIdToken } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! How can I help you today?',
      timestamp: Date.now(),
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    patientName: '',
    patientEmail: '',
    notes: '',
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState(null);

  const homeQuery = useApiQuery(() => fetchHomeContent(), []);
  const doctorsQuery = useApiQuery(() => fetchDoctors(), []);
  const aboutQuery = useApiQuery(() => fetchAboutInfo(), []);

  const doctorsData = useMemo(() => {
    if (Array.isArray(doctorsQuery.data) && doctorsQuery.data.length > 0) {
      return doctorsQuery.data;
    }
    return FALLBACK_DOCTORS;
  }, [doctorsQuery.data]);

  const heroContent = homeQuery.data?.hero ?? null;
  const services = homeQuery.data?.services ?? [];
  const statistics = homeQuery.data?.statistics ?? [];
  const testimonials = homeQuery.data?.testimonials ?? [];
  const appointmentSlots = useMemo(() => {
    if (Array.isArray(homeQuery.data?.appointmentSlots) && homeQuery.data.appointmentSlots.length > 0) {
      return homeQuery.data.appointmentSlots;
    }
    return buildFallbackSlots(doctorsData);
  }, [homeQuery.data?.appointmentSlots, doctorsData]);
  const appointmentSectionError =
    appointmentSlots.length === 0 && homeQuery.error ? homeQuery.error : null;

  const fetchAppointmentsForUser = async () => {
    if (!user) {
      setAppointments([]);
      setAppointmentsError(null);
      return;
    }

    setAppointmentsLoading(true);
    setAppointmentsError(null);
    try {
      const token = await getIdToken();
      const data = await fetchAppointments(token);
      setAppointments(Array.isArray(data) && data.length > 0 ? data : FALLBACK_APPOINTMENTS);
    } catch (error) {
      console.warn('Falling back to sample appointments:', error);
      setAppointments(FALLBACK_APPOINTMENTS);
      setAppointmentsError(null);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentsForUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const resetAlerts = () => {
    setAuthError('');
    setResetMessage('');
    setResetError('');
  };

  const handleLoginOpen = () => {
    resetAlerts();
    setAuthLoading(false);
    setLoginForm({ email: '', password: '' });
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleRegisterOpen = () => {
    resetAlerts();
    setAuthLoading(false);
    setRegisterForm({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleModalClose = () => {
    resetAlerts();
    setAuthLoading(false);
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const formatAuthError = (error) => {
    if (!error?.code) return error?.message ?? 'Something went wrong. Please try again.';
    switch (error.code) {
      case 'auth/invalid-login-credentials':
      case 'auth/wrong-password':
        return 'Incorrect email or password.';
      case 'auth/user-not-found':
        return 'No account found with that email.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/email-already-in-use':
        return 'An account already exists with that email.';
      case 'auth/missing-email':
        return 'Please enter your email address.';
      case 'auth/invalid-email':
        return 'That email address looks invalid.';
      default:
        return error.message ?? 'Authentication failed. Please try again.';
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      handleModalClose();
    } catch (error) {
      setAuthError(formatAuthError(error));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    setAuthError('');
    setAuthLoading(true);
    try {
      await register(registerForm.email, registerForm.password, registerForm.fullName);
      handleModalClose();
    } catch (error) {
      setAuthError(formatAuthError(error));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handlePasswordReset = async () => {
    if (!loginForm.email) {
      setResetError('Enter your account email above to receive a reset link.');
      setResetMessage('');
      return;
    }

    setResetError('');
    setResetMessage('');
    setResetLoading(true);
    try {
      await resetPassword(loginForm.email);
      setResetMessage('Password reset email sent. Check your inbox for instructions.');
    } catch (error) {
      setResetError(formatAuthError(error));
    } finally {
      setResetLoading(false);
    }
  };

  const handleHeroPrimary = () => {
    if (user) {
      document.getElementById('appointments')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleLoginOpen();
    }
  };

  const handleDoctorBook = (doctorId) => {
    if (!user) {
      handleLoginOpen();
      return;
    }

    const nextSlot = appointmentSlots?.find((slot) => slot.doctorId === doctorId);
    if (nextSlot) {
      handleSlotSelect(nextSlot);
    } else {
      document.getElementById('appointments')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEmergencyCall = () => {
    const phoneNumber = aboutQuery.data?.phone ?? '+8801999123456';
    window.location.href = `tel:${phoneNumber.replace(/\s+/g, '')}`;
  };

  const handleChatbotToggle = () => setShowChatbot((prev) => !prev);

  const handleChatbotSend = async (message) => {
    if (!message) return;
    const messageId = Date.now();
    const userMessage = {
      id: `user-${messageId}`,
      sender: 'user',
      text: message,
      timestamp: messageId,
    };

    setChatMessages((current) => [...current, userMessage]);
    setChatLoading(true);

    try {
      const response = await sendChatbotMessage({ message });
      if (response?.message) {
        setChatMessages((current) => [
          ...current,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: response.message,
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to send chatbot message', error);
      setChatMessages((current) => [
        ...current,
        {
          id: `bot-error-${Date.now()}`,
          sender: 'bot',
          text: 'Sorry, I could not reach the chatbot right now. Please try again later.',
          timestamp: Date.now(),
        },
      ]);
    }
    setChatLoading(false);
  };

  const handleSlotSelect = (slot) => {
    if (!user) {
      handleLoginOpen();
      return;
    }

    const doctor =
      (doctorsQuery.data ?? []).find((currentDoctor) => currentDoctor.id === slot.doctorId) ?? null;

    setSelectedSlot(slot);
    setSelectedDoctor(doctor);
    setBookingForm({
      patientName: user.displayName ?? '',
      patientEmail: user.email ?? '',
      notes: '',
    });
    setBookingError('');
    setBookingSuccess('');
    setShowBookingModal(true);
  };

  const handleBookingClose = () => {
    setShowBookingModal(false);
    setSelectedSlot(null);
    setSelectedDoctor(null);
    setBookingError('');
    setBookingSuccess('');
    setBookingLoading(false);
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    if (!selectedSlot) return;

    setBookingError('');
    setBookingSuccess('');
    setBookingLoading(true);

    try {
      const token = await getIdToken();
      const payload = {
        doctorId: selectedSlot.doctorId,
        slotId: selectedSlot.id,
        patientName: bookingForm.patientName,
        patientEmail: bookingForm.patientEmail,
        notes: bookingForm.notes,
      };

      const response = await createAppointment(payload, token);
      setBookingSuccess(response?.message ?? 'Appointment confirmed!');
      await fetchAppointmentsForUser();
      setTimeout(() => {
        handleBookingClose();
      }, 1200);
    } catch (error) {
      setBookingError(
        error instanceof Error ? error.message : 'Unable to book appointment. Please try again.',
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <NavigationBar
        user={user}
        initializing={initializing}
        onLogin={handleLoginOpen}
        onRegister={handleRegisterOpen}
        onLogout={handleLogout}
      />

      <main>
        <HeroSection
          content={heroContent}
          loading={homeQuery.loading}
          onPrimaryAction={handleHeroPrimary}
          onSecondaryAction={handleEmergencyCall}
        />

        <ServicesSection
          services={services}
          loading={homeQuery.loading}
          error={homeQuery.error}
        />

        <StatisticsStrip statistics={statistics} />

        <DoctorsSection
          doctors={doctorsData}
          loading={doctorsQuery.loading}
          error={doctorsQuery.error}
          onBook={handleDoctorBook}
        />

        <AppointmentSection
          doctors={doctorsData}
          slots={appointmentSlots ?? []}
          loading={homeQuery.loading || doctorsQuery.loading}
          error={appointmentSectionError}
          onSelectSlot={handleSlotSelect}
        />

        <UserAppointments
          appointments={appointments}
          loading={appointmentsLoading}
          error={appointmentsError}
        />

        <TestimonialsSection testimonials={testimonials} />

        <ContactSection info={aboutQuery.data} />
      </main>

      <footer className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} PawCare Veterinary Hospital. All rights reserved.</p>
        </div>
      </footer>

      <ChatbotLauncher isOpen={showChatbot} onToggle={handleChatbotToggle} />

      <ChatbotPanel
        visible={showChatbot}
        onClose={() => setShowChatbot(false)}
        messages={chatMessages}
        onSend={handleChatbotSend}
        sending={chatLoading}
      />

      <LoginModal
        open={showLoginModal}
        form={loginForm}
        onChange={(field, value) => setLoginForm((current) => ({ ...current, [field]: value }))}
        onSubmit={handleLoginSubmit}
        onClose={handleModalClose}
        onRegisterLink={handleRegisterOpen}
        onResetPassword={handlePasswordReset}
        loading={authLoading}
        resetLoading={resetLoading}
        error={authError}
        resetMessage={resetMessage}
        resetError={resetError}
      />

      <RegisterModal
        open={showRegisterModal}
        form={registerForm}
        onChange={(field, value) =>
          setRegisterForm((current) => ({
            ...current,
            [field]: value,
          }))
        }
        onSubmit={handleRegisterSubmit}
        onClose={handleModalClose}
        onLoginLink={handleLoginOpen}
        loading={authLoading}
        error={authError}
      />

      <AppointmentModal
        open={showBookingModal}
        slot={selectedSlot}
        doctor={selectedDoctor}
        form={bookingForm}
        onChange={(field, value) =>
          setBookingForm((current) => ({
            ...current,
            [field]: value,
          }))
        }
        onSubmit={handleBookingSubmit}
        onClose={handleBookingClose}
        loading={bookingLoading}
        errorMessage={bookingError}
        successMessage={bookingSuccess}
      />
    </div>
  );
}
