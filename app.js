var express        = require('express')
   ,http           = require('http')
   ,bodyParser     = require('body-parser')
   ,methodOverride = require('method-override')
   ,mongoose       = require('mongoose');

var app = express();

// configure
app.set('port', process.env.PORT || 3014);
app.use(bodyParser());
app.use(methodOverride());

// Open DB connection
mongoose.connect('mongodb://localhost:27017/geoequipe'); // connect to our database

// Define locals variables
app.locals.queue    = [];
app.locals.running  = false;
app.locals.timeZone = "-3";


// -------------------- Routes --------------------
var router   = express.Router()
   ,task     = require('./route/task')
   ,customer = require('./route/customer')
//   ,signal = require('./route/signal')
//   ,login  = require('./route/login')
//   ,user   = require('./route/user')
;

// middleware to use for all requests
router.use(function(req, res, next) {
  console.log('Requisição recebida de ' + req.ip);
  next();
});

// Home
router.get('/', function(req, res){
    res.end("App rodando... Fila: " + app.locals.queue.length);
});

// Tarefa
router.route('/task')
      .get(task.find)
      .post(task.save);

router.route('/task/:id')
      .get(task.find)
      .put(task.save)
      .delete(task.remove);

router.post('/task/:id/checkin', task.checkIn);
router.post('/task/:id/checkout', task.checkOut);


// Sinal
//app.get('/signal', signal);

// Login
//app.post('/login', login);


//Usuario
//app.route('/user')
//   .get(user.list)
//   .post(user.save)
//   .del(task.remove)
//   ;

//app.get('/message', message); // TODO

app.use('/api', router);

// Launch
app.listen(app.get('port'));
console.log('Listening on port ' + app.get('port'));