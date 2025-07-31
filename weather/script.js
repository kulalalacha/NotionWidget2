function script(d, s, id) {
  const old = d.getElementById(id);
  if (old) old.remove();

  const js = d.createElement(s),
        fjs = d.getElementsByTagName(s)[0];
  js.id = id;
  js.src = 'https://weatherwidget.io/js/widget.min.js';
  fjs.parentNode.insertBefore(js, fjs);
}

function formatCoord(coord, positive, negative) {
  const abs = Math.abs(coord).toFixed(2).replace('.', 'd');
  return abs + (coord >= 0 ? positive : negative);
}

function getWeather(lat, lon, city = "hamburg") {
  const el = document.getElementById("weather");

  // สร้าง format "53d55n10d00e"
  const latDeg = Math.floor(Math.abs(lat));
  const latMin = Math.round((Math.abs(lat) - latDeg) * 100);
  const latDir = lat >= 0 ? "n" : "s";

  const lonDeg = Math.floor(Math.abs(lon));
  const lonMin = Math.round((Math.abs(lon) - lonDeg) * 100);
  const lonDir = lon >= 0 ? "e" : "w";

  const urlPart = `${latDeg}d${latMin}${latDir}${lonDeg}d${lonMin}${lonDir}`;
  const url = `https://forecast7.com/en/${urlPart}/${city.toLowerCase()}/`;

  console.log("✅ URL:", url);

  el.setAttribute("href", url);
  el.setAttribute("data-label_1", city.toUpperCase());
  el.setAttribute("data-icons", "Climacons Animated");
  el.setAttribute("data-mode", "Current");

  setTimeout(() => {
    script(document, 'script', 'weatherwidget-io-js');
  }, 150);
}


// Theme
function light() {
  document.documentElement.setAttribute('data-theme', 'pure');
  const el = document.getElementById('weather');
  el.setAttribute('data-theme', 'pure');
  el.removeAttribute('data-basecolor');
  el.setAttribute('data-textcolor', '#37352f');
  el.removeAttribute('data-cloudfill');
  el.setAttribute('data-suncolor', '#F58f70');
}

function dark() {
  document.documentElement.setAttribute('data-theme', 'gray');
  const el = document.getElementById('weather');
  el.setAttribute('data-theme', 'gray');
  el.setAttribute('data-basecolor', '#191919');
  el.removeAttribute('data-textcolor');
  el.setAttribute('data-cloudfill', '#191919');
  el.setAttribute('data-suncolor', '#F58f70');
}

// Auto-theme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  dark();
} else {
  light();
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  event.matches ? dark() : light();
});

// Get location from browser
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeather(lat, lon);
    },
    (err) => {
      console.warn("⚠️ Geolocation error, using fallback Hamburg.");
      getWeather(53.55, 10.00); // fallback Hamburg
    }
  );
} else {
  getWeather(53.55, 10.00);
}
