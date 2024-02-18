let api;
let apiKey;

let interval = setInterval(() => {
  showTime();
}, 1000);

// selectors
const wrapper = document.querySelector(".wrapper"),
  inputPart = document.querySelector(".input-part"),
  infoTxt = document.querySelector(".info-txt"),
  inputField = document.querySelector("#inputCityName"),
  locationBtn = document.querySelector("#get-device-location"),
  weatherPart = wrapper.querySelector(".weather-part"),
  wIcon = weatherPart.querySelector("img"),
  arrowBack = wrapper.querySelector("header i"),
  GetUserEnterLocationBtn = document.querySelector("#get-user-enter-location"),
  searchIconBtn = document.querySelector(".fa-magnifying-glass"),
  showMoreDetailsBtn = document.querySelector("#show-more"),
  showLessDetailsBtn = document.querySelector("#show-less"),
  showMoreInfoDiv = document.querySelector("#showMoreInfo"),
  showMore_More_InfoDiv = document.querySelector("#showMore_More_Info"),
  pressureShow = document.querySelector(".pressure"),
  winSpeedShow = document.querySelector("#wind-speed"),
  minTempShow = document.querySelector("#min-temp"),
  maxTempShow = document.querySelector("#max-temp"),
  displayTime = document.getElementById("timeDisplay"),
  theme = document.querySelector(".theme"),
  toggleBtn = document.getElementById("toggle-btn");

let darkMode = localStorage.getItem("dark-mode");

const enableDarkMode = () => {
  toggleBtn.textContent = "Light Mode";
  theme.classList.add("dark-mode-theme");
  toggleBtn.classList.remove("dark-mode-toggle");
  localStorage.setItem("dark-mode", "enabled");
};

const disableDarkMode = () => {
  toggleBtn.textContent = "Dark Mode";
  theme.classList.remove("dark-mode-theme");
  toggleBtn.classList.add("dark-mode-toggle");
  localStorage.setItem("dark-mode", "disabled");
};

if (darkMode === "enabled") {
  toggleBtn.textContent = "Light Mode";
  enableDarkMode(); // set state of darkMode on page load
}



// event listners
inputField.addEventListener("keyup", (e) => {
  // if user pressed enter btn and input value is not empty than it will trigred this event
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

GetUserEnterLocationBtn.addEventListener("click", () => {
  if (inputField.value != "") {
    searchIconBtn.style.color = "white";
    requestApi(inputField.value);
  } else {
    searchIconBtn.style.color = "white";
    GetUserEnterLocationBtn.style.backgroundColor = "red";
  }
});

showMoreDetailsBtn.addEventListener("click", () => {
  showMoreInfoDiv.style.display = "flex";
  showMore_More_InfoDiv.style.display = "flex";

  showMoreDetailsBtn.style.display = "none";
  showLessDetailsBtn.style.display = "flex";
});

showLessDetailsBtn.addEventListener("click", () => {
  showMoreInfoDiv.style.display = "none";
  showMore_More_InfoDiv.style.display = "none";

  showMoreDetailsBtn.style.display = "flex";
  showLessDetailsBtn.style.display = "none";
});

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
  infoTxt.classList.remove("error");
  GetUserEnterLocationBtn.style.backgroundColor = "#43affc";
  locationBtn.style.color = "white";
  locationBtn.style.backgroundColor = "#43affc";
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser not support geolocation api");

    // alert you browerser doesnt support
  }
});

toggleBtn.addEventListener("click", () => {
  darkMode = localStorage.getItem("dark-mode"); // update darkMode when clicked
  if (darkMode === "disabled") {
    toggleBtn.textContent = "Light Mode";
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

// functions

function requestApi(city) {
  apiKey = `5e5236275b8d7f537ba2364c14bf2324`;
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData();
}

function onSuccess(position) {
  const { latitude, longitude } = position.coords; // getting lat & log of the user device
  apiKey = `5e5236275b8d7f537ba2364c14bf2324`;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

  //   locationBtn.style.backgroundColor = "blue";

  fetchData();
}

function onError(error) {
  infoTxt.textContent = error.message;
  infoTxt.classList.add("error");
  locationBtn.style.color = "white";
  locationBtn.style.backgroundColor = "red";
}

function fetchData() {
  infoTxt.textContent = "Getting weather details...";
  infoTxt.classList.add("pending");
  GetUserEnterLocationBtn.style.backgroundColor = "#43affc";

  fetch(api)
    .then((res) => res.json())
    .then((result) => weatherDetails(result))
    .catch(() => {
      infoTxt.textContent = "Something went wrong";
      infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.classList.replace("pending", "error");
    infoTxt.textContent = `${inputField.value} isn't a vaild city name`;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { temp, feels_like, humidity } = info.main;
    const pressure = info.main.pressure;
    const winSpeed = info.wind.speed;
    const minTemp = info.main.temp_min;
    const maxTemp = info.main.temp_max;

    if (id == 800) {
      wIcon.src = "/assests/Weather Icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "/assests/Weather Icons/storm.svg";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "/assests/Weather Icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "/assests/Weather Icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "/assests/Weather Icons/cloud.svg";
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
      wIcon.src = "/assests/Weather Icons/rain.svg";
    }

    pressureShow.textContent = pressure;
    winSpeedShow.textContent = winSpeed;
    minTempShow.textContent = minTemp;
    maxTempShow.textContent = maxTemp;

    weatherPart.querySelector(".temp .numb").textContent = Math.floor(temp);
    weatherPart.querySelector(".weather").textContent = description;
    weatherPart.querySelector(
      ".location span"
    ).textContent = `${city}, ${country}`;
    weatherPart.querySelector(".temp .numb-2").textContent =
      Math.floor(feels_like);
    weatherPart.querySelector(".humidity span").textContent = `${humidity}%`;
    infoTxt.classList.replace("pending", "error");

    infoTxt.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");
    console.log(info);
  }
}
function showTime() {
  const currentTime = new Date();
  let hours = currentTime.getHours();
  let min = currentTime.getMinutes();
  let sec = currentTime.getSeconds();
  let am_pm = hours > 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  min = min < 10 ? "0" + min : min;

  const time = `${hours}:${min} ${am_pm}`;
  document.getElementById("timeDisplay").textContent = time;
}
