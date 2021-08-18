import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { Loader } from '../components/Loader.js';
import { LinksList } from '../components/LinksList';

export const LinksPage = () => {
  const [links, setLinks] = useState([]);
  const {loading, request} = useHttp();
  const {token} = useContext(AuthContext);
  // метод для получения ссылок
  const fetchLinks = useCallback( async () => {
    try {
      // отправляем запрос на сервер для получения всех ссылок
      const fecthed = await request('/api/link', 'GET', null, {
        Authorization: `Bearer ${token}`
      });
      // устанавливаем в стейт полученные данные
      setLinks(fecthed);
    } catch (e) {}
  }, [token, request]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);
  // если идёт загрузка - показываем прелоадер
  if (loading) {
    return <Loader/>
  }
  // если загрузка прошла - показываем список всех ссылок
  return(
    <>
      { !loading && <LinksList links={links}/> }
    </>
  );
}
