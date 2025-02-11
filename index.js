paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '10.00' // Set the amount dynamically as needed
                }
            }]
        })
    },
    // onApprove: function(data, actions) {
    //     return actions.order.capture().then(function(details) {
    //         alert('Transaction completed by ' + details.payer.name.given_name)
    //         console.log(details); // Log transaction details for debugging
    //     })
    // },
    onApprove: function (data) {
        return fetch('/.netlify/functions/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("Payment successful!");
                console.log("Order details:", result.order)
            } else {
                alert("Payment failed: " + result.error)
            }
        })
        .catch(err => console.error("Payment verification failed:", err))
    },
    onError: function(err) {
        console.error('PayPal Checkout Error:', err)
    }
}).render('#paypal-button-container')