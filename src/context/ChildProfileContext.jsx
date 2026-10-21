import React, { createContext, useContext, useState, useEffect } from 'react';

const DEFAULT_PROFILE = {
  name: 'Aarav',
  age: 4,
  language: 'en',
  companion: 'panda', // 'panda' | 'lion' | 'elephant' | 'lumi'
  condition: 'Both',
  interests: ['dinosaurs', 'animals', 'bubbles']
};

const ChildProfileContext = createContext();

export function ChildProfileProvider({ children }) {
  const [profile, setProfileState] = useState(() => {
    try {
      const saved = localStorage.getItem('lumiChildProfile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          return {
            ...DEFAULT_PROFILE,
            ...parsed,
            companion: parsed.companion || 'panda',
            language: parsed.language || 'en'
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load lumiChildProfile from localStorage', e);
    }
    return DEFAULT_PROFILE;
  });

  const updateProfile = (newFields) => {
    setProfileState((prev) => {
      const updated = { ...prev, ...newFields };
      try {
        localStorage.setItem('lumiChildProfile', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save lumiChildProfile to localStorage', e);
      }
      return updated;
    });
  };

  const setLanguage = (language) => {
    updateProfile({ language });
  };

  const setCompanion = (companionId) => {
    updateProfile({ companion: companionId });
  };

  const setName = (name) => {
    updateProfile({ name });
  };

  const setAge = (age) => {
    updateProfile({ age });
  };

  return (
    <ChildProfileContext.Provider
      value={{
        profile,
        updateProfile,
        setLanguage,
        setCompanion,
        setName,
        setAge
      }}
    >
      {children}
    </ChildProfileContext.Provider>
  );
}

export function useChildProfile() {
  const context = useContext(ChildProfileContext);
  if (!context) {
    throw new Error('useChildProfile must be used within a ChildProfileProvider');
  }
  return context;
}
