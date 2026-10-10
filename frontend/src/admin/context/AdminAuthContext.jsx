import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminApi, setMemoryToken, setActiveWeddingId } from '../services/adminApi';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [wedding, setWedding] = useState(null);
  const [weddings, setWeddings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await adminApi.getMe();
      if (res.success && res.data) {
        setAdmin(res.data.admin);
        setWedding(res.data.wedding);
        setWeddings(res.data.weddings || (res.data.wedding ? [res.data.wedding] : []));
        if (res.data.wedding?.id) {
          setActiveWeddingId(res.data.wedding.id);
        }
      } else {
        setAdmin(null);
        setWedding(null);
        setWeddings([]);
      }
    } catch (err) {
      setAdmin(null);
      setWedding(null);
      setWeddings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    const res = await adminApi.login(username, password);
    if (res.success && res.data) {
      setAdmin(res.data.admin);
      // Fetch full admin and wedding context
      await checkAuth();
      return res;
    }
    throw new Error(res.message || 'Login gagal');
  };

  const logout = async () => {
    try {
      await adminApi.logout();
    } finally {
      setAdmin(null);
      setWedding(null);
      setWeddings([]);
      setMemoryToken(null);
    }
  };

  const switchWedding = async (weddingId) => {
    const res = await adminApi.selectWedding(weddingId);
    if (res.success && res.data) {
      setWedding(res.data);
      setActiveWeddingId(res.data.id);
      await checkAuth();
      return res.data;
    }
    throw new Error(res.message || 'Gagal mengganti klien undangan');
  };

  const updateWeddingSlug = (newSlug, newTitle) => {
    setWedding((prev) => ({
      ...prev,
      slug: newSlug,
      title: newTitle || prev?.title,
    }));
    setWeddings((prev) =>
      prev.map((w) =>
        w.id === wedding?.id
          ? { ...w, slug: newSlug, title: newTitle || w.title }
          : w
      )
    );
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        wedding,
        weddings,
        isAuthenticated: Boolean(admin),
        isLoading,
        login,
        logout,
        refreshAdmin: checkAuth,
        switchWedding,
        updateWeddingSlug,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}