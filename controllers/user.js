const User = require('../models/user');
const emailSender = require('../utils/sendEmail');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.renderRegister = (req, res) => {
    res.render('users/register', { page: 'register' });
};

module.exports.register = async (req, res, next) => {
    try {
        const {
            username,
            email,
            password,
            FirstName,
            LastName,
            location,
            bio,
            gender,
        } = req.body;

        const geoData = await geocoder
            .forwardGeocode({
                query: location,
                limit: 1,
            })
            .send();

        const user = new User({
            username,
            email,
            FirstName,
            LastName,
            location,
            bio,
            gender,
        });
        user.geometry = geoData.body.features[0].geometry;
        const newUser = await User.register(user, password);

        req.login(newUser, (err) => {
            if (err) return next(err);
            emailSender.sendMail(user);
            req.flash('success', 'Welcome to Chitter');
            res.redirect('/posts');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login', { page: 'login' });
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/posts';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/login');
};
