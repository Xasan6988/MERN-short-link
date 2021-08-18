import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook.js';

export const AuthPage = () => {
  // достаём данные авторизации из контекста
  const auth = useContext(AuthContext);
  // метод для вывода сообщений
  const message = useMessage();
  // методы и данные запросов
  const {loading, error, request, clearError} = useHttp();
  // стэйт формы
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  // если есть ошибка - то выводим и чистим
  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);
  // приводим инпуты в активное состояние
  useEffect(() => {
    window.M.updateTextFields();
  }, []);
  // устанавливаем введёные в форму значения в стейт
  const changeHandler = e => {
    setForm({...form, [e.target.name]: e.target.value});
  };
  // отправляем введёные данные на сервер регистрации
  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', {...form});
      message(data.message)ж
    } catch (e) {}
  };
  // отправляем введёные данные на сервер авторизации
  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form});
      auth.login(data.token, data.userId);
      message(data.message);
    } catch (e) {}
  };


  return(
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Сократи Ссылку</h1>
        <div className="card blue darken-1">
        <div className="card-content white-text">
          <span className="card-title">Авторизация</span>
          <div>

            <div className="input-field">
              <input placeholder="Введите email"
                      id="email"
                      type="text"
                      name="email"
                      className="yellow-input"
                      value={form.email}
                      onChange={changeHandler}
              />
              <label htmlFor="email">Email</label>
            </div>

            <div className="input-field">
              <input placeholder="Введите пароль"
                      id="password"
                      type="password"
                      name="password"
                      className="yellow-input"
                      value={form.password}
                      onChange={changeHandler}
              />
              <label htmlFor="password">Пароль</label>
            </div>

          </div>
        </div>
        <div className="card-action">
          <button
            className="btn yellow darken-4"
            style={{marginRight: 10}}
            disabled={loading}
            onClick={loginHandler}
          >
            Войти
          </button>
          <button
            className="btn grey lighten-1 black-text"
            onClick={registerHandler}
            disabled={loading}
          >
            Регистрация
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
