const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const keyPublishable = 'pk_test_bDZim9XpwhOvUFr7P7A8afn1';
const keySecret = 'sk_test_hj5E2TLUihVrzY5gGkUPJWM9';

const app = express();
const stripe = require("stripe")(keySecret);

// body parser middleware
app.use(bodyParser.urlencoded({extented:false}));

app.use(express.static('public'))

app.get('/success', (req,res) =>{
    let query = req.query;
    res.send(query)
})

app.post('/charge', (req,res) =>{
    let amount = 5000;

  stripe.customers.create({
    email: req.body.email,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
         currency: "aud",
         customer: customer.id
    }))
    // Redirect to success page
  .then(charge => res.redirect(`/success?id=${charge.id}&product=${charge.description}&amount=${charge.amount}`))
})

app.listen(8080, () => console.log('server started on port 8080'));