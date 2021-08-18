const express = require('express');
const config = require('config');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
// подключаем ответы в формате json
app.use(express.json({ extended: true }));
// мидлвар для роутов авторизации
app.use('/api/auth', require('./routes/auth.routes'));
// мидлвар для основных роутов приложения
app.use('/api/link', require('./routes/link.routes'));
// мидлвар для роутов перенаправления
app.use('/t/', require('./routes/redirect.routes'));

// роуты для продакшена, статика из билда
if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
// берём порт из конфига или по умолчанию
const PORT = config.get('port') || 5000;

// функция коннекта с монго + запуск сервера
const start = async () => {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
};

start();
