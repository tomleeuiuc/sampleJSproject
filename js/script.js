"use strict";
let debounceTimer;

/*
*
* This script is used in the project
* It searches for country information by IP (converts from URL)
* It displays the information as a list in index.html
*
* */

async function getIPv4FromUrl(inputVal){
    try{
        let url = await fetch(`https://dns.google/resolve?name=${inputVal}&type=A`);
        const data = await url.json();

        console.log(url);
        console.log(data);

        if (!(data["Status"] === 0)) {
            console.warn("Failed to get IPv4 from URL");
            return;
        }

        return data["Answer"][0].data;

    } catch (e) {
        console.warn("IPv4 from URL process failed");
        return;
    }
}

function isValidIPv4(input) {
    const ipv4Regex = /^(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)){3}$/;
    return ipv4Regex.test(input);
}


// Fetch geolocation data for the input IP or domain
async function getResponseObject() {
    let inputVal = document.getElementById("ip-or-url").value.trim();
    let ip;
    if (isValidIPv4(inputVal)) {
        ip = inputVal;
    } else  {
        ip = await getIPv4FromUrl(inputVal);
    }
    if (!ip) {
        console.warn("Invalid IP or URL:", data.message)
        return;
    }

    try {
        const response = await fetch(`https://ipwho.is/${ip}`);
        const data = await response.json();

        if (!data.success) {
            console.warn("IP info not found:", data.message);
            return;
        }

        //clean fields
        document.getElementById("country").value = '';
        document.getElementById("countryCode").value = '';
        document.getElementById("regionName").value = '';
        document.getElementById("city").value = '';
        document.getElementById("zip").value = '';
        document.getElementById("lat").value = '';
        document.getElementById("lon").value = '';
        document.getElementById("timezone").value = '';
        document.getElementById("isp").value = '';
        document.getElementById("org").value = '';
        document.getElementById("asn").value = '';

        //fill fields
        document.getElementById("country").value = data.country || "";
        document.getElementById("countryCode").value = data["country_code"] || "";
        document.getElementById("regionName").value = data.region || "";
        document.getElementById("city").value = data.city || "";
        document.getElementById("zip").value = data["postal"] || "";
        document.getElementById("lat").value = data.latitude || "";
        document.getElementById("lon").value = data.longitude || "";
        document.getElementById("timezone").value = data.timezone.id|| "";
        document.getElementById("isp").value = data.connection.isp || "";
        document.getElementById("org").value = data.connection.org || "";
        document.getElementById("asn").value = data.connection.asn || "";

        displayFlag(data["country_code"] || "");
        document.getElementById("csset").style.visibility = "visible";
    } catch (error) {
        console.error("Error fetching IP details:", error);
    }
}

// Update the flag image directly without an XHR/fetch call
function displayFlag(countryCode) {
    const flagContainer = document.getElementById("flag-img");
    if (!countryCode) {
        flagContainer.innerHTML = "";
        return;
    }
    let cc = countryCode.toLowerCase();
    flagContainer.innerHTML = `<img src="https://cdn.ipwhois.io/flags/${cc}.svg" alt="Flag for ${countryCode}" />`;
}

// Wait 500ms after the user stops typing before calling the API
function checkInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        getResponseObject();
    }, 2000);
}

window.onload = function () {
    let ipOrUrl = document.getElementById("ip-or-url");
    ipOrUrl.addEventListener("input", checkInput);
}
