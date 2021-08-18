import {useState, useCallback, useEffect} from 'react';

const storageName = 'userData';

// хук авторизации
export const useAuth = () => {
  // стэйты для токена, авторизованности и юзерАйди
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState(null);

  // принимаем в методе токен и айди пользователя и устанавливаем их в стейт
  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);
    // сохраняем токен и айди в локалку для того, что бы не терять авторизацию при перезагрузке страницы
    localStorage.setItem(storageName, JSON.stringify({
      userId: id, token: jwtToken
    }));
  }, []);
  // метод для выхода с аккаунта
  const logout = useCallback(() => {
    // обнуление стейтов
    setToken(null);
    setUserId(null);
    // очистка локалки
    localStorage.removeItem(storageName);
  }, []);
  // проверяем локалку, пытаясь достать оттуда "действующую авторизацию"
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));
    // если данные в локалке есть, то выполняем логин с этими данными
    if (data && data.token) {
      login(data.token, data.userId);
    }
    // устанавливаем авторизованность
    setReady(true);
  }, [login]);
  // возвращаем данные и методы
  return { login, logout, token, userId, ready };
};
