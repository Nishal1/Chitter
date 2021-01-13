const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash'); 
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const ExpressError = require('./utils/ExpressError');
//const MongoDBStore = require('connect-mongo')(session);
const User = require('./models/user');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const profileRoutes = require('./routes/profile');
const dbUrl = 'mongodb://localhost:27017/chitter';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.set('useFindAndModify', false);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(mongoSanitize());

const secret = 'thishsouldbeanactualsecret';

// const store = new MongoDBStore({
//     url: dbUrl,
//     secret,
//     touchAfter: 24 * 60 * 60
// });

// store.on('error', function (e) {
//     console.log('SESSION STORE ERROR', e);
// })


const sessionConfig = {
   // store,
    name: 'session',
    secret,
    resave: false,
    //secure: true
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //this is an extra security thing
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');  
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res) => {
    res.render('home');
});


app.use('/posts', postRoutes);
app.use('/posts/:id/comments', commentRoutes);
app.use('/profile/:id', profileRoutes); //id is author id
app.use('/', userRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('PAGE NOT FOUND', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Oh no, Something went wrong!";
    
    res.status(statusCode).render('error', { err });
});

const port = 3000;
app.listen(port, () => {
    console.log(`LISTENING TO PORT ${port}`);
});