const express = require('express')
const cors = require('cors')
const app = express();


const allroutes = require('./routes/routes')
const { ErrorHandler } = require('./middleware/ErrorHandler');
const morgan = require('morgan');


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors())
app.use(express.json())
app.use(ErrorHandler)

app.get("/", (req, res) => {
  res.send("Hello world!");
});
app.use('/api', allroutes);


app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
