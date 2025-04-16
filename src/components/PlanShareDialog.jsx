import React, { useState } from 'react';
import { FaShare, FaCheck, FaTimes, FaLink, FaCopy, FaLock, FaGlobe, FaTag, FaCalendarAlt } from 'react-icons/fa';
import { useTraining } from '../context/TrainingContext';
import { useAuth } from '../context/AuthContext';
import sharingService from '../services/sharingService';
import { toast } from 'react-toastify';

/**
 * Componente de diálogo para compartir un plan de entrenamiento
 */
const PlanShareDialog = ({ plan, onClose }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    expirationDays: 30,
    includeProgress: false,
    isPublic: false,
    password: '',
    description: plan?.description || '',
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shareResult, setShareResult] = useState(null);
  const [newTag, setNewTag] = useState('');
  
  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Preparar opciones de compartición
      const shareOptions = {
        ...formData,
        userId: currentUser?.uid || null,
        userName: currentUser?.displayName || currentUser?.email || 'Usuario anónimo'
      };
      
      // Si no se proporciona contraseña, establecer a null
      if (!formData.password.trim()) {
        shareOptions.password = null;
      }
      
      // Compartir el plan
      const result = await sharingService.sharePlan(plan, shareOptions);
      
      // Guardar el resultado
      setShareResult(result);
      
      // Notificar éxito
      toast.success('Plan compartido correctamente');
    } catch (error) {
      console.error('Error al compartir el plan:', error);
      setError(error.message || 'Error al compartir el plan');
      toast.error('Error al compartir el plan');
    } finally {
      setLoading(false);
    }
  };
  
  // Copiar enlace al portapapeles
  const copyLinkToClipboard = () => {
    if (shareResult?.shareUrl) {
      navigator.clipboard.writeText(shareResult.shareUrl)
        .then(() => {
          toast.success('Enlace copiado al portapapeles');
        })
        .catch(err => {
          console.error('Error al copiar el enlace:', err);
          toast.error('Error al copiar el enlace');
        });
    }
  };
  
  // Agregar una etiqueta
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };
  
  // Eliminar una etiqueta
  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  // Manejar tecla Enter en el campo de etiquetas
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  // Renderizar el formulario de compartición
  if (!shareResult) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <h2 className="text-xl font-bold flex items-center">
              <FaShare className="mr-2" />
              Compartir Plan
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe brevemente este plan de entrenamiento"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Etiquetas
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="tags"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Añadir etiqueta"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors"
                  >
                    <FaTag />
                  </button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          <FaTimes size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="expirationDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Días de validez
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    id="expirationDays"
                    name="expirationDays"
                    min="1"
                    max="90"
                    value={formData.expirationDays}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[40px]">
                    {formData.expirationDays}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  El enlace será válido durante {formData.expirationDays} días
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Compartir públicamente
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeProgress"
                  name="includeProgress"
                  checked={formData.includeProgress}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="includeProgress" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Incluir progreso registrado
                </label>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contraseña (opcional)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Dejar en blanco para no requerir contraseña"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Si estableces una contraseña, los usuarios deberán introducirla para acceder al plan
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                disabled={loading}
              >
                <FaTimes className="inline mr-1" />
                Cancelar
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Compartiendo...
                  </>
                ) : (
                  <>
                    <FaShare className="mr-2" />
                    Compartir Plan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  // Renderizar el resultado de la compartición
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <h2 className="text-xl font-bold flex items-center">
            <FaCheck className="mr-2" />
            Plan Compartido
          </h2>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tu plan de entrenamiento ha sido compartido correctamente. Utiliza el siguiente enlace para compartirlo:
            </p>
            
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
              <FaLink className="text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={shareResult.shareUrl}
                readOnly
                className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-white text-sm"
              />
              <button
                onClick={copyLinkToClipboard}
                className="ml-2 p-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                title="Copiar enlace"
              >
                <FaCopy />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <FaCalendarAlt className="text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  Válido hasta: {new Date(shareResult.expirationDate).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center text-sm">
                {shareResult.hasPassword ? (
                  <>
                    <FaLock className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Protegido con contraseña
                    </span>
                  </>
                ) : (
                  <>
                    <FaGlobe className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Accesible sin contraseña
                    </span>
                  </>
                )}
              </div>
              
              {shareResult.isPublic && (
                <div className="flex items-center text-sm">
                  <FaGlobe className="text-green-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Visible públicamente en la galería de planes
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              <FaCheck className="inline mr-1" />
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanShareDialog;
