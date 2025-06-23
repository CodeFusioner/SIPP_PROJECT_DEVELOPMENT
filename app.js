const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vehicleDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define Vehicle Schema
const vehicleSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    description: String,
    brand: String
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
// Home route - List all vehicles
app.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find({});
        res.render('index', { vehicles: vehicles });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Show form to create new vehicle
app.get('/vehicles/new', (req, res) => {
    res.render('new');
});

// Create new vehicle
app.post('/vehicles', async (req, res) => {
    try {
        const newVehicle = new Vehicle({
            name: req.body.name,
            price: req.body.price,
            image: req.body.image,
            description: req.body.description,
            brand: req.body.brand
        });
        await newVehicle.save();
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Show specific vehicle
app.get('/vehicles/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        res.render('show', { vehicle: vehicle });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Show form to edit vehicle
app.get('/vehicles/:id/edit', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        res.render('edit', { vehicle: vehicle });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update vehicle
app.put('/vehicles/:id', async (req, res) => {
    try {
        await Vehicle.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            price: req.body.price,
            image: req.body.image,
            description: req.body.description,
            brand: req.body.brand
        });
        res.redirect(`/vehicles/${req.params.id}`);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete vehicle
app.delete('/vehicles/:id', async (req, res) => {
    try {
        await Vehicle.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
