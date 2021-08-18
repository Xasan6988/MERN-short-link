const {Router} = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator')
const User = require('../models/User');
const router = Router();

// /api/auth/register
// роут для пост запроса на регистрацию
router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(), // валидация имайла
    check('password', 'Минимальная длина пароля 6 символов') // валидация пароля
      .isLength({ min: 6 })
  ],
  async (req, res) => {
  try {
    // сохранение результата валидации
    const errors = validationResult(req);

    // если есть ошибка, то отдаём клиенту 400
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректные данные при регистрации',
      });
    }

    // достаём введёные при регистрации даные
    const {email, password} = req.body;

    // ищем по БД юзера с введёным имайлом
    const candidate = await User.findOne({ email });

    // если такой юзер найден, отдаём 400
    if (candidate) {
      return res.status(400).json({ message: 'Такой пользователь уже существует' });
    }

    // хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 12);
    // создаём нового пользователя с введёным имайлом и хэшированным паролем
    const user = new User({ email, password: hashedPassword });
    // сохраняем нового пользователя в БД
    await user.save();
    // отдаём 201
    res.status(201).json({ message: 'Пользователь создан' });

  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'});
  }
});

// /api/auth/login
// роут для пост запроса на авторизацию
router.post(
  '/login',
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(), // валидация имайла
    check('password', 'Введите пароль').exists() // валидация пароля
  ],
  async (req, res) => {
  try {
    // сохранение результата виладиции
    const errors = validationResult(req);

    // если данные не валдины - отдаём 400
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректные данные при входе в систему',
      });
    }

    // достаём введеные данные
    const {email, password} = req.body;
    // ищем юзера с введёным имайлом в БД
    const user = await User.findOne({ email });

    // если пользователь не найден - отдаём 400
    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    // сравнение введённого пароля с паролем, хранящемся в БД
    const isMatch = await bcrypt.compare(password, user.password);
    // если пароль не соответствует - отдаём 400
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' });
    }

    // создаём jwt для дальнейшего пользования приложения в состоянии "авторизован"
    const token = jwt.sign(
      { userId: user.id },
      config.get('jwtSecret'),
      { expiresIn: '1h' }
    );
    // отдаём токен и айди юзера
    res.json({ token, userId: user.id })

  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'});
  }
});


module.exports = router;
