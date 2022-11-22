//for a better load performance
setTimeout(() =>{
    document.querySelector("body").style.opacity = '1';
  },300);
  
/* Global Variables */
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = '7f614a13720f7d880af26e956ad12a94&units=metric'; // Personal API Key for OpenWeatherMap API
const temp = document.getElementById('temp');
const date = document.getElementById('date');
const userInfo = document.getElementById('userInfo');
const generate = document.getElementById('generate');
const zip = document.getElementById('zip');

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1 + '.' + d.getDate() + '.' + d.getFullYear();


// Event listener to add function to existing HTML DOM element
generate.addEventListener('click', performAction);

/* Function called by event listener */
function performAction(event) {
    event.preventDefault();

    //get user input
    const zipCode = zip.value;
    const content = document.getElementById('feelings').value;

    if (zipCode !== '') {
        generate.classList.remove('invalid');
        getWeatherData(baseUrl, zipCode, apiKey)
            .then(function(data) {
                // add data to POST request
                postData('/add', { 
                    temp: data.main.temp,
                    date: newDate,
                    content: content 
                });
            }).then(function() {
                // call updateUI to update browser content
                retrieveData()
            }).catch(function(error) {
                console.log(error);
                alert('The zip code is invalid. Try again');

            });
        userInfo.reset();
    } else {
        generate.classList.add('invalid');
    }


}

/* Function to GET Web API Data*/
const getWeatherData = async(baseUrl, zipCode, apiKey) => {
    // res equals to the result of fetch function
    const res = await fetch(`${baseUrl}?q=${zipCode}&appid=${apiKey}`);
    try {
        // data equals to the result of fetch function
        const data = await res.json();
        return data;
    } catch (e) {
        console.log('error', e);
    }
};

// Async POST
const postData = async (url='', data={})=>{
    const response = await fetch(url, {
        method: 'POST',
        credentials:"same-origin",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(data)
    });
    try {
        const result = await response.json();
        return result;
    }catch (e) {
        console.error(e);
    }
};
// Update user interface

const retrieveData = async () =>{
    const request = await fetch('/all');
    try {
    // Transform into JSON
    const allData = await request.json()
    console.log(allData)
    // Write updated data to DOM elements
    document.getElementById('temp').innerHTML = Math.round(allData.temp)+ '  degrees';
    document.getElementById('content').innerHTML = allData.content;
    document.getElementById("date").innerHTML =allData.date;
    }
    catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
   }

