'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User, Order, OrderResponse, StandardDocument, ExpertiseResponse, ExpertiseProject, ExpertiseRequest } from './types';
import { MOCK_ORDERS, MOCK_RESPONSES, MOCK_STANDARDS, MOCK_EXPERTISE_REQUESTS, MOCK_EXPERTISE_PROJECTS, MOCK_EXPERTISE_RESPONSES } from './mock-data';

interface AppState {
  user: User | null;
  orders: Order[];
  responses: OrderResponse[];
  favoriteStandardsByUser: Record<string, string[]>;
}

interface AppContextType extends AppState {
  hydrated: boolean;
  login: (email: string, password: string) => boolean;
  // Возвращает код восстановления при успехе (показывается пользователю один раз), false — при отказе.
  register: (user: Omit<User, 'id' | 'createdAt'>) => string | false;
  resetPasswordByCode: (email: string, code: string, newPassword: string) => boolean;
  logout: () => void;
  updateUser: (patch: Partial<Omit<User, 'id' | 'createdAt'>>) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'responsesCount' | 'customerId' | 'customerName'>) => Order;
  addResponse: (response: Omit<OrderResponse, 'id' | 'createdAt' | 'designerId' | 'designerName' | 'designerCompany'>) => boolean;
  hasResponded: (orderId: string) => boolean;
  selectExecutor: (orderId: string, designerId: string, designerName: string) => void;
  toggleInvitedDesigner: (orderId: string, designerId: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getResponsesForOrder: (orderId: string) => OrderResponse[];
  getMyOrders: () => Order[];
  getMyResponses: () => OrderResponse[];
  favoriteStandards: string[];
  toggleFavoriteStandard: (code: string) => void;
  getFavoriteStandards: () => StandardDocument[];
  getMyExpertiseResponses: () => ExpertiseResponse[];
  getMyExpertiseProjects: () => ExpertiseProject[];
  getRecommendedOrders: () => Order[];
  getRecommendedExpertise: () => ExpertiseRequest[];
  notice: { id: number; message: string } | null;
  notify: (message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function generateId() {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Код восстановления пароля вида XXXX-XXXX. Алфавит без похожих символов (I, O, 0, 1).
const RECOVERY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateRecoveryCode() {
  let out = '';
  for (let i = 0; i < 8; i++) {
    if (i === 4) out += '-';
    out += RECOVERY_ALPHABET[Math.floor(Math.random() * RECOVERY_ALPHABET.length)];
  }
  return out;
}

// Сравнение кодов без учёта регистра, дефисов и пробелов.
function normalizeRecoveryCode(code: string) {
  return (code || '').replace(/[\s-]/g, '').toUpperCase();
}

const DEFAULT_FAVORITES = MOCK_STANDARDS.filter((s) => s.isFeatured).map((s) => s.code);

function loadState(): AppState {
  if (typeof window === 'undefined') return { user: null, orders: MOCK_ORDERS, responses: MOCK_RESPONSES, favoriteStandardsByUser: {} };
  try {
    const saved = localStorage.getItem('pm_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        user: parsed.user || null,
        orders: parsed.orders?.length ? parsed.orders : MOCK_ORDERS,
        responses: parsed.responses?.length ? parsed.responses : MOCK_RESPONSES,
        favoriteStandardsByUser: parsed.favoriteStandardsByUser && typeof parsed.favoriteStandardsByUser === 'object' ? parsed.favoriteStandardsByUser : {},
      };
    }
  } catch {}
  return { user: null, orders: MOCK_ORDERS, responses: MOCK_RESPONSES, favoriteStandardsByUser: {} };
}

function saveState(state: AppState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('pm_state', JSON.stringify(state));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({ user: null, orders: MOCK_ORDERS, responses: MOCK_RESPONSES, favoriteStandardsByUser: {} });
  const [mounted, setMounted] = useState(false);
  const [notice, setNotice] = useState<{ id: number; message: string } | null>(null);
  const noticeCounter = useRef(0);

  const notify = useCallback((message: string) => {
    noticeCounter.current += 1;
    setNotice({ id: noticeCounter.current, message });
  }, []);

  useEffect(() => {
    setState(loadState());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveState(state);
  }, [state, mounted]);

  const login = useCallback((email: string, password: string) => {
    if (typeof window === 'undefined') return false;
    const users = JSON.parse(localStorage.getItem('pm_users') || '[]') as User[];
    const found = users.find((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (!found) return false;
    // Проверяем пароль. У старых аккаунтов пароль мог не сохраниться —
    // для обратной совместимости такие пускаем по email.
    if (found.password && found.password !== password) return false;
    const { password: _pw, recoveryCode: _rc, ...safe } = found;
    // Миграция аккаунтов, созданных до модели категорий (вопрос 18):
    // категории исполнителя выводим из legacy-роли.
    if (!safe.executorCategories && (safe.role === 'designer' || safe.role === 'expert')) {
      safe.executorCategories = [safe.role === 'designer' ? 'designer' : 'surveyor'];
    }
    setState((prev) => ({ ...prev, user: safe }));
    return true;
  }, []);

  const register = useCallback((userData: Omit<User, 'id' | 'createdAt'>) => {
    if (typeof window === 'undefined') return false;
    const users = JSON.parse(localStorage.getItem('pm_users') || '[]') as User[];
    const email = (userData.email || '').trim().toLowerCase();
    // Дубликат email недопустим (BUG-002).
    if (users.some((u) => u.email.trim().toLowerCase() === email)) {
      return false;
    }
    const name = (userData.name || '').trim();
    if (!name) return false;
    const recoveryCode = generateRecoveryCode();
    const newUser: User = {
      ...userData,
      email,
      name,
      company: userData.company?.trim(),
      recoveryCode,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('pm_users', JSON.stringify(users));
    const { password: _pw, recoveryCode: _rc, ...safe } = newUser;
    setState((prev) => ({ ...prev, user: safe }));
    return recoveryCode;
  }, []);

  // Сброс пароля по коду восстановления. Пользователь не в сессии — правим только pm_users.
  const resetPasswordByCode = useCallback((email: string, code: string, newPassword: string) => {
    if (typeof window === 'undefined') return false;
    const users = JSON.parse(localStorage.getItem('pm_users') || '[]') as User[];
    const idx = users.findIndex((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (idx < 0) return false;
    const stored = users[idx].recoveryCode;
    if (!stored) return false;
    if (normalizeRecoveryCode(stored) !== normalizeRecoveryCode(code)) return false;
    users[idx] = { ...users[idx], password: newPassword };
    localStorage.setItem('pm_users', JSON.stringify(users));
    return true;
  }, []);

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, user: null }));
  }, []);

  const updateUser = useCallback((patch: Partial<Omit<User, 'id' | 'createdAt'>>) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const updated: User = { ...prev.user, ...patch };
      if (typeof window !== 'undefined') {
        const users = JSON.parse(localStorage.getItem('pm_users') || '[]') as User[];
        const idx = users.findIndex((u) => u.id === updated.id);
        if (idx >= 0) {
          users[idx] = { ...users[idx], ...patch };
        } else {
          users.push(updated);
        }
        localStorage.setItem('pm_users', JSON.stringify(users));
      }
      return { ...prev, user: updated };
    });
  }, []);

  const addOrder = useCallback((orderData: Omit<Order, 'id' | 'createdAt' | 'responsesCount' | 'customerId' | 'customerName'>) => {
    const newOrder: Order = {
      ...orderData,
      id: generateId(),
      customerId: state.user?.id || '',
      customerName: state.user?.name || '',
      responsesCount: 0,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, orders: [newOrder, ...prev.orders] }));
    return newOrder;
  }, [state.user]);

  const addResponse = useCallback((responseData: Omit<OrderResponse, 'id' | 'createdAt' | 'designerId' | 'designerName' | 'designerCompany'>) => {
    const me = state.user?.id || '';
    // Один проектировщик — один отклик на заявку (BUG-021).
    if (state.responses.some((r) => r.orderId === responseData.orderId && r.designerId === me)) {
      return false;
    }
    const newResponse: OrderResponse = {
      ...responseData,
      id: generateId(),
      designerId: me,
      designerName: state.user?.name || '',
      designerCompany: state.user?.company,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => {
      // Повторная проверка внутри апдейтера — защита от гонки при двойном клике.
      if (prev.responses.some((r) => r.orderId === responseData.orderId && r.designerId === me)) {
        return prev;
      }
      return {
        ...prev,
        responses: [newResponse, ...prev.responses],
        orders: prev.orders.map((o) =>
          o.id === responseData.orderId
            ? { ...o, responsesCount: o.responsesCount + 1 }
            : o
        ),
      };
    });
    return true;
  }, [state.user, state.responses]);

  const hasResponded = useCallback((orderId: string) => {
    const me = state.user?.id;
    return !!me && state.responses.some((r) => r.orderId === orderId && r.designerId === me);
  }, [state.responses, state.user]);

  // Выбор исполнителя заказчиком: заявка переходит «В работу» (BUG-019).
  const selectExecutor = useCallback((orderId: string, designerId: string, designerName: string) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId
          ? { ...o, status: 'in_progress' as const, assignedDesignerId: designerId, assignedDesignerName: designerName }
          : o
      ),
    }));
  }, []);

  // Приглашение проектировщика в «Команду проекта» заявки (I15).
  const toggleInvitedDesigner = useCallback((orderId: string, designerId: string) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => {
        if (o.id !== orderId) return o;
        const invited = o.invitedDesignerIds ?? [];
        return {
          ...o,
          invitedDesignerIds: invited.includes(designerId)
            ? invited.filter((x) => x !== designerId)
            : [...invited, designerId],
        };
      }),
    }));
  }, []);

  const getOrderById = useCallback((id: string) => {
    return state.orders.find((o) => o.id === id);
  }, [state.orders]);

  const getResponsesForOrder = useCallback((orderId: string) => {
    return state.responses.filter((r) => r.orderId === orderId);
  }, [state.responses]);

  const getMyOrders = useCallback(() => {
    return state.orders.filter((o) => o.customerId === state.user?.id);
  }, [state.orders, state.user]);

  const getMyResponses = useCallback(() => {
    return state.responses.filter((r) => r.designerId === state.user?.id);
  }, [state.responses, state.user]);

  const toggleFavoriteStandard = useCallback((code: string) => {
    setState((prev) => {
      const key = prev.user?.id ?? 'anon';
      const current = prev.favoriteStandardsByUser[key] ?? DEFAULT_FAVORITES;
      const updated = current.includes(code) ? current.filter((c) => c !== code) : [...current, code];
      return { ...prev, favoriteStandardsByUser: { ...prev.favoriteStandardsByUser, [key]: updated } };
    });
  }, []);

  const favoriteStandards = state.favoriteStandardsByUser[state.user?.id ?? 'anon'] ?? DEFAULT_FAVORITES;

  const getFavoriteStandards = useCallback(
    () => MOCK_STANDARDS.filter((s) => favoriteStandards.includes(s.code)),
    [favoriteStandards]
  );

  // Сторона обследователя: мок представляет «текущего» эксперта прототипа.
  // Шов изоляции данных — этот геттер; в реальном бэкенде фильтр будет по user.id.
  const getMyExpertiseResponses = useCallback(
    () => (state.user?.role === 'expert' ? MOCK_EXPERTISE_RESPONSES : []),
    [state.user]
  );

  const getMyExpertiseProjects = useCallback(
    () => (state.user?.role === 'expert' ? MOCK_EXPERTISE_PROJECTS : []),
    [state.user]
  );

  const getRecommendedExpertise = useCallback(
    () => MOCK_EXPERTISE_REQUESTS.slice(0, 4),
    []
  );

  // Рекомендации исполнителю: опубликованные заявки, пересекающиеся со
  // специализацией пользователя; если совпадений нет — свежие опубликованные.
  const getRecommendedOrders = useCallback(() => {
    const published = state.orders.filter((o) => o.status === 'published');
    const specs = state.user?.specializations || [];
    const matched = specs.length
      ? published.filter((o) => o.sections?.some((s) => specs.includes(s)))
      : [];
    return (matched.length ? matched : published).slice(0, 4);
  }, [state.orders, state.user]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        favoriteStandards,
        hydrated: mounted,
        login, register, resetPasswordByCode, logout, updateUser,
        addOrder, addResponse, hasResponded, selectExecutor, toggleInvitedDesigner,
        getOrderById, getResponsesForOrder,
        getMyOrders, getMyResponses,
        toggleFavoriteStandard, getFavoriteStandards, getMyExpertiseResponses, getMyExpertiseProjects, getRecommendedOrders, getRecommendedExpertise,
        notice, notify,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
