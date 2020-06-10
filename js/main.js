gsap.registerPlugin(ScrollTrigger);

const burger = document.querySelector(".burger");
const sidebarMain = document.querySelector(".sidebar-main");
const navLinksAnchors = document.querySelectorAll(".nav-links li a");
const firstGalleryFigure = document.querySelector(
  "#about-gallery figure:first-of-type"
);
const lastGalleryFigure = document.querySelector(
  "#about-gallery figure:last-of-type"
);
const bookingsHeader = document.querySelector("#bookings header span");
const bookingsForm = document.querySelector("#bookings form");
const mql1200 = window.matchMedia("(min-width: 1200px)");
const mql500 = window.matchMedia("(min-width: 500px)");
const toggleMenu = gsap.timeline({ reversed: true }).to(sidebarMain, {
  xPercent: 100,
  duration: 0.5,
  ease: Power2.easeInOut,
});
const toggleAboutGalleryBullet = gsap
  .timeline({ paused: true })
  .to(".about-gallery-bullet", {
    left: 0,
    duration: 0.5,
    ease: Power2.easeInOut,
  });
const toggleBookingsBullet = gsap
  .timeline({ paused: true })
  .to(".bookings-bullet", {
    left: 0,
    duration: 0.5,
    ease: Power2.easeInOut,
  });
const sidebarRevealTL = gsap.timeline();
const bookingsFormRevealTL = gsap.timeline();
const bookingsHeaderRevealTL = gsap.timeline({
  scrollTrigger: {
    trigger: lastGalleryFigure,
    start: "top 5px",
  },
});
const figureRevealTL = gsap.timeline();

// Account for navbar height on screens below 1200px width
let offset = 0;
if (!mql1200.matches) {
  offset = document.querySelector(".sidebar header").offsetHeight;
}
// Set initial bullet
updateBullets();

// Debounce for scroll function
const debounce = (func, delay) => {
  let debounceTimer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

// Updating current section highlight
$(document).on(
  "scroll",
  debounce(function () {
    updateBullets();
  }, 100)
);

function updateBullets() {
  if ($(this).scrollTop() + offset >= $("#bookings").position().top) {
    toggleAboutGalleryBullet.reverse();
    toggleBookingsBullet.play();
  } else if (
    $(this).scrollTop() + offset >=
    $("#about-gallery").position().top
  ) {
    toggleBookingsBullet.reverse();
    toggleAboutGalleryBullet.play();
  }
}

burger.addEventListener("click", () => {
  // Toggle nav menu
  toggleMenu.reversed() ? toggleMenu.play() : toggleMenu.reverse();
  burger.classList.toggle("toggle");
});

navLinksAnchors.forEach((navLinkAnchor) =>
  navLinkAnchor.addEventListener("click", () => {
    // Close nav menu on anchor click
    toggleMenu.reverse();
    burger.classList.remove("toggle");
  })
);

// Must go descending width order to ensure largest applicable width media query is used
if (mql1200.matches) {
  sidebarRevealTL
    .from("main", { marginLeft: 0, duration: 1, delay: 2 })
    .from(".sidebar", { autoAlpha: 0, duration: 2 });

  gsap.to(".about", {
    scrollTrigger: {
      trigger: "main",
      start: "top",
      end: "bottom 100%",
      scrub: true,
    },
    top: "0",
    autoAlpha: 0,
  });
  bookingsHeaderRevealTL
    .to(lastGalleryFigure, {
      width: "65%",
      duration: 2,
      ease: Power4.easeInOut,
    })
    .fromTo(
      bookingsHeader,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.5, ease: Power2.easeInOut },
      "-=.75"
    )
    .from(
      "#bookings header .underline",
      {
        scaleX: 0,
        duration: 1,
        ease: Power4.easeInOut,
      },
      "-=.75"
    );

  bookingsHeader.addEventListener("click", () => {
    if (bookingsHeader.classList.contains("js-form-revealed")) {
      // Only play the animation the first click
      return;
    }

    bookingsFormRevealTL
      .to(lastGalleryFigure.getElementsByTagName("figcaption")[0], {
        autoAlpha: 0,
        duration: 2,
        ease: Power4.easeInOut,
      })
      .to(
        lastGalleryFigure,
        {
          width: "0",
          duration: 2,
          ease: Power4.easeInOut,
        },
        "-=2"
      )
      .staggerFrom(
        bookingsForm.getElementsByTagName("input"),
        0.75,
        {
          autoAlpha: 0,
          x: 100,
          ease: Power2.easeInOut,
        },
        0.25,
        "-=.75"
      )
      .from(
        bookingsForm.getElementsByClassName("form-button")[0],
        {
          autoAlpha: 0,
          duration: 0.5,
          ease: Power2.easeInOut,
        },
        "-=0.25"
      );

    bookingsHeader.classList.add("js-form-revealed");
  });
} else if (mql500.matches) {
  gsap.to(".about", {
    scrollTrigger: {
      trigger: "main",
      start: "top 80px",
      end: "bottom 100%",
      scrub: true,
    },
    top: "8rem",
    autoAlpha: 0,
  });
} else {
  gsap.to(".about", {
    scrollTrigger: {
      trigger: "#about-gallery",
      start: "top 80px",
      end: "bottom 100%",
      scrub: true,
    },
    autoAlpha: 0,
  });
}

// Screen widths below 1200px
if (!mql1200.matches) {
  bookingsHeaderRevealTL
    .fromTo(
      bookingsHeader,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.5, ease: Power2.easeInOut }
    )
    .from(
      "#bookings header .underline",
      {
        transformOrigin: "0% 50%",
        scaleX: 0,
        duration: 1,
        ease: Power4.easeInOut,
      },
      "-=.75"
    )
    .staggerFrom(
      bookingsForm.getElementsByTagName("input"),
      0.75,
      {
        autoAlpha: 0,
        x: -100,
        ease: Power2.easeInOut,
      },
      0.25,
      "-=.25"
    )
    .from(
      bookingsForm.getElementsByClassName("form-button")[0],
      {
        autoAlpha: 0,
        duration: 0.5,
        ease: Power2.easeInOut,
      },
      "-=0.25"
    );
}

// Screen widths over 500px
if (mql500.matches) {
  figureRevealTL.from(
    ".about",
    {
      autoAlpha: 0,
      duration: 2,
      ease: Power2.easeIn,
    },
    "-=.5"
  );
}
