import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaDumbbell, FaCalendarAlt, FaClock, FaWeight, FaRunning, FaChartLine, FaUserCog } from 'react-icons/fa';
import { useTraining } from '../context/TrainingContext';
import AdvancedConfigSection from '../components/AdvancedConfigSection';
import PeriodizationConfig from '../components/PeriodizationConfig';
import SplitConfig from '../components/SplitConfig';
import EquipmentConfig from '../components/EquipmentConfig';
import GoalConfig from '../components/GoalConfig';

/**
 * Página para editar un plan de entrenamiento existente
 */
const PlanEditPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { trainingPlans, setTrainingPlans, updateUserPreferences } = useTraining();
  
  // Estados para la configuración del plan
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('hypertrophy');
  const [secondaryGoals, setSecondaryGoals] = useState([]);
  const [planDuration, setPlanDuration] = useState(12);
  const [periodizationType, setPeriodizationType] = useState('linear');
  const [weeklyFrequency, setWeeklyFrequency] = useState(3);
  const [splitConfiguration, setSplitConfiguration] = useState('fullbody');
  const [trainingDays, setTrainingDays] = useState([1, 3, 5]); // Lunes, Miércoles, Viernes
  const [sessionDuration, setSessionDuration] = useState(60);
  const [availableEquipment, setAvailableEquipment] = useState(['all']);
  
  // Cargar los datos del plan
  useEffect(() => {
    if (trainingPlans && planId) {
      const plan = trainingPlans.find(p => p.id === planId);
      if (plan) {
        // Cargar los datos del plan en los estados
        setPlanName(plan.name || '');
        setPlanDescription(plan.description || '');
        setPrimaryGoal(plan.primaryGoal || 'hypertrophy');
        setSecondaryGoals(plan.secondaryGoals || []);
        setPlanDuration(plan.planDuration || 12);
        setPeriodizationType(plan.periodizationType || 'linear');
        
        // Obtener datos del primer microciclo si existe
        if (plan.microcycles && plan.microcycles.length > 0) {
          const firstMicrocycle = plan.microcycles[0];
          setWeeklyFrequency(firstMicrocycle.weeklyFrequency || 3);
          setSplitConfiguration(firstMicrocycle.splitConfiguration || 'fullbody');
          setTrainingDays(firstMicrocycle.trainingDays || [1, 3, 5]);
          
          // Obtener datos de la primera sesión si existe
          if (firstMicrocycle.trainingSessions && firstMicrocycle.trainingSessions.length > 0) {
            const firstSession = firstMicrocycle.trainingSessions[0];
            setSessionDuration(firstSession.sessionDuration || 60);
            setAvailableEquipment(firstSession.availableEquipment || ['all']);
          }
        }
      } else {
        // Si no se encuentra el plan, redirigir a la página de planes
        navigate('/plans');
      }
    }
  }, [trainingPlans, planId, navigate]);
  
  // Actualizar el plan
  const handleUpdatePlan = () => {
    // Actualizar las preferencias del usuario
    updateUserPreferences('training', 'preferredTrainingDays', trainingDays);
    updateUserPreferences('training', 'splitPreference', splitConfiguration);
    updateUserPreferences('training', 'sessionDurationPreference', sessionDuration);
    updateUserPreferences('equipment', 'equipmentAvailable', availableEquipment);
    
    // Actualizar el plan en la lista de planes
    setTrainingPlans(prevPlans => {
      return prevPlans.map(plan => {
        if (plan.id === planId) {
          // Actualizar los datos básicos del plan
          const updatedPlan = {
            ...plan,
            name: planName,
            description: planDescription,
            primaryGoal,
            secondaryGoals,
            planDuration,
            periodizationType,
            updatedAt: new Date()
          };
          
          // Actualizar los microciclos si existen
          if (updatedPlan.microcycles && updatedPlan.microcycles.length > 0) {
            updatedPlan.microcycles = updatedPlan.microcycles.map(microcycle => {
              // Actualizar la configuración de cada microciclo
              return {
                ...microcycle,
                weeklyFrequency,
                splitConfiguration,
                trainingDays,
                trainingSessions: microcycle.trainingSessions.map(session => {
                  // Actualizar la configuración de cada sesión
                  return {
                    ...session,
                    sessionDuration,
                    availableEquipment
                  };
                })
              };
            });
          }
          
          return updatedPlan;
        }
        return plan;
      });
    });
    
    // Navegar a la página de detalles del plan
    navigate(`/plan/${planId}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-lg">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Editar Plan</h1>
        <div className="w-8"></div> {/* Espaciador para centrar el título */}
      </div>
      
      {/* Formulario de edición */}
      <div className="space-y-6">
        {/* Nombre y descripción del plan */}
        <AdvancedConfigSection
          title="Información General"
          icon={<FaCalendarAlt />}
          bgColor="bg-indigo-50 dark:bg-indigo-900"
          borderColor="border-indigo-100 dark:border-indigo-800"
          iconColor="text-indigo-500"
          defaultExpanded={true}
          tooltip="Información básica del plan de entrenamiento."
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre del plan
            </label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Mi plan de entrenamiento"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Descripción del plan de entrenamiento"
              rows={3}
            />
          </div>
        </AdvancedConfigSection>
        
        {/* Objetivos */}
        <AdvancedConfigSection
          title="Objetivos de Entrenamiento"
          icon={<FaDumbbell />}
          bgColor="bg-blue-50 dark:bg-blue-900"
          borderColor="border-blue-100 dark:border-blue-800"
          iconColor="text-blue-500"
          defaultExpanded={true}
          tooltip="Los objetivos determinan cómo se estructurará tu plan de entrenamiento, incluyendo series, repeticiones, cargas y tipos de ejercicios."
        >
          <GoalConfig
            primaryGoal={primaryGoal}
            setPrimaryGoal={setPrimaryGoal}
            secondaryGoals={secondaryGoals}
            setSecondaryGoals={setSecondaryGoals}
          />
        </AdvancedConfigSection>
        
        {/* Duración del plan */}
        <AdvancedConfigSection
          title="Duración del Plan"
          icon={<FaCalendarAlt />}
          bgColor="bg-purple-50 dark:bg-purple-900"
          borderColor="border-purple-100 dark:border-purple-800"
          iconColor="text-purple-500"
          defaultExpanded={true}
          tooltip="La duración del plan determina cuánto tiempo seguirás este programa antes de evaluarlo y ajustarlo."
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duración en semanas
            </label>
            <select
              value={planDuration}
              onChange={(e) => setPlanDuration(parseInt(e.target.value))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            >
              <option value={4}>4 semanas</option>
              <option value={8}>8 semanas</option>
              <option value={12}>12 semanas</option>
              <option value={16}>16 semanas</option>
              <option value={20}>20 semanas</option>
              <option value={24}>24 semanas</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Recomendamos entre 8 y 12 semanas para la mayoría de los objetivos.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de periodización
            </label>
            <PeriodizationConfig
              periodizationType={periodizationType}
              setPeriodizationType={setPeriodizationType}
            />
          </div>
        </AdvancedConfigSection>
        
        {/* Frecuencia y distribución */}
        <AdvancedConfigSection
          title="Frecuencia y Distribución"
          icon={<FaCalendarAlt />}
          bgColor="bg-orange-50 dark:bg-orange-900"
          borderColor="border-orange-100 dark:border-orange-800"
          iconColor="text-orange-500"
          defaultExpanded={true}
          tooltip="La frecuencia y distribución determinan cuántos días entrenas por semana y cómo organizas los grupos musculares."
        >
          <SplitConfig
            splitConfiguration={splitConfiguration}
            setSplitConfiguration={setSplitConfiguration}
            weeklyFrequency={weeklyFrequency}
            setWeeklyFrequency={setWeeklyFrequency}
            trainingDays={trainingDays}
            setTrainingDays={setTrainingDays}
          />
        </AdvancedConfigSection>
        
        {/* Duración de sesión y equipamiento */}
        <AdvancedConfigSection
          title="Duración y Equipamiento"
          icon={<FaClock />}
          bgColor="bg-red-50 dark:bg-red-900"
          borderColor="border-red-100 dark:border-red-800"
          iconColor="text-red-500"
          defaultExpanded={true}
          tooltip="La duración de sesión y el equipamiento disponible determinan cómo se estructurarán tus entrenamientos."
        >
          <EquipmentConfig
            sessionDuration={sessionDuration}
            setSessionDuration={setSessionDuration}
            availableEquipment={availableEquipment}
            setAvailableEquipment={setAvailableEquipment}
          />
        </AdvancedConfigSection>
        
        {/* Botón de guardar cambios */}
        <button
          onClick={handleUpdatePlan}
          className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
        >
          <FaSave className="mr-2" />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default PlanEditPage;
