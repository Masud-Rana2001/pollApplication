
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

const pollController = require('./pollController')

app.set('view engine', 'ejs');



app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/create', pollController.createPollGetController);
app.post('/create', pollController.createPollPostController);

app.get('/polls/:id', pollController.viewPollGetController)
app.post('/polls/:id', pollController.viewPollPostController)
app.get('/polls',pollController.getAllPolls)
app.get('/', (req, res) => {
  res.render('home') 
})

mongoose
  .connect(
    'mongodb://localhost:27017/taskmanager',

    // 'mongodb+srv://Masud:ranamasud307801%40@cluster0.xcd2x.mongodb.net/tasks'
  )
  .then(() => {
    app.listen(4000, () => {
      console.log('Server is running on port 4000');
    });
  })
  .catch(e => {
    console.log('Something went wrong', e);
  });
