var express        = require('express')
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
   ,customer = require('./route/customer')
   ,user     = require('./route/user')
//   ,task     = require('./route/task')
//   ,signal = require('./route/signal')
//   ,login  = require('./route/login')
;

// middleware to use for all requests
router.use(function(req, res, next) {
  console.log('Requisição recebida de ' + req.ip);
  next();
});

// ============= Home =============

app.get('/', function(req, res){
    res.end("App rodando... Fila: " + app.locals.queue.length);
});

// ============= Cliente =============

router.route('/customer')
      .get(customer.find)
      .post(customer.save);

router.route('/customer/:id')
      .get(customer.find)
      .put(customer.save)
      .delete(customer.remove);

// ============= Usuário =============

router.route('/user')
      .get(user.find)
      .post(user.save);

router.route('/user/:id')
      .get(user.find)
      .put(user.save)
      .delete(user.remove);

// ============= Tarefa =============

//router.route('/task')
//      .get(task.find)
//      .post(task.save);

//router.route('/task/:id')
//      .get(task.find)
//      .put(task.save)
//      .delete(task.remove);

//router.post('/task/:id/checkin', task.checkIn);
//router.post('/task/:id/checkout', task.checkOut);

// ============= Sinal =============

//app.get('/signal', signal);

// Login
//app.post('/login', login);


//app.get('/message', message); // TODO

app.use('/api', router);

// Launch
app.listen(app.get('port'));
console.log('Listening on port ' + app.get('port'));