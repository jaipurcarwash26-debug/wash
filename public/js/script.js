// =========================================
// NAVBAR SCROLL EFFECT
// =========================================

const navbar = document.querySelector(".navbar");

if (navbar) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  });
}

// =========================================
// CLOSE MOBILE NAVBAR AFTER CLICK
// =========================================

const navLinks = document.querySelectorAll(".nav-link");

const navbarCollapse = document.querySelector(".navbar-collapse");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (
      navbarCollapse &&
      navbarCollapse.classList.contains("show") &&
      typeof bootstrap !== "undefined"
    ) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);

      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  });
});

// =========================================
// SCROLL PROGRESS BAR
// =========================================

const progressBar = document.querySelector(".scroll-progress");

const backToTop = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
  // Progress bar
  if (progressBar) {
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (totalHeight > 0) {
      progressBar.style.width = (window.scrollY / totalHeight) * 100 + "%";
    }
  }

  // Back to top
  if (backToTop) {
    backToTop.classList.toggle("show", window.scrollY > 400);
  }
});

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// =========================================
// AOS ANIMATIONS
// =========================================

function animate(selector, effect, delay = 0, stagger = 0, onParent = false) {
  document.querySelectorAll(selector).forEach((el, i) => {
    const target = onParent ? el.parentElement : el;

    if (target) {
      target.setAttribute("data-aos", effect);

      target.setAttribute("data-aos-delay", delay + i * stagger);
    }
  });
}

// HERO

animate(".hero-badge", "fade-down", 100);

animate(".hero-content h1", "fade-up", 250);

animate(".hero-content > p", "fade-up", 400);

animate(".hero-buttons", "fade-up", 550);

animate(".hero-trust", "fade-up", 700);

animate(".hero-image-card", "zoom-in", 300);

// SECTION HEADINGS

animate(".section-heading > span", "fade-down");

animate(".section-heading h2", "fade-up", 100);

animate(".section-heading p", "fade-up", 200);

// WHY CHOOSE US

animate(".feature-card", "fade-up", 0, 120, true);

// ABOUT

animate(".about-main-card", "fade-right");

animate(".experience-card", "zoom-in", 500);

animate(".about-content .section-label", "fade-down");

animate(".about-content h2", "fade-up", 100);

animate(".about-content > p", "fade-up", 200, 100);

animate(".about-points div", "fade-left", 300, 150);

// SERVICES

animate(".service-card", "flip-up", 0, 150, true);

// PLANS

animate(".plan-card", "zoom-in-up", 0, 150, true);

// HOW IT WORKS

animate(".step-card", "fade-up", 0, 150, true);

// REVIEWS

animate(".review-card", "fade-up", 0, 150, true);

// CTA

animate(".cta-content", "zoom-in");

// FOOTER

animate(".footer .row > div", "fade-up", 0, 120);

// Initialize AOS only if loaded

if (typeof AOS !== "undefined") {
  AOS.init({
    duration: 800,

    once: true,

    offset: 80,

    easing: "ease-out-cubic",
  });
}

// =========================================
// SELECT LOCATION ON MAP
// =========================================

// =========================================
// SELECT LOCATION ON MAP (GOOGLE MAPS)
// =========================================

const locationModal = document.getElementById("locationModal");
const mapLocationInput = document.getElementById("mapLocationUrl");
const confirmLocation = document.getElementById("confirmLocation");
const selectedCoordinates = document.getElementById("selectedCoordinates");
const useMyLocation = document.getElementById("useMyLocation");

let locationMap = null;
let locationMarker = null;
let selectedLatitude = null;
let selectedLongitude = null;

// Put marker on map + save coordinates
function setLocation(lat, lng) {
  selectedLatitude = lat;
  selectedLongitude = lng;

  const position = { lat: lat, lng: lng };

  if (locationMarker) {
    locationMarker.setPosition(position);
  } else {
    locationMarker = new google.maps.Marker({
      position: position,
      map: locationMap,
      title: "Car Location",
    });
  }

  if (selectedCoordinates) {
    selectedCoordinates.textContent = `Selected: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }

  if (confirmLocation) {
    confirmLocation.disabled = false;
  }
}

// Ask browser for user's current location
function goToCurrentLocation() {
  if (!navigator.geolocation) {
    alert("Your browser does not support location.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (pos) {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      locationMap.setCenter({ lat: lat, lng: lng });
      locationMap.setZoom(17);
      setLocation(lat, lng);
    },
    function () {
      alert("Could not get your location. Please allow location access.");
    },
  );
}

// =========================================
// MAP MODAL
// =========================================

if (locationModal) {
  locationModal.addEventListener("shown.bs.modal", function () {
    if (typeof google === "undefined") {
      alert("Google Maps could not be loaded. Check your API key.");
      return;
    }

    // Create map only once
    if (!locationMap) {
      locationMap = new google.maps.Map(
        document.getElementById("locationMap"),
        {
          center: { lat: 26.9124, lng: 75.7873 }, // Jaipur
          zoom: 13,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: false,
        },
      );

      // Click / tap on map
      locationMap.addListener("click", function (event) {
        setLocation(event.latLng.lat(), event.latLng.lng());
      });

      // Auto-open on user's current location
      goToCurrentLocation();
    }
  });
}

// "Use My Current Location" button
if (useMyLocation) {
  useMyLocation.addEventListener("click", function () {
    if (locationMap) {
      goToCurrentLocation();
    }
  });
}

// =========================================
// CONFIRM LOCATION
// =========================================

if (confirmLocation) {
  confirmLocation.addEventListener("click", function () {
    if (selectedLatitude === null || selectedLongitude === null) {
      alert("Please select a location on the map.");
      return;
    }

    const googleMapsUrl = `https://www.google.com/maps?q=${selectedLatitude},${selectedLongitude}`;

    if (mapLocationInput) {
      mapLocationInput.value = googleMapsUrl;
    }

    const locationButton = document.querySelector(".location-btn");

    if (locationButton) {
      locationButton.innerHTML = `
        <i class="bi bi-check-circle"></i>
        Location Selected
      `;
      locationButton.classList.add("location-selected");
    }

    if (typeof bootstrap !== "undefined") {
      const modal = bootstrap.Modal.getInstance(locationModal);
      if (modal) modal.hide();
    }
  });
}

document.querySelectorAll(".flash-wrapper .alert").forEach((alertBox) => {
  setTimeout(() => {
    bootstrap.Alert.getOrCreateInstance(alertBox).close();
  }, 5000);
});

// =========================================
// SUBSCRIPTION LOCATION MAP
// =========================================

const subscriptionLocationModal = document.getElementById(
  "subscriptionLocationModal",
);

const subscriptionMapInput = document.getElementById("mapLocationUrl");

const confirmSubscriptionLocation = document.getElementById(
  "confirmSubscriptionLocation",
);

const subscriptionCoordinates = document.getElementById(
  "subscriptionSelectedCoordinates",
);

const useSubscriptionMyLocation = document.getElementById(
  "useSubscriptionMyLocation",
);

let subscriptionMap = null;

let subscriptionMarker = null;

let subscriptionLatitude = null;

let subscriptionLongitude = null;

// =========================================
// SET LOCATION
// =========================================

function setSubscriptionLocation(lat, lng) {
  subscriptionLatitude = lat;

  subscriptionLongitude = lng;

  const position = {
    lat: lat,
    lng: lng,
  };

  if (subscriptionMarker) {
    subscriptionMarker.setPosition(position);
  } else {
    subscriptionMarker = new google.maps.Marker({
      position: position,

      map: subscriptionMap,

      title: "Car Location",
    });
  }

  if (subscriptionCoordinates) {
    subscriptionCoordinates.textContent = `Selected: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }

  if (confirmSubscriptionLocation) {
    confirmSubscriptionLocation.disabled = false;
  }
}

// =========================================
// CURRENT LOCATION
// =========================================

function goToSubscriptionCurrentLocation() {
  if (!navigator.geolocation) {
    alert("Your browser does not support location.");

    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (pos) {
      const lat = pos.coords.latitude;

      const lng = pos.coords.longitude;

      subscriptionMap.setCenter({
        lat: lat,
        lng: lng,
      });

      subscriptionMap.setZoom(17);

      setSubscriptionLocation(lat, lng);
    },

    function () {
      alert("Could not get your location. Please allow location access.");
    },
  );
}

// =========================================
// CREATE MAP
// =========================================

if (subscriptionLocationModal) {
  subscriptionLocationModal.addEventListener("shown.bs.modal", function () {
    if (typeof google === "undefined") {
      alert("Google Maps could not be loaded.");

      return;
    }

    if (!subscriptionMap) {
      subscriptionMap = new google.maps.Map(
        document.getElementById("subscriptionLocationMap"),

        {
          center: {
            lat: 26.9124,
            lng: 75.7873,
          },

          zoom: 13,

          mapTypeControl: true,

          streetViewControl: false,

          fullscreenControl: false,
        },
      );

      subscriptionMap.addListener("click", function (event) {
        setSubscriptionLocation(
          event.latLng.lat(),

          event.latLng.lng(),
        );
      });

      goToSubscriptionCurrentLocation();
    }
  });
}

// =========================================
// USE CURRENT LOCATION BUTTON
// =========================================

if (useSubscriptionMyLocation) {
  useSubscriptionMyLocation.addEventListener("click", function () {
    if (subscriptionMap) {
      goToSubscriptionCurrentLocation();
    }
  });
}

// =========================================
// CONFIRM LOCATION
// =========================================

if (confirmSubscriptionLocation) {
  confirmSubscriptionLocation.addEventListener("click", function () {
    if (subscriptionLatitude === null || subscriptionLongitude === null) {
      alert("Please select a location on the map.");

      return;
    }

    const googleMapsUrl = `https://www.google.com/maps?q=${subscriptionLatitude},${subscriptionLongitude}`;

    if (subscriptionMapInput) {
      subscriptionMapInput.value = googleMapsUrl;
    }

    const locationButton = document.querySelector(
      "#subscriptionLocationModal .location-btn",
    );

    if (locationButton) {
      locationButton.innerHTML = `

          <i class="bi bi-check-circle"></i>

          Location Selected

        `;

      locationButton.classList.add("location-selected");
    }

    if (typeof bootstrap !== "undefined") {
      const modal = bootstrap.Modal.getInstance(subscriptionLocationModal);

      if (modal) {
        modal.hide();
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("aboutVideoSection");
  const video = document.getElementById("aboutVideo");
  const playButton = document.getElementById("aboutPlayPause");
  const muteButton = document.getElementById("aboutMuteToggle");
  const status = document.getElementById("aboutVideoStatus");

  if (!section || !video || !playButton || !muteButton || !status) {
    return;
  }

  let sectionVisible = false;
  let userPaused = false;
  let userChangedSound = false;

  function updatePlayButton() {
    const playing = !video.paused && !video.ended;

    playButton.innerHTML = playing
      ? '<i class="bi bi-pause-fill"></i>'
      : '<i class="bi bi-play-fill"></i>';

    playButton.setAttribute(
      "aria-label",
      playing ? "Pause video" : "Play video",
    );
  }

  function updateMuteButton() {
    muteButton.innerHTML = video.muted
      ? '<i class="bi bi-volume-mute-fill"></i>'
      : '<i class="bi bi-volume-up-fill"></i>';

    muteButton.setAttribute(
      "aria-label",
      video.muted ? "Turn sound on" : "Turn sound off",
    );
  }

  async function startVideo() {
    if (!sectionVisible || userPaused) return;

    try {
      // Try audio first when entering the section.
      if (!userChangedSound) {
        video.muted = false;
        video.volume = 1;
      }

      await video.play();

      status.textContent = video.muted
        ? "Playing · Sound off"
        : "Playing · Sound on";
    } catch (error) {
      // Browsers commonly block autoplay with sound.
      if (!userChangedSound) {
        video.muted = true;

        try {
          await video.play();
          status.textContent = "Playing · Sound off";
        } catch (playError) {
          status.textContent = "Tap play to start";
        }
      } else {
        status.textContent = "Tap play to start";
      }
    }

    updatePlayButton();
    updateMuteButton();
  }

  playButton.addEventListener("click", async () => {
    if (video.paused || video.ended) {
      userPaused = false;

      try {
        await video.play();
        status.textContent = video.muted
          ? "Playing · Sound off"
          : "Playing · Sound on";
      } catch (error) {
        status.textContent = "Unable to play this video";
      }
    } else {
      userPaused = true;
      video.pause();
      status.textContent = "Paused";
    }

    updatePlayButton();
  });

  muteButton.addEventListener("click", async () => {
    userChangedSound = true;
    video.muted = !video.muted;

    // A sound button click is a user gesture, so retry playback
    // if the video has not started yet.
    if (video.paused && sectionVisible && !userPaused) {
      try {
        await video.play();
      } catch (error) {
        status.textContent = "Tap play to start";
      }
    }

    status.textContent = video.paused
      ? "Paused"
      : video.muted
        ? "Playing · Sound off"
        : "Playing · Sound on";

    updateMuteButton();
    updatePlayButton();
  });

  video.addEventListener("play", updatePlayButton);

  video.addEventListener("pause", updatePlayButton);

  video.addEventListener("volumechange", updateMuteButton);

  video.addEventListener("ended", () => {
    status.textContent = "Video ended";
    updatePlayButton();
  });

  // Start when the About section enters the viewport.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        sectionVisible = entry.isIntersecting;

        if (sectionVisible) {
          if (!userPaused) {
            startVideo();
          }
        } else {
          // Stop playback and audio when the section leaves view.
          video.pause();
          video.muted = true;
          userChangedSound = false;
          userPaused = false;
          status.textContent = "Ready to play";

          updatePlayButton();
          updateMuteButton();
        }
      });
    },
    {
      threshold: 0.4,
    },
  );

  observer.observe(section);

  updatePlayButton();
  updateMuteButton();
});

document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("reviewVideoSection");
  const video = document.getElementById("reviewVideo");
  const playButton = document.getElementById("reviewPlayPause");
  const muteButton = document.getElementById("reviewMuteToggle");
  const status = document.getElementById("reviewVideoStatus");

  if (!section || !video || !playButton || !muteButton || !status) {
    return;
  }

  let isVisible = false;
  let userPaused = false;
  let userChangedSound = false;

  function updateControls() {
    const playing = !video.paused && !video.ended;

    playButton.innerHTML = playing
      ? '<i class="bi bi-pause-fill"></i>'
      : '<i class="bi bi-play-fill"></i>';

    playButton.setAttribute(
      "aria-label",
      playing ? "Pause review video" : "Play review video",
    );

    muteButton.innerHTML = video.muted
      ? '<i class="bi bi-volume-mute-fill"></i>'
      : '<i class="bi bi-volume-up-fill"></i>';

    muteButton.setAttribute(
      "aria-label",
      video.muted ? "Turn sound on" : "Turn sound off",
    );
  }

  async function playReview() {
    if (!isVisible || userPaused) return;

    try {
      if (!userChangedSound) {
        video.muted = false;
        video.volume = 1;
      }

      await video.play();
      status.textContent = video.muted
        ? "Playing · Sound off"
        : "Playing · Sound on";
    } catch (error) {
      if (!userChangedSound) {
        video.muted = true;

        try {
          await video.play();
          status.textContent = "Playing · Sound off";
        } catch (fallbackError) {
          status.textContent = "Tap play to start";
        }
      } else {
        status.textContent = "Tap play to start";
      }
    }

    updateControls();
  }

  playButton.addEventListener("click", async () => {
    if (video.paused || video.ended) {
      userPaused = false;

      try {
        await video.play();
        status.textContent = video.muted
          ? "Playing · Sound off"
          : "Playing · Sound on";
      } catch (error) {
        status.textContent = "Unable to play video";
      }
    } else {
      userPaused = true;
      video.pause();
      status.textContent = "Paused";
    }

    updateControls();
  });

  muteButton.addEventListener("click", async () => {
    userChangedSound = true;
    video.muted = !video.muted;

    if (video.paused && isVisible && !userPaused) {
      try {
        await video.play();
      } catch (error) {
        status.textContent = "Tap play to start";
      }
    }

    if (!video.paused) {
      status.textContent = video.muted
        ? "Playing · Sound off"
        : "Playing · Sound on";
    }

    updateControls();
  });

  video.addEventListener("play", updateControls);
  video.addEventListener("pause", updateControls);
  video.addEventListener("volumechange", updateControls);

  video.addEventListener("ended", () => {
    status.textContent = "Review finished";
    updateControls();
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;

        if (isVisible) {
          playReview();
        } else {
          video.pause();
          video.muted = true;
          userChangedSound = false;
          userPaused = false;
          status.textContent = "Ready to play";
          updateControls();
        }
      });
    },
    {
      threshold: 0.4,
    },
  );

  observer.observe(section);
  updateControls();
});
