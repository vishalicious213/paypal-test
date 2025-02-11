paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '10.00' // Set the amount dynamically as needed
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert('Transaction completed by ' + details.payer.name.given_name);
            console.log(details); // Log transaction details for debugging
        });
    },
    onError: function(err) {
        console.error('PayPal Checkout Error:', err);
    }
}).render('#paypal-button-container');
