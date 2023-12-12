const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require("bcrypt");
const {collection_admin, collection_student} = require('./mongodb');


const port = 3000;
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/styles'));

app.get("/", (req, res) => {
    res.render('login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});


app.post('/users/login', async (req, res) => {
    const { name, password } = req.body;
    if(req.body.role =='student'){
        console.log(req.body.role);

        let errors = [];

        if (!name || !password) {
            errors.push({ message: "Please enter both username and password" });
            res.render('login', { errors });
            return;
        }

        const user = await collection_student.findOne({ "name": name });

        if (!user) {
            errors.push({ message: "User not found. Please check your username and try again." });
            res.render('login', { errors });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            errors.push({ message: "Incorrect password. Please try again." });
            res.render('login', { errors });
            return;
        }

        // Login successful, you can set a session or token here
        res.render('Dashboard');
    } else{
        console.log(req.body.role);

        let errors = [];

        if (!name || !password) {
            errors.push({ message: "Please enter both username and password" });
            res.render('login', { errors });
            return;
        }

        const user = await collection_admin.findOne({ "name": name });

        if (!user) {
            errors.push({ message: "User not found. Please check your username and try again." });
            res.render('login', { errors });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            errors.push({ message: "Incorrect password. Please try again." });
            res.render('login', { errors });
            return;
        }

        // Login successful, you can set a session or token here
        res.render('Dashboard');
    } 
});


app.post('/users/register', async (req, res) => {
    let { username, email, password, password2 , role} = req.body;
    let errors = [];

    if (!username || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
    }

    if (password.length < 6) {
        errors.push({ message: "Password should be at least 6 characters" });
    }

    if (password !== password2) {
        errors.push({ message: "Passwords do not match" });
    }

    // Form validation is passed
    let hashedPassword = await bcrypt.hash(password, 10);

    const data = {
        name: username,
        email: email,
        password: hashedPassword
    }
    if(role==='student'){
        
    const existingUser = await collection_student.findOne({ "name": data.name });

    if (existingUser) {
        errors.push({ message: "User already exists. Try to login" });
    }

    if (errors.length > 0) {
        res.render('signup', { errors });
    } else {
        await collection_student.insertMany(data);
        res.render('login'); // Change '/dashboard' to the actual route of your dashboard
    }
    } else {
        
    const existingUser = await collection_admin.findOne({ "name": data.name });

    if (existingUser) {
        errors.push({ message: "User already exists. Try to login" });
    }

    if (errors.length > 0) {
        res.render('signup', { errors });
    } else {
        await collection_admin.insertMany(data);
        res.render('login'); // Change '/dashboard' to the actual route of your dashboard
    }
    }
});


app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
