import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShareAlt, FaExchangeAlt, FaFileImport, FaFileExport, FaList, FaChevronDown, FaChevronUp } from 'react-icons/fa';

/**
 * Componente de menú desplegable para la navegación
 */
const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white flex items-center"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FaList className="mr-1" />
        <span className="hidden sm:inline">Menú</span>
        {isOpen ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <Link
              to="/plans"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <FaList className="inline mr-2" />
              Planes de Entrenamiento
            </Link>
            
            <Link
              to="/plans/search"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <FaSearch className="inline mr-2" />
              Buscar Planes
            </Link>
            
            <Link
              to="/shared"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <FaShareAlt className="inline mr-2" />
              Planes Compartidos
            </Link>
            
            <Link
              to="/plan/transition"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <FaExchangeAlt className="inline mr-2" />
              Transición de Planes
            </Link>
            
            <Link
              to="/plans/import-export"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <FaFileImport className="inline mr-2" />
              Importar/Exportar
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavMenu;
