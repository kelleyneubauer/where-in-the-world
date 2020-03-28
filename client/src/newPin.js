document.getElementById('postSubmit').addEventListener('click', function(event){

    let req = new XMLHttpRequest();
    let payload = {email: null, address: null};
    let postResponse;
    let url = '/';

    const email = document.getElementById('inputEmail4').value;
    const address = document.getElementById('inputAddress').value;
    const city = document.getElementById('inputCity').value;
    const state = document.getElementById('inputState').value;
    const zip = document.getElementById('inputZip').value;


    // input validation first.
    if(email.validity.typeMismatch || address.validity.typeMismatch || city.validity.typeMismatch || state.validity.typeMismatch || zip.validity.typeMismatch){
        if(email.validity.typeMismatch) {
            email.setCustomValidity("Invalid email.");
        }
        if(address.validity.typeMismatch){
            address.setCustomValidity("Invalid address.");
        }
        if(city.validity.typeMismatch){
            city.setCustomValidity("Invalid city.");
        }
        if(state.validity.typeMismatch){
            state.setCustomValidity("Invalid state.");
        }
        if(zip.validity.typeMismatch){
            zip.setCustomValidity("Invalid zip code.");
        }
    }else {
        email.setCustomValidity("");
        address.setCustomValidity("");
        city.setCustomValidity("");
        state.setCustomValidity("");
        zip.setCustomValidity("");

        payload.email = email;

        payload.address = address;
        payload.address += ' ' + city;
        payload.address += ' ' + state;
        payload.address += ' ' + zip;


        req.open('POST', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', function () {
            if (req.status >= 200 && req.status < 400) {
                postResponse = JSON.parse(req.responseText);
                initMap(postResponse.results);
            } else {
                console.log("Error in network request: " + req.statusText);
            }
        });
        console.log(JSON.stringify(payload));
        req.send(JSON.stringify(payload));
        event.preventDefault();
    }
});