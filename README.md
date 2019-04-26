# Feira da Fruta

## Setup
Edit src/config.json to set the server location:
```javascript
{
    "api": "http://localhost", // <SERVER_URL_HERE>
    "port": 4600, // <SERVER_PORT_HERE>
    "uri": "/api" //<SERVER_API_URI_HERE>
}
```

## Routes

### http://localhost:3000/search

#### URL Parameters:
 - q: name of the product
 - min: minimum price
 - max: maximum price
 - c: "FRUIT" or "VEGETABLE"
 - imported: if imported.

### http://localhost:3000/product/:id

Access page for the :id product.

### http://localhost:3000/register-food

Access page of creating a new product.
