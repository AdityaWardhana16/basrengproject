const express = require('express');
const bodyParser = require('body-parser');
const midtransClient = require('midtrans-client');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Midtrans configuration
const snap = new midtransClient.Snap({
  isProduction: false, // Set to true for production
  serverKey: 'SB-Mid-server-uUYq993Y52YQXPP2XJ1mSmR_', // Ganti dengan server key Anda
});

// Endpoint untuk mendapatkan Snap Token
app.post('/get-snap-token', async (req, res) => {
  const { items, total_price } = req.body;

  // Prepare the transaction details
  const transactionDetails = {
    transaction_details: {
      order_id: 'ORDER-' + Math.round(new Date().getTime() / 1000), // Unique order ID
      gross_amount: total_price, // Total price
    },
    item_details: items.map(item => ({
      id: item.id,
      price: item.price,
      quantity: item.quantity,
      name: item.name,
    })),
    customer_details: {
      first_name: 'Customer',
      last_name: 'Name',
      email: 'customer@example.com',
      phone: '08123456789',
    },
  };

  try {
    const transaction = await snap.createTransaction(transactionDetails);
    res.status(200).json({ token: transaction.token });
  } catch (error) {
    console.error('Midtrans Error:', error.message);
    res.status(500).json({ error: 'Failed to create transaction.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
