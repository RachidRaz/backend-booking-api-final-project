const express = require('express')
const cors = require('cors')
const morgan = require('morgan');
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV || 'development'
});

const app = express();
const loginRoutes = require('./routes/loginRoutes')
const userRoutes = require('./routes/userRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const hostRoutes = require('./routes/hostRoutes')
const propertyRoutes = require('./routes/propertyRoutes')
const amenityRoutes = require('./routes/amenityRoutes')
const reviewRoutes = require('./routes/reviewRoutes')


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors())

// test endpoint
app.get("/ping", (req, res) => {
  res.send("pong");
});

// categorizing type specific routes for the API
app.use('/login', loginRoutes);
app.use('/users', userRoutes);
app.use('/bookings', bookingRoutes);
app.use('/hosts', hostRoutes);
app.use('/properties', propertyRoutes);
app.use('/amenities', amenityRoutes);
app.use('/reviews', reviewRoutes);

app.use(Sentry.Handlers.errorHandler());

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
