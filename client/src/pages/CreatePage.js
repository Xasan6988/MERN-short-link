import React, {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import {useHistory} from 'react-router-dom';

export const CreatePage = () => {
  const history = useHistory();
  // достаём контекст авторизации
  const auth = useContext(AuthContext);
  // достаём метод для запросов
  const {request} = useHttp();
  // стейт для ссылки
  const [link, setLink] = useState('');
  // приводим инпуты в активное состояние
  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  // обработчик нажатия клавиши
  const pressHandler = async e => {
    if (e.key === "Enter") {
      try {
        // отправляем запрос с введёнными в форму данными на сервер создания ссылки
        const data = await request('/api/link/generate', 'POST', { from: link }, {
          Authorization: `Bearer ${auth.token}`
        });
        // редиректим на страницу детальной информации созданной ссылки
        history.push(`/detail/${data.link._id}`);
      } catch (e) {}
    }
  };

  return(
    <div className="row">
      <div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>
        <div className="input-field">
          <input placeholder="Вставьте ссылку"
                          id="link"
                          type="text"
                          value={link}
                          onChange={e => setLink(e.target.value)}
                          onKeyPress={pressHandler}
                  />
                  <label htmlFor="link">Введите ссылку</label>
          </div>
        </div>
    </div>
  )
}
