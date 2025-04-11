import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
import Navbar from './components/Navbar';
import InstallPWA from './components/InstallPWA';
import HomePage from './pages/HomePage';
import PlanPage from './pages/PlanPage';
import ProgressPage from './pages/ProgressPage';
import ExerciseLibraryPage from './pages/ExerciseLibraryPage';
import CreateRoutinePage from './pages/CreateRoutinePage';

function App() {
  return (
    <WorkoutProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <InstallPWA />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/plan" element={<PlanPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/exercise-library" element={<ExerciseLibraryPage />} />
              <Route path="/create-routine" element={<CreateRoutinePage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </WorkoutProvider>
  );
}

export default App;
