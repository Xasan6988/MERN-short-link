const {Router} = require('express');
const config = require('config');
const shortid = require('shortid');
const Link = require('../models/Link');
const auth = require('../middleware/auth.middleware');
const router = Router();
// роут для пост запроса на генерацию ссылки
router.post('/generate', auth, async (req, res) => {
  try {
    // берём установленный урл
    const baseUrl = config.get('baseUrl');
    // берём данные из формы
    const {from} = req.body;
    // генерируем уникальный код для новой ссылки
    const code = shortid.generate();
    // ищем в БД совпадения с введёной ссылкой
    const existing = await Link.findOne({ from });
    // если такая ссылка уже существует - возвращаем её
    if (existing) {
      return res.json({ link: existing });
    }
    // добавляем к установленному урл сгенерированный уникальный код
    const to = baseUrl + '/t/' + code;
    // создаём объект ссылки с параметрами
    const link = new Link({
      code, to, from, owner: req.user.userId
    });
    // сохраняем ссылку в БД
    await link.save();
    // отдаём 201 с созданной ссылкой
    res.status(201).json(link);

  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'});
  }
});
// роут для получения списка всех ссылок
router.get('/', auth,  async (req, res) => {
  try {
    // ищем все ссылки, закреплённые за авторизованным пользователем
    const links = await Link.find({ owner: req.user.userId });
    // отдаём список ссылок
    res.json(links);
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'});
  }
});
// роут для запроса на ссылку с определенным айди
router.get('/:id', auth, async (req, res) => {
  try {
    // ищем в БД ссылку с таким айди
    const link = await Link.findById(req.params.id);
    // отдаём найденную ссылку
    res.json(link);
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'});
  }
});

module.exports = router;
