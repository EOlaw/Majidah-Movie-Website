const User = require('../models/userModels')

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res, next) => {
    try {
        const { name, age, email, username, password } = req.body
        const user = new User({ name, age, email, username, password });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => { //Automatically loggin a new register user once he successful register
            if (err) return next(err);
            res.redirect('/')
        })
    } catch (e) {
        console.log(e)
        res.redirect('register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    res.redirect('/');
    req.session.destroy()
}