/*******************************************************************************
 * 
 * File:	server.js
 * Author:	Team Divided by 0
 * Date:	3/27/2020
 * 
 * Description: 
 * Herein are all the server functions to connect the client with the database.
 * We used a Postgres database hosted on Heroku. We used handlebars to render
 * our pages and several handles to query the database and receive up-to-date
 * information for graphs, tables, and maps. 
 * 
 * In our post request, we query the google geo services API to receive the 
 * corresponding latitude and longitude for the provided address. We store that
 * information, along with city, state, and email, in our database.
 * 		
 ******************************************************************************/

 var express = require('express');
const Client = require("@googlemaps/google-maps-services-js").Client;
var app = express();
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

const port = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//static files
app.use(express.static('client'));

//handlbars
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//database connection (local)
const { Pool } = require('pg');

// heroku database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PW,
  port: process.env.DB_PORT,
  ssl: true,
});

app.listen(port, () => console.log(`Listening on port ${port}`));

/*******************************************
 * handle: for homepage load
 * 
 * parameters: none
 * 
 * returns: renders index page
 ********************************************/

app.get("/", function(req, res){
  res.render("index");
});

/*******************************************
 * handle: for stats page
 * 
 * parameter: receives query parameter from client
 * 
 * returns: returns grouped data by city/state or
 * by state depending on query parameter
 ********************************************/

app.get("/dataTable", function(req, res){
  let context = {};
  let result = [];

  console.log('req', req.query);
  if(req.query.type === 'city'){
    pool.query("SELECT (city || ', ' || state) as city, count(id) as total FROM maps GROUP BY 1 ORDER BY 2 DESC, 1", (err, rows) => 
    {
      if(err){
          console.log(err);
          return;
      }
      else{
        result = rows.rows;

        context.results = JSON.stringify(result);
        res.send(context);
      }
    });
  }
  else if(req.query.type === 'state'){
    pool.query("SELECT state, count(id) as total FROM maps GROUP BY state ORDER BY total DESC, 1", (err, rows) => 
      {
        if(err){
            console.log(err);
            return;
        }
        else{
          result = rows.rows;

          context.results = JSON.stringify(result);
          res.send(context);
        }
      });
  }
});

/*******************************************
 * handle: for index page
 * 
 * parameter: none
 * 
 * returns: renders index page
 ********************************************/

app.get ("/index", function(req, res){
    res.render("index");
});

//get data middle route
app.get ("/getdata", function(req, res){
  let context = {};
  let result = [];
  pool.query("SELECT * FROM maps", (err, rows) =>
  {
    if(err){
      console.log(err);
      return;
    }
    result = rows.rows;
    // console.log("rows: ", result);
    context.results = JSON.stringify(result);
    // res.render("index", context);
    res.send(context);
  });
});

/*******************************************
 * handle: for about page
 * 
 * parameter: none
 * 
 * returns: renders about page
 ********************************************/
app.get ("/about", function(req, res){
  res.render("about");
});

/*******************************************
 * handle: for stats page
 * 
 * parameter: none
 * 
 * returns: renders stats page
 ********************************************/
app.get ("/stats", function(req, res){
  res.render("stats");
});

/*******************************************
 * handle: for post requests; takes data 
 * from post and inserts into database or
 * updates existing database entry
 * 
 * parameter: latitude, longitude, city, state,
 * country, email
 * 
 * returns: all data currently in database,
 * including recently input/updated data
 ********************************************/

app.post ("/", async (request, response) => {
  const email = request.body.email;
  const address = request.body.address;
  console.log(address);
  var latitude;
  var longitude;
  var city;
  var state;
  var country;
  var streetNumber;
  var streetRoute;
  var zipCode;

  const client = await new Client({address});

  client
    .geocode({
      params: {
        address: `${address}`,
        key: process.env.GOOGLE_MAPS_API_KEY
      },
      timeout: 1000 // milliseconds
    })
    .then(r => {

      //if we didn't get any results back, send back no response flag
      if (r.data.results.length === 0)
      {
        var context = {};
        context.noResults = JSON.stringify([{'noResults':true}]);
        response.send(context);
      }

      //if we get a response, proceed with rest of handle
      else{
        latitude = r.data.results[0].geometry.location.lat;
        longitude = r.data.results[0].geometry.location.lng;
        // loop through address_components to look for data of a specific type
        for (let i = 0; i < r.data.results[0].address_components.length; i++) {
          if (r.data.results[0].address_components[i].types[0] == "locality") {
            city = r.data.results[0].address_components[i].long_name;
          }
          else if (r.data.results[0].address_components[i].types[0] == "administrative_area_level_1") {
            state = r.data.results[0].address_components[i].long_name;
          }
          else if (r.data.results[0].address_components[i].types[0] == "country") {
            country = r.data.results[0].address_components[i].long_name;
          }
          else if (r.data.results[0].address_components[i].types[0] == "street_number"){
            streetNumber = r.data.results[0].address_components[i].long_name;
          }
          else if (r.data.results[0].address_components[i].types[0] == "route"){
            streetRoute = r.data.results[0].address_components[i].long_name;
          }
          else if (r.data.results[0].address_components[i].types[0] == "postal_code"){
            zipCode = r.data.results[0].address_components[i].long_name;
          }
        }

        console.log("latitude ", latitude, "longitude ", longitude);
        console.log("city ", city, "state ", state, "country ", country, "street", streetNumber, "route", streetRoute);

        var results = [];

        results.push({"latitude": latitude,
          "longitude": longitude,
          "city": city,
          "state": state,
          "country": country,
          "streetNumber": streetNumber,
          "streetRoute": streetRoute,
          "zipCode": zipCode
        });

        var context = {}; //for returning to post request

        context.results = JSON.stringify(results);

        //inserts all data from post into database
        pool.query("SELECT email FROM maps WHERE lower(email) = lower($1)", 
          [email], function(err, rows){
            if(err){
                console.log(err);
                return;
            }
            else{

              //subquery if we already have email
              //update email, then send back new db contents
              if (rows.rows.length > 0){

                //inserts all data from post into database
                pool.query("UPDATE maps SET latitude = $1, longitude = $2, city = $3, state = $4 WHERE email = $5", 
                  [latitude, longitude, city, state, email], function(err){
                    if(err){
                        console.log(err);
                        return;
                    }
                    else{
                      context.dbHasEmail = JSON.stringify([{'dbHasEmail':true}]);
                      context.noResults = JSON.stringify([{'noResults':false}]);

                      response.send(context);
                    }
                  });
              }

              //otherwise we don't have email so perform insert
              else{
                //inserts all data from post into database
                pool.query("INSERT INTO maps(latitude, longitude, city, state, email) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
                  [latitude, longitude, city, state, email], function(err){
                    if(err){
                        console.log(err);
                        return;
                    }
                    else{
                        context.dbHasEmail = JSON.stringify([{'dbHasEmail':false}]);
                        context.noResults = JSON.stringify([{'noResults':false}]);

                        console.log(context);

                        response.send(context);
                    }
                  });
              }
            }
          });
      }
    })
    .catch(e => {
      console.log("e ", e);
    });
    
})