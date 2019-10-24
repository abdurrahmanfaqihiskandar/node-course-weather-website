const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public'); // node native method
const viewsPath = path.join(__dirname, '../templates/views'); // node native method
const partialsPath = path.join(__dirname, '../templates/partials');

// Set up handlebars engine and views location
app.set('view engine', 'hbs'); // express method to work with handlebars npm
app.set('views', viewsPath); // express method to access views templates
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath)); // express method for static web pages

// Dynamic home page
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Faqih'
    });
})

// Dynamic about page
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Faqih'
    });
})

// Dynamic help page
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'Faqih'
    });
})

// Weather page
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Please provide an address'
        });
    } else {
        geocode(req.query.address, (error, { latitude, longtitude, location } = {}) => {
            // If there is any error with the geocode
            if (error) {
                return res.send({ error });
            }
            
            // Geocode all good
            forecast(latitude, longtitude, (error, forecastData) => {
                // If there is any error with the forecast data
                if (error) {
                    return res.send({ error });
                }
                
                // Geocode and forecast data all good
                res.send({
                    forecast: forecastData.forecast,
                    location,
                    tempHighLow: `${location} will have a temperature high of ${forecastData.tempHigh} degrees and a temperature low of ${forecastData.tempLow} degrees`
                }); // end send
            }); // end forecast
        }); // end geocode
    }; // end else
}); // end app.get

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        });
    };
});

// ERROR 404 not found
// 404 from help page
app.get('/help/*', (req, res) => {
    res.render('error', {
        title: '404',
        errorMsg: 'Help article not found'
    });
});

// 404 everything else
app.get('*', (req, res) => {
    res.render('error', {
        title: '404',
        errorMsg: 'Page not found'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});