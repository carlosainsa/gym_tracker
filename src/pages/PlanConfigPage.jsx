import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaDumbbell, FaCalendarAlt, FaClock, FaWeight, FaRunning, FaChartLine, FaUserCog } from 'react-icons/fa';
import { useTraining } from '../context/TrainingContext';
import AdvancedConfigSection from '../components/AdvancedConfigSection';
import PeriodizationConfig from '../components/PeriodizationConfig';
import SplitConfig from '../components/SplitConfig';
import EquipmentConfig from '../components/EquipmentConfig';
import GoalConfig from '../components/GoalConfig';

const PlanConfigPage = () => {
  const navigate = useNavigate();
  const { userPreferences, updateUserPreferences, createNewPlan } = useTraining();

  // Estados para la configuración del plan
  const [primaryGoal, setPrimaryGoal] = useState('hypertrophy');
  const [secondaryGoals, setSecondaryGoals] = useState([]);
  const [planDuration, setPlanDuration] = useState(12);
  const [periodizationType, setPeriodizationType] = useState('linear');
  const [weeklyFrequency, setWeeklyFrequency] = useState(3);
  const [splitConfiguration, setSplitConfiguration] = useState('fullbody');
  const [trainingDays, setTrainingDays] = useState([1, 3, 5]); // Lunes, Miércoles, Viernes
  const [sessionDuration, setSessionDuration] = useState(60);
  const [availableEquipment, setAvailableEquipment] = useState(['all']);

  // Cargar preferencias actuales
  useEffect(() => {
    if (userPreferences) {
      const { trainingPreferences } = userPreferences;

      // Establecer valores iniciales basados en las preferencias del usuario
      setTrainingDays(trainingPreferences.preferredTrainingDays || [1, 3, 5]);
      setSplitConfiguration(trainingPreferences.splitPreference || 'fullbody');
      setSessionDuration(trainingPreferences.sessionDurationPreference || 60);

      // Establecer equipamiento disponible
      if (userPreferences.equipmentAvailable && userPreferences.equipmentAvailable.length > 0) {
        setAvailableEquipment(userPreferences.equipmentAvailable);
      }
    }
  }, [userPreferences]);



  // Crear el plan
  const handleCreatePlan = () => {
    // Actualizar las preferencias del usuario
    updateUserPreferences('training', 'preferredTrainingDays', trainingDays);
    updateUserPreferences('training', 'splitPreference', splitConfiguration);
    updateUserPreferences('training', 'sessionDurationPreference', sessionDuration);
    updateUserPreferences('equipment', 'equipmentAvailable', availableEquipment);

    // Crear el nuevo plan
    const planPreferences = {
      primaryGoal,
      secondaryGoals,
      planDuration,
      periodizationType,
      weeklyFrequency,
      splitConfiguration,
      trainingDays,
      sessionDuration,
      availableEquipment
    };

    createNewPlan(planPreferences);

    // Navegar a la página principal
    navigate('/');
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Configuración del Plan</h1>
        <div className="w-8"></div> {/* Espaciador para centrar el título */}
      </div>

      {/* Formulario de configuración */}
      <div className="space-y-6">
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
              <option value="4">4 semanas</option>
              <option value="8">8 semanas</option>
              <option value="12">12 semanas</option>
              <option value="16">16 semanas</option>
              <option value="24">24 semanas</option>
              <option value="52">52 semanas</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {planDuration <= 4 ? 'Programa corto, ideal para objetivos específicos o períodos de prueba.' :
               planDuration <= 12 ? 'Duración estándar, equilibra resultados y variedad.' :
               'Programa a largo plazo, ideal para objetivos ambiciosos y progresión sostenida.'}
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

        {/* Botón de crear plan */}
        <button
          onClick={handleCreatePlan}
          className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
        >
          <FaCheck className="mr-2" />
          Crear Plan Personalizado
        </button>
      </div>
    </div>
  );
};

export default PlanConfigPage;
