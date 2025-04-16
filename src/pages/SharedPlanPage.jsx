import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaLock, FaDownload, FaUser, FaCalendarAlt, FaEye, FaCloudDownloadAlt } from 'react-icons/fa';
import { useTraining } from '../context/TrainingContext';
import { useAuth } from '../context/AuthContext';
import sharingService from '../services/sharingService';
import { toast } from 'react-toastify';
import PlanOverview from '../components/PlanOverview';

/**
 * Página para ver un plan compartido
 */
const SharedPlanPage = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const { importPlanFromJson } = useTraining();
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sharedPlan, setSharedPlan] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [password, setPassword] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Cargar el plan compartido
  useEffect(() => {
    const loadSharedPlan = async () => {
      if (!shareId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Intentar cargar el plan sin contraseña primero
        const result = await sharingService.getSharedPlan(shareId);
        
        setSharedPlan(result.plan);
        setMetadata(result.metadata);
        setNeedsPassword(false);
      } catch (error) {
        console.error('Error al cargar el plan compartido:', error);
        
        // Verificar si el error es por contraseña
        if (error.message === 'Contraseña incorrecta') {
          setNeedsPassword(true);
        } else {
          setError(error.message || 'Error al cargar el plan compartido');
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadSharedPlan();
  }, [shareId]);
  
  // Manejar el envío del formulario de contraseña
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast.error('Introduce la contraseña');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Cargar el plan con la contraseña
      const result = await sharingService.getSharedPlan(shareId, password);
      
      setSharedPlan(result.plan);
      setMetadata(result.metadata);
      setNeedsPassword(false);
      
      toast.success('Acceso concedido');
    } catch (error) {
      console.error('Error al verificar la contraseña:', error);
      toast.error(error.message || 'Contraseña incorrecta');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Manejar la importación del plan
  const handleImportPlan = async () => {
    try {
      if (!sharedPlan) {
        throw new Error('No hay un plan para importar');
      }
      
      // Incrementar el contador de descargas
      await sharingService.downloadSharedPlan(shareId);
      
      // Importar el plan
      const importedPlan = importPlanFromJson(JSON.stringify(sharedPlan));
      
      toast.success(`Plan "${importedPlan.name}" importado correctamente`);
      
      // Navegar al plan importado
      navigate(`/plan/${importedPlan.id}`);
    } catch (error) {
      console.error('Error al importar el plan:', error);
      toast.error('Error al importar el plan');
    }
  };
  
  // Renderizar el formulario de contraseña
  if (needsPassword) {
    return (
      <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Plan Protegido</h1>
          <div className="w-8"></div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <div className="flex items-center">
              <FaLock className="mr-2" />
              <h2 className="text-lg font-medium">Acceso Protegido</h2>
            </div>
            <p className="text-white text-opacity-90 mt-1">
              Este plan está protegido con contraseña
            </p>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Para acceder a este plan de entrenamiento, introduce la contraseña proporcionada por quien lo compartió.
            </p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando...
                  </>
                ) : (
                  'Acceder al Plan'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  // Renderizar el estado de carga
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Cargando Plan</h1>
          <div className="w-8"></div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12">
          <svg className="animate-spin h-12 w-12 text-primary-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Cargando plan compartido...</p>
        </div>
      </div>
    );
  }
  
  // Renderizar el estado de error
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Error</h1>
          <div className="w-8"></div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-4 bg-red-500 text-white">
            <h2 className="text-xl font-bold">Error al cargar el plan</h2>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            
            <button
              onClick={() => navigate('/plans')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Volver a Planes
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Renderizar el plan compartido
  return (
    <div className="container mx-auto px-4 py-8 pt-16 pb-24 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Plan Compartido</h1>
        <div className="w-8"></div>
      </div>
      
      {sharedPlan && (
        <div className="space-y-6">
          {/* Información del plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
              <h2 className="text-xl font-bold">{sharedPlan.name}</h2>
              <p className="text-white text-opacity-90 mt-1">
                {metadata?.description || sharedPlan.description}
              </p>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-4 mb-4">
                {metadata && (
                  <>
                    <div className="flex items-center text-sm">
                      <FaUser className="text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Compartido por: {metadata.ownerName}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <FaCalendarAlt className="text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Válido hasta: {new Date(metadata.expirationDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <FaEye className="text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Vistas: {metadata.views || 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <FaCloudDownloadAlt className="text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Descargas: {metadata.downloads || 0}
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              {metadata?.tags && metadata.tags.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Etiquetas:</p>
                  <div className="flex flex-wrap gap-2">
                    {metadata.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  onClick={handleImportPlan}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
                >
                  <FaDownload className="mr-2" />
                  Importar Plan
                </button>
              </div>
            </div>
          </div>
          
          {/* Vista previa del plan */}
          <PlanOverview plan={sharedPlan} isPreview={true} />
        </div>
      )}
    </div>
  );
};

export default SharedPlanPage;
