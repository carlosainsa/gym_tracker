import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-700 dark:text-gray-300">{t('settings.language.title')}</span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        {t('settings.language.description')}
      </p>
      <div className="flex space-x-2">
        <button
          onClick={() => changeLanguage('es')}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
            i18n.language === 'es'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label={t('settings.language.spanish')}
          aria-pressed={i18n.language === 'es'}
        >
          <span>{t('settings.language.spanish')}</span>
        </button>
        <button
          onClick={() => changeLanguage('en')}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
            i18n.language === 'en'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label={t('settings.language.english')}
          aria-pressed={i18n.language === 'en'}
        >
          <span>{t('settings.language.english')}</span>
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
