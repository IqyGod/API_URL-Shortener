# API_URL-Shortener
Build A URL Shortener With Node.js, Express, and MongoDB
After setting up a database connection, we create a URL model, which will be used in POST and GET requests to save and redirect URLs.

- Setting up : 
copy link from mongoDB and replace <password> with real pswd. Setting up environment variables.
  
- Url model : 
= new mongoose.Schema({
  name the setting objects and type of values,
  name: type
  })

- Getting the URL parameter : 
Using body parser to parse POST request, and store it into a variable.
  
- POST / GET request: 
POST will insert data into db, GET will retrieve matched information.
