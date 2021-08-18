import {useState, useCallback} from 'react';

// хук для http запросов
export const useHttp = () => {
  // стейты для состояния загрузки и ошбики (для дальнейшей её обработки)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // метод запроса, принимающий адрес, метод, тело запроса и хэдеры
  const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    // устанавливаем стэйт загрузки в тру
    setLoading(true);
    try {
      // если есть тело запроса - конвертируем в json и устанавливаем хэдеры
      if (body) {
        body = JSON.stringify(body);
        headers['Content-Type'] = 'application/json';
      }
      // делаем запрос с переданными параметрами
      const response = await fetch(url, {method, body, headers});
      // парсим полученные данные
      const data = await response.json();
      // если возникла ошибка - отлавливаем её
      if (!response.ok) {
        throw new Error(data.message || 'Что-то пошло не так');
      }
      // по окончанию обработки запроса устанавливаем загрузку в фалс
      setLoading(false);
      // возвращаем полученные данные
      return data;
    } catch (e) {
      // если возникла ошибка, то устанавливаем загрузку в фалс и записываем текст ошщибки в стэйт
      setLoading(false);
      setError(e.message);
      throw e;
    }
  }, []);
  // очищаем стейт ошибки
  const clearError = useCallback(() => setError(null), []);
  // возвращаем методы и данные
  return { loading, request, error, clearError };
};
