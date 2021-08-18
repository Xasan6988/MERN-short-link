import React, { useCallback, useContext, useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import {Loader} from '../components/Loader.js';
import { LinkCard } from '../components/LinkCard';

export const DetailPage = () => {
  // достаём токен авторизации
  const {token} = useContext(AuthContext);
  // достаём метод запроса и состояние загрузки
  const {request, loading} = useHttp();
  // стейт ссылки
  const [link, setLink] = useState(null);
  // айди ссылки
  const linkId = useParams().id;
  // метод получения ссылки
  const getLink = useCallback( async () => {
    try {
      // запрашиваем с сервера ссылку с определенным айди
      const fetched = await request(`/api/link/${linkId}`, 'GET', null, {
        Authorization: `Bearer ${token}`
      });
      // устанавливаем в стейт полученную ссылку
      setLink(fetched);
    } catch (e) {}
  }, [token, linkId, request]);

  useEffect(() => {
    getLink();
  }, [getLink]);
  // если данные загружаются - показываем прелоадер
  if (loading) {
    return <Loader/>
  }

  // если загрузка прошла и ссылка существует - показываем компонент ссылки
  return(
    <>
      { !loading && link && <LinkCard link={link}/> }
    </>
  );
}
