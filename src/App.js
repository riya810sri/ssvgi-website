import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MasterProtectedRoute from './components/MasterProtectedRoute';
import Header from './components/Header';
import MegaFooter from './components/MegaFooter';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import UserPanel from './pages/UserPanel';
import UserLayout from './components/UserLayout';
import UserProtectedRoute from './components/UserProtectedRoute';
import Enrollments from './pages/user/Enrollments';
import Payments from './pages/user/Payments';
import Profile from './pages/user/Profile';
import Support from './pages/user/Support';
import Exams from './pages/user/Exams';
import Candidates from './pages/user/Candidates';
import Questions from './pages/user/Questions';
import Statistics from './pages/user/Statistics';
import Notifications from './pages/user/Notifications';
import Settings from './pages/user/Settings';
import HelpSupport from './pages/user/HelpSupport';
import UserReceipts from './pages/user/Receipts';
import TrainingProgram from './pages/TrainingProgram';
import ApplyRegistration from './pages/ApplyRegistration';
import Faculty from './pages/Faculty';
import StudentsClub from './pages/StudentsClub';
import Alumni from './pages/Alumni';
import Testimonials from './pages/Testimonials';

// Admin pages
import AdminLogin from './pages/admin/Login';
import UserLogin from './pages/user/Login';
import UserSignUp from './pages/user/SignUp';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Admissions from './pages/admin/Admissions';
import Students from './pages/admin/Students';
import AlumniManagement from './pages/admin/Alumni';
import Contacts from './pages/admin/Contacts';
import CoursesManagement from './pages/admin/Courses';
import TestimonialsManagement from './pages/admin/Testimonials';
import AdminPayments from './pages/admin/Payments';
import Fees from './pages/admin/Fees';

// Master pages
import MasterLayout from './components/master/MasterLayout';
import MasterDashboard from './pages/master/MasterDashboard';
import MasterAdmissions from './pages/master/MasterAdmissions';
import MasterStudents from './pages/master/MasterStudents';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Header & Footer */}
          <Route path="/" element={
            <div className="min-h-screen bg-gray-100 font-sans">
              <Header />
              <main><Home /></main>
              <MegaFooter />
            </div>
          } />
          <Route path="/about" element={
            <div className="min-h-screen bg-gray-100 font-sans">
              <Header />
              <main><About /></main>
              <MegaFooter />
            </div>
          } />
          <Route path="/courses" element={
            <div className="min-h-screen bg-gray-100 font-sans">
              <Header />
              <main><Courses /></main>
              <MegaFooter />
            </div>
          } />
          <Route path="/user" element={
            <UserProtectedRoute>
              <UserLayout />
            </UserProtectedRoute>
          }>
            <Route index element={<UserPanel />} />
            <Route path="exams" element={<Exams />} />
            <Route path="enrollments" element={<Enrollments />} />
            <Route path="receipts" element={<UserReceipts />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="questions" element={<Questions />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="payments" element={<Payments />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="help" element={<HelpSupport />} />
            <Route path="support" element={<Support />} />
          </Route>
          <Route path="/training-program" element={
            <div className="min-h-screen bg-gray-100 font-sans">
              <Header />
              <main><TrainingProgram /></main>
              <MegaFooter />
            </div>
          } />

          <Route path="/faculty" element={
            <div className="min-h-screen bg-gray-100 font-sans">
              <Header />
              <main><Faculty /></main>
              <MegaFooter />
            </div>
          } />
          <Route path="/students-club" element={
            <div className="min-h-screen bg-gray-100 font-sans">
              <Header />
              <main><StudentsClub /></main>
              <MegaFooter />
            </div>
          } />
          <Route path="/alumni" element={
            <div className="min-h-screen bg-gray-100 font-sans">
              <Header />
              <main><Alumni /></main>
              <MegaFooter />
            </div>
          } />
          <Route path="/testimonials" element={
            <div className="min-h-screen bg-gray-100 font-sans">
              <Header />
              <main><Testimonials /></main>
              <MegaFooter />
            </div>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignUp />} />

          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="admissions" element={<Admissions />} />
            <Route path="students" element={<Students />} />
            <Route path="fees" element={<Fees />} />
            <Route path="alumni" element={<AlumniManagement />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="courses" element={<CoursesManagement />} />
            <Route path="testimonials" element={<TestimonialsManagement />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="faculty" element={<div className="text-2xl font-bold">Faculty Management - Coming Soon</div>} />
            <Route path="awards" element={<div className="text-2xl font-bold">Awards Management - Coming Soon</div>} />
          </Route>

          {/* Master Routes */}
          <Route path="/master" element={
            <MasterProtectedRoute>
              <MasterLayout />
            </MasterProtectedRoute>
          }>
            <Route path="dashboard" element={<MasterDashboard />} />
            <Route path="admissions" element={<MasterAdmissions />} />
            <Route path="students" element={<MasterStudents />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
