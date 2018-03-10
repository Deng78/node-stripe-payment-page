const express = require('express');
const bodyParser = require('body-parser');
const db = require('mongoose');
const path = require('path');
const pug = require('pug');

const Customer = require('./models/customer.js')
const Transaction = require('./models/transaction.js')

const keyPublishable = 'pk_test_bDZim9XpwhOvUFr7P7A8afn1';
const keySecret = 'sk_test_hj5E2TLUihVrzY5gGkUPJWM9';

const app = express();
const stripe = require("stripe")(keySecret);

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to DB
db.connect('mongodb://localhost:27017/payment', (err, db) =>{
  if(err){ 
      throw err
  }
})
db.connection.on('connected', () => console.log(`Database Connected`))
db.connection.on('error', (err) => console.log(`Error: ${err}`))

// PUG 
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.get('/', (req, res) =>{
  res.render("index");
})

app.use(express.static('public'))
app.get('/success', (req,res) =>{
    let query = req.query;
    res.render('success', {
      transaction: req.query
    })
})

app.post('/charge', (req,res) =>{
  let amount = 5000;

  stripe.customers.create({
    email: req.body.email,
    source: req.body.stripeToken
  })
  .then(customer => {
    let customerData = {
      id: customer.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    }
    // Insert data to user
    Customer.create(customerData, function (err, customer) {
      if (err) {
        if (err.code === 11000) {
          // Duplicate username
          // return res.status(403).send({MSG: 'Customer Already Exist!'});
          // DO Nothing and continue
        }else if(err.code != 11000){ 
          return res.status(500).send(err);
        }
        } else {
        console.log({MSG: 'Customer Created Successfully'})
      }
    })
    stripe.charges.create({
      amount,
      description: "Sample Charge",
         currency: "aud",
         customer: customer.id
    })
    // Save Transaction to Db then Redirect to success page
    .then(charge => {
      let transactionData = {
        id: charge.id,
        customerID: charge.customer,
        product: charge.description,
        amount: charge.amount,
        currency: charge.currency,
        status: charge.status
      }
      // Insert data to user
      Transaction.create(transactionData, function (err, customer) {
        if (err) {
          return res.status(500).send(err);
        } else{
          console.log({MSG: 'Transaction Created Successfully'})
        }
      })
      res.redirect(`/success?id=${charge.id}&product=${charge.description}&amount=${charge.amount}`)
    })
  })
})

app.get('/customers', (req, res) => {
  Customer.find(function(error, document) {
      if (error || !document) {
        console.log(error)
      } else {
            // res.send(document);
            res.render('customers', {
              customers: document
            })
          }
  })
})

app.get('/transactions', (req, res) => {
  Transaction.find(function(error, document) {
      if (error || !document) {
        console.log(error)
      } else {
          console.log(document)
            res.render('transactions', {
              transactions: document
            })
          }
  })
})

app.listen(8080, () => console.log('server started on port 8080'))