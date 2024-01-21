require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));
app.use('/Views', express.static(path.join(__dirname, 'Views')));


app.get('/about', (req, res) => {
    res.render('about.ejs')
})



let User = require('./models/user');
let Message = require('./models/message');
let Doctor = require('./models/doctor')
let News = require('./models/news')
let Pet = require('./models/pet')

let db = process.env.DB_NAME;
let username = process.env.DB_USER;
let password = process.env.DB_PASSWORD;
let port = process.env.PORT;
let secret = process.env.SECRET

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(session({secret: secret,
                resave: false,
                saveUninitialized: true,
                cookie: { maxAge: 60000 }
}));

app.use(flash());

mongoose.connect('mongodb+srv://'+ username +':'+ password +'@atlascluster.izbplrr.mongodb.net/' + db)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use((req, res, next) => {
    res.locals.username = req.session.username ? true : false;
    res.locals.doctor = req.session.doctor ? true : false;
    res.locals.email = req.session.email;
    next();
    console.log(res.locals.email)
});


app.post('/register', async (req, res) => {
    const existingUser = await User.findOne({ $or: [{ 'username': req.body.username }, { 'email': req.body.email }] }).exec();
    if (existingUser) {
        return res.json({ "result": "error", "message": "Username or email is already taken" });
    }

 
    if (req.body.username.length < 6) {
        return res.json({ "result": "error", "message": "Username must be at least 6 characters long" });
    }

    if (req.body.password.length < 6 || !/\d/.test(req.body.password) || !/[a-zA-Z]/.test(req.body.password)) {
        return res.json({ "result": "error", "message": "Password must be at least 6 characters long and contain both letters and numbers" });
    }

    let saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        dateOfBirth: req.body.dateOfBirth,
        fullName: req.body.fullName
    });

    res.redirect('/homepage');
});


app.post('/registerPet', async (req, res) => {

    await Pet.create({
        name: req.body.name,
        vaccines: req.body.vaccines,
        species: req.body.species,
        sex: req.body.sex,
        ownerEmail: req.body.ownerEmail,
        dateOfBirth: req.body.dateOfBirth
    });

    res.redirect('/pets');
});

app.get('/pets', async (req, res) => {
    try {
        const pets = await Pet.find().sort({ createdAt: -1 }).exec();
        res.render('pets', { pets }); // Pass pets to the view template
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve pets' });
    }
});

app.get('/pets_doctor', async (req, res) => {
    try {
        const pets = await Pet.find().sort({ createdAt: -1 }).exec();
        res.render('pets_doctor', { pets }); // Pass pets to the view template
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve pets' });
    }
});


app.post('/login', async (req, res) => {
    const existingUser = await User.findOne({ 'username': req.body.username }).exec();
    if (!existingUser) {
        return res.json({ "result": "user not found" });
    }

    bcrypt.compare(req.body.password, existingUser.password)
        .then(result => {
            if (result) {
                req.session.username = req.body.username;
                req.session.email = existingUser.email; // Set email from existingUser
                Doctor.findOne({ 'doctor_username': req.body.username }).exec()
                    .then(doctor => {
                        if (doctor) {
                            req.session.doctor = true;
                        } else {
                            req.session.doctor = false; // Set req.session.doctor to false if user is not a doctor
                        }
                        return res.redirect('/homepage');
                    })
                    .catch(error => {
                        console.error(error);
                        return res.json({ "result": "error" });
                    });
            } else {
                return res.json({ "result": "wrong password" });
            }
        });
});


app.post('/submit-message', async (req, res) => {
    const currentDate = new Date(); // Get the current date and time
    await Message.create({
        name: req.body.name,
        email: req.body.email,
        text: req.body.message,
        createdAt: currentDate // Assign the current date to the 'createdAt' field
    });

    req.flash('message', 'Your message was submitted successfully!');
    res.redirect('/contacts');
});


app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 }).exec();
        res.render('messages', { messages }); // Pass messages to the view template
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});


app.get('/news', async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 }).exec();
        res.render('news', { news }); // Pass news to the view template
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve news' });
    }
});



app.get('/logout', (req, res) =>{
    req.session.destroy();
    res.redirect('homepage');
});


app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/homepage', (req, res) => {
    res.render('homepage');
});

app.get('/pets', (req, res,) =>{
    res.render('pets');
})

app.get('/contacts', (req, res,) =>{
    res.render('contacts', { messages: req.flash() });
})

app.get('/messages', (req, res) => {
    res.render('messages');
})

app.get('/services', (req, res) => {
    res.render('services');
})


app.get('/news', (req, res) => {
    res.render('news');
})

app.get('/register_pet', (req, res) => {
    res.render('register_pet');
})

app.get('/pets_doctor', (req, res) => {
    res.render('pets_doctor');
})