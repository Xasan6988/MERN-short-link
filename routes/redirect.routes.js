const {Router} = require('express');
const Link = require('../models/Link');
const router = Router();

// роут для редиректа по короткой ссылке
router.get('/:code', async (req, res) => {
  try {
    // ищем в БД ссылку с уникальным кодом
    const link = await Link.findOne({ code: req.params.code });
    // если ссылка найдена, то увеличиваем количество переходов, сохраняем и перенаправляем на соответствующий адрес
    if (link) {
      link.clicks++;
      await link.save();
      return res.redirect(link.from);
    }
    // если ссылки нет - отдаём 404
    res.status(404).json('Ссылка не найдена');

  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'});
  }
});

module.exports = router;
