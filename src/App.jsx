import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TrainingProvider } from './context/TrainingContext';
import Navbar from './components/Navbar';
import InstallPWA from './components/InstallPWA';
import PrivateRoute from './components/PrivateRoute';
import DevModeNotice from './components/DevModeNotice';
// Componentes de autenticación
import Login from './components/Login';
import Signup from './components/Signup';
import ResetPassword from './components/ResetPassword';
// import AdminInfo from './components/AdminInfo';
import HomePage from './pages/HomePage';
import PlanPage from './pages/PlanPage';
import NewPlanPage from './pages/NewPlanPage';
import PlanConfigPage from './pages/PlanConfigPage';
import AdvancedWorkoutLogPage from './pages/AdvancedWorkoutLogPage';
import PlansManagementPage from './pages/PlansManagementPage';
import PlanDetailsPage from './pages/PlanDetailsPage';
import PlanEditPage from './pages/PlanEditPage';
import PlanStatsPage from './pages/PlanStatsPage';
import PlanComparisonPage from './pages/PlanComparisonPage';
import PlanTransitionPage from './pages/PlanTransitionPage';
import PlanImportExportPage from './pages/PlanImportExportPage';
import ProgressPage from './pages/ProgressPage';
import AdvancedProgressPage from './pages/AdvancedProgressPage';
import TemplatesPage from './pages/TemplatesPage';
import StandaloneExerciseLibrary from './pages/StandaloneExerciseLibrary';
import CreateRoutinePage from './pages/CreateRoutinePage';
import WorkoutLogPage from './pages/WorkoutLogPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WorkoutProvider>
          <TrainingProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white transition-colors duration-200">
                <Routes>
                {/* Rutas públicas de autenticación - Temporalmente con DevModeNotice */}
                <Route path="/login" element={
                  <>
                    <DevModeNotice />
                    <Login />
                  </>
                } />
                <Route path="/signup" element={
                  <>
                    <DevModeNotice />
                    <Signup />
                  </>
                } />
                <Route path="/reset-password" element={
                  <>
                    <DevModeNotice />
                    <ResetPassword />
                  </>
                } />

                {/* Rutas protegidas */}
                <Route path="/" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <HomePage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/gym_tracker" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <HomePage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/gym_tracker/" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <HomePage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/plan" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <PlanPage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/progress" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <ProgressPage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/exercise-library" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <StandaloneExerciseLibrary />
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/gym_tracker/exercise-library" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <StandaloneExerciseLibrary />
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/library" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <StandaloneExerciseLibrary />
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/gym_tracker/library" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <StandaloneExerciseLibrary />
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/create-routine" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <CreateRoutinePage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/workout-log" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <WorkoutLogPage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/workout/:id" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <WorkoutLogPage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/settings" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <SettingsPage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/plan/new" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <NewPlanPage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/plan/config" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <PlanConfigPage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/plans" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <PlansManagementPage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/plan/view/:planId" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <PlanDetailsPage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/plan/stats/:planId" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <PlanStatsPage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/plan/compare/:planId" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <PlanComparisonPage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/plan/edit/:planId" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <PlanEditPage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/plan/transition/:planId" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <PlanTransitionPage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/plans/import-export" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <PlanImportExportPage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/workout/advanced/:sessionId" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <AdvancedWorkoutLogPage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/progress/advanced" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <AdvancedProgressPage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                <Route path="/templates" element={
                  <PrivateRoute>
                    <div>
                      <Navbar />
                      <InstallPWA />
                      <DevModeNotice />
                      <div className="container mx-auto px-4 py-8">
                        <TemplatesPage />
                      </div>
                    </div>
                  </PrivateRoute>
                } />
                </Routes>
              </div>
            </Router>
          </TrainingProvider>
        </WorkoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
