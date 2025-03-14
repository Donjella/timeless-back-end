// @desc    Create a new payment
// @route   POST /api/payments
// @access  Private
const createPayment = asyncHandler(async (req, res) => {
  const { rental_id, amount, payment_method } = req.body;

  if (!rental_id || !amount || !payment_method) {
    res.status(400);
    throw new Error('All fields are required');
  }

  // Ensure the rental exists
  const rental = await Rental.findById(rental_id);
  if (!rental) {
    res.status(404);
    throw new Error('Rental not found');
  }

  // Create a new payment
  const payment = await Payment.create({
    rental_id,
    amount,
    payment_method,
    payment_status: 'Paid',
  });

  res.status(201).json(payment);
});
