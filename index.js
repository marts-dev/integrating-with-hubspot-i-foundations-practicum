const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_KEY;
const baseUrl = 'https://api.hubspot.com'
// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get('/', async (req, res) => {
    const cars = `${baseUrl}/crm/v3/objects/cars?limit=10&properties=model&properties=make&properties=color&properties=vin&properties=year`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    const errorMessage = req.query.error;
    const successMessage = req.query.success;
    try {
        const resp = await axios.get(cars, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Cars | HubSpot APIs', error: errorMessage, success: successMessage, data });      
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})
// * Code for Route 1 goes here

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get('/update-cobj', async (req, res) => {
    const cars = `${baseUrl}/crm/v3/objects/cars?limit=10&properties=model&properties=make&properties=color&properties=vin&properties=year`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(cars, { headers });
        const data = resp.data.results;
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', data });      
    } catch (error) {
        console.error(error);
    }
})
// * Code for Route 2 goes here

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
app.post('/update-cobj', async (req, res) => {
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const cars = `${baseUrl}/crm/v3/objects/cars`;
        const resp = await axios.post(cars, {properties: req.body}, { headers });
        res.redirect("/?success="+encodeURIComponent("Car successfully created."));      
    }catch (error) {
        console.error(error.message);
        res.redirect("/?error="+encodeURIComponent(error.message+": Failed to create car."));
    }
})

app.post('/update-cobj/:id', async (req, res) => {
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const cars = `${baseUrl}/crm/v3/objects/cars/${req.params.id}`;
        const resp = await axios.patch(cars, {properties: req.body}, { headers });
        res.redirect("/?success="+encodeURIComponent("Car successfully updated."));      
    }catch (error) {
        console.error(error);
        res.redirect("/?error="+encodeURIComponent(error.message+": Failed to update car."));
    }
})
// * Code for Route 3 goes here



// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));