# Where-in-the-World
OSU Hackathon Project - This web app contains an interactive map for OSU students to pin their geographic location. As students in an online program, it can often feel like you're alone in this battle. Our hope is that this tool will help students foster connections within their local communities.
<p>Created during the spring 2020 hackathon</p>
<p>By: Alexis Chasney, Kelley Neubauer, Andre Paul, and Jason Rash</p>

## Live Version
https://where-in-the-world-osu.herokuapp.com/

---

![whereinworld.gif](whereinworld.gif)

---

## Inspiration
Since the OSU CS post-bacc program is online it can get to where you feel like you are the only person in a 1000 mile radius that is in the program.  Our hope is that it can help people connect with other students that may live nearby. Could be used for planning in-person meet ups or finding a partner for your next group project. 
## What it does
It is an interactive map that shows the location and email of OSU students.  It has a form that you submit your osu email and your address.  The map is then updated with your location as a pin.  If you click on a pin it gives the email associated with that location.
## Who We Are
A group of students who have just completed their 3rd & 4th quarters in the program - all members are just one quarter beyond “new student” category. This was the first hackathon for all team members.
## How We built it
The web app uses the Google Maps Javascript API to display the map, and location markers.  The backend sends the address from the user to the Google Geocoding API and gets back the latitude and longitude along with breaking out the city, and state from the address.  The database holds the email and location of each of the markers in latitude and longitude coordinates.  Then the latitudes and longitudes are sent to the client to update the map.
## What We learned
How to read API documentation get the required items from a JSON response.  How to use Google Maps Javascript API to bring in locations from a database. How to work collaboratively as a team using git.
## What's next for Where In the World
Although we have this set up to be for the OSU Ecampus community, it really can be extended to any other community. We specifically had online learning communities in mind, but any group could use an app like this to greater strengthen their sense of community.
Ideas to extend functionality:
- User login credentials
- Collect additional info from on form submission (name, slack handle, current classes, etc)
- Use geolocation to populate form fields
- Place marker at approximate location rather than directly at home address (for privacy purposes)
- Additional data validation including a check for legitimate OSU email
- More statistics and data visualization
- Fix data visualization progress bar on home page that is supposed to show a cumulative breakdown by state.

---
## Setting up the project locally
Requires Node & npm

1.  Clone the repository
2.  Create one Google Cloud Platform API key restricted to Maps Javascript API.
3.  Replace YOUR_KEY with the key created in and replace the bottom script in index.handlebars with
<code> <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&callback=initMap"></script> </code>
4.  Add a new system environment variable to your computer named GOOGLE_MAPS_API_KEY and set it equal to your Geocoding API key
5.  Save the system environment variable
6.  Create a postgres database locally or create a postgres database using heroku.
7.  Get all the postgres credentials and create system environment variables for DB_HOST, DB_USER, DB_NAME, DB_PW, DB_PORT.
7.  Download and install Node.js if you do not have it installed from https://nodejs.org/en/
7.  Open the terminal and navigate to Where-in-the-World folder, then type <code>npm install</code>
9.  <code>npm start</code>
11. Open up localhost:5000 in your browser to run the app.

