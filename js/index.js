"use strict";

let httpRequest = false;

function getRequestObject() {
    try {
        httpRequest = new XMLHttpRequest();
    }
    catch (requestError) {
        return false;
    }
    return httpRequest;
}

function checkInput() {
    // TODO: input cleaning methods
    let input = document.getElementById("ip-or-url").value.trim();
    getResponseObject();
}

function getResponseObject() {
    let input = document.getElementById("ip-or-url").value.trim();
    if (!httpRequest) {
        httpRequest = getRequestObject();
    }
    httpRequest.abort();

    httpRequest.open("GET", `http://ip-api.com/json/${input}`, true);

    httpRequest.send();

    httpRequest.onreadystatechange = displayUrlIpInfo;
}

function getClientIP () {
    if (!httpRequest) {
        httpRequest = getRequestObject();
    }
    httpRequest.abort();

    httpRequest.open("GET", "http://ipv4.jsonip.com/", true);

    httpRequest.send();

    httpRequest.onreadystatechange = initialIP;
}

function initialIP() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        let data = JSON.parse(httpRequest.responseText);

        document.getElementById("ip-or-url").value = data["ip"];
    }
}

function displayUrlIpInfo() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        let data = JSON.parse(httpRequest.responseText);
        // country
        document.getElementById("country").value = data["country"];
        // countryCode
        document.getElementById("countryCode").value = data["countryCode"];
        // regionName
        document.getElementById("regionName").value = data["regionName"];
        // city
        document.getElementById("city").value = data["city"];
        // zip
        document.getElementById("zip").value = data["zip"];
        // lat
        document.getElementById("lat").value = data["lat"];
        // lon
        document.getElementById("lon").value = data["lon"];
        // timezone
        document.getElementById("timezone").value = data["timezone"];
        // isp
        document.getElementById("isp").value = data["isp"];
        // org
        document.getElementById("org").value = data["org"];
        // as
        document.getElementById("as").value = data["as"];
        // flag -> enter country code to function
        getFlagImage(data['countryCode']);

        document.getElementById("csset").style.visibility = "visible";
    }
}

function getFlagImage (countryCode) {
    if (!httpRequest) {
        httpRequest = getRequestObject();
    }
    httpRequest.abort();
    httpRequest.open("GET", `https://flagsapi.com/${countryCode}/flat/64.png`, true);
    httpRequest.send();
    httpRequest.onreadystatechange = () => displayFlag(countryCode);
}

function displayFlag (countryCode) {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        document.getElementById("flag-img").innerHTML =
            `<img src= "https://cdn.ipwhois.io/flags/${countryCode.toLowerCase()}.svg" alt="Flag for ${countryCode}" />`;
    }
}


window.onload = function () {
    let countryFlag = document.getElementById("flag-img");
    let ipOrUrl = document.getElementById("ip-or-url");
    countryFlag.addEventListener("submit", checkInput, false);
    ipOrUrl.addEventListener("submit", checkInput, false);
    getClientIP();
}