exports.handler = async (event) => {
    try {
        const { orderID } = JSON.parse(event.body); // Get PayPal order ID from request

        if (!orderID) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing order ID" }) };
        }

        // PayPal API Credentials (Store these as Netlify env variables)
        const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
        const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
        const PAYPAL_API = "https://api-m.paypal.com"; // Use sandbox URL in testing: "https://api-m.sandbox.paypal.com"

        // Get OAuth token from PayPal
        const authResponse = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
            method: "POST",
            headers: {
                "Authorization": "Basic " + Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "grant_type=client_credentials"
        });

        const authData = await authResponse.json();
        if (!authData.access_token) {
            return { statusCode: 500, body: JSON.stringify({ error: "Failed to get PayPal access token" }) };
        }

        // Verify Order Details
        const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authData.access_token}`,
                "Content-Type": "application/json"
            }
        });

        const orderData = await orderResponse.json();

        if (orderData.status === "COMPLETED") {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, order: orderData })
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Payment not completed", status: orderData.status })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error", details: error.message })
        };
    }
};
