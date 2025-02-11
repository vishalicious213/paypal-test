# PayPal Checkout JavaScript integration

- __PayPal Checkout__ can be added to the front-end. Your `PayPal Client ID` will be used to identify you as a vendor. This ID is public-facing, so its ok it its exposed on the frontend.
    - The PayPal Client ID is global to the website or project and represents the storefront's identity on PayPal
    - Each PayPal application (storefront) has its own Client ID, which you get from the PayPal Developer Dashboard
    - The Client ID is safe to use in the frontend because it's only for identifying the PayPal account
        - For security, payment validation and order fulfillment should be handled server-side
        - If someone finds your Live Client ID, they still can’t withdraw money, but they could attempt test payments in unauthorized ways
        - Verify payments on the backend before delivering products or services
    - Even though the Client ID is public, only your backend should confirm successful payments before delivering a product/service
- A script is called which renders the PayPal buttons into a \<div> with an ID