import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    site_name: '',
    logo_url: '',
    hero_title: '',
    hero_subtitle: '',
    hero_images: [],
    about_title: '',
    about_mission: '',
    stats_travelers: '',
    stats_support: '',
    stats_approval: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    map_lat: '',
    map_lng: '',
    copyright_text: '',
    quick_links: [],
    maintenance_mode: false,
    registration_closed: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsContext.Provider
      value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
