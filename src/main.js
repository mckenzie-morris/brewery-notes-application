import "animate.css";
import "./styles.css";
import lightModeIcon from "./assets/light-icon.svg";
import darkModeIcon from "./assets/dark-icon.svg";
import emptyMugsDark from "./assets/empty-mugs-dark.svg";
import emptyMugsLight from "./assets/empty-mugs-light.svg";
import fullMugs from "./assets/full-mugs.svg";
import $ from "jquery";
import axios from "axios";

// on document ready
$(() => {
  // initialize the html to light theme
  $("html").addClass("light");
  $("#themeToggleContainer").addClass("light");

  // dynamically-generated data sent from server to data-* attributes on '#user_input'
  // will be an empty object literal before first query is made
  const serverData = $("#user_input").data();
  console.log(serverData);
  // current theme ('light' or 'dark')
  const currentTheme = $("html")[0].className;

  /* if a query has been made, and the server's API call has successfuly returned data
and rendered the homepage, display the data, focus the input field, and set the
theme to the setting prior to the API call and page render */
  if (Object.keys(serverData).length) {
    // list of returned breweries from the API call
    const queryResults = $("#user_input").data().query_results;
    // the query that was sent on the API call
    const lastQuery = $("#user_input").data().last_query;
    // the theme setting prior to the API call
    const lastTheme = $("#user_input").data().last_theme;
    /* if the current theme does not match the theme setting prior to the API call, 
  switch the theme */
    if (currentTheme !== lastTheme) {
      $("#themeToggle").trigger("click");
    }
    // focus the input field
    $("#user_input").trigger("focus");
    // populate the input with the query sent on the API call
    $("#user_input").val(lastQuery);
  }

  // render 'notes' page at '/notes' endpoint when 'notesButton' is clicked
  $("#notesButton").on("click", () => {
    window.location.href = "/notes";
  });
});

/* if the '#themeToggle' button is clicked, swap theme 
from 'light' to 'dark', or 'dark' to 'light' */
$("#themeToggle").on("click", () => {
  if ($("html")[0].className === "light") {
    $("html").toggleClass("light dark");
    $("#themeToggleContainer").toggleClass("light dark");
    $("#themeIcon").attr("src", "dark-icon.svg");
    $(".emptyMugs").attr("src", "empty-mugs-dark.svg");
  } else if ($("html")[0].className === "dark") {
    $("html").toggleClass("dark light");
    $("#themeToggleContainer").toggleClass("dark light");
    $("#themeIcon").attr("src", "light-icon.svg");
    $(".emptyMugs").attr("src", "empty-mugs-light.svg");
  }
});

/* on query submission, attach the current theme setting ('light' or 'dark') to
the input field with attribute 'type=hidden' */
$("#search").on("submit", () => {
  $("#currentThemeSetting").val($("html")[0].className);
});

// triggerd each time input field changes
$("#user_input").on("input", () => {
  // only trigger debounce function if input value is non-zero
  if ($("#user_input").val().length) {
    const debouncer = setTimeout(() => {
      // console.log('Timeout reached, input submitted: ', $("#user_input").val())
      $("#search").trigger("submit");
    }, 1000);
    /* if user begins typing before necessary time has elapsed, reset timer and 
  eliminate pending function execution */
    $("#user_input").on("input", () => {
      // console.log('debounced!')
      clearTimeout(debouncer);
    });
  }
});

// populate modal with name of query result on click
$(".queryResultItem").on("click", async function () {
  // text is pulled from the query result and added to modal title h1 element
  $("#modalBrewerySelection").text($(this).text().slice(3));
  // make axios GET request to obtain location data
  try {
    const response = await axios(
      // request config object
      {
        method: "GET",
        url: `https://api.openbrewerydb.org/v1/breweries/{${$(this).data().brewery_id}}`,
      },
    );
    // return response;
    console.log(response.data);
    $("#modalBrewerySelectionAddress").text(
      `${response.data.address_1}, ${response.data.city}, ${response.data.state} ${response.data.postal_code}`,
    );
    $("#modalBrewerySelectionCountry").text(`${response.data.country}`);
    return;
  } catch (error) {
    // if error encountered during API call, log it to the console
    console.log(error);
  }
});

//  Immediately Invoked Function Expression (IIFE). controls mug icons in modal
(function modalMugsControl() {
  // initialize local variables
  let mugsIdx;
  let mugsIdxArr = [];
  let previousSrc = "empty-mugs-light.svg";
  // toggle empty mugs icons from 'light'/'dark' background
  $("#themeToggle").on("change", () => {
    if ($("html")[0].className === "dark") {
      previousSrc = "empty-mugs-dark.svg";
    } else {
      previousSrc = "empty-mugs-light.svg";
    }
  });

  // modularized for loop (loop thru mugs icons)
  // if first argument is undefined, 'start' defaults to 0
  function mugsLoop(start = 0, end, srcString) {
    for (let i = Number(start); i <= Number(end); i += 1) {
      $(`#emptyMugs${i}`).attr("src", srcString);
    }
  }

  // select and set rating
  $(".emptyMugs").on("click", function () {
    mugsIdx = $(this).attr("id").slice(-1);
    mugsIdxArr.push(mugsIdx);

    // flip empty mugs to full mugs
    if (mugsIdx > mugsIdxArr[mugsIdxArr.length - 2]) {
      mugsLoop(mugsIdxArr[mugsIdxArr.length - 2], mugsIdx, "full-mugs.svg");
      // remove unnecessary data
      mugsIdxArr.shift();
    }

    /* if rating is selected, and the same rating is clicked again, reset rating and enable 
  visual representation of possible ratings */
    if (mugsIdx === mugsIdxArr[mugsIdxArr.length - 2]) {
      mugsLoop(0, mugsIdx, previousSrc);
      mugsIdxArr.length = 0;
    }
    // reset any superfluous full mugs to empty (if necessary)
    else if (mugsIdx < mugsIdxArr[mugsIdxArr.length - 2]) {
      for (let i = mugsIdxArr[mugsIdxArr.length - 2]; i > mugsIdx; i -= 1) {
        $(`#emptyMugs${i}`).attr("src", previousSrc);
      }
      // remove unnecessary data
      mugsIdxArr.shift();
    }
  });

  // change visual representation of possible ratings before selecting a rating
  $(".emptyMugs")
    .on("mouseenter", function () {
      mugsIdx = $(this).attr("id").slice(-1);
      if (!mugsIdxArr.length) {
        mugsLoop(0, mugsIdx, "full-mugs.svg");
      }
    })
    .on("mouseleave", function () {
      mugsIdx = $(this).attr("id").slice(-1);
      if (!mugsIdxArr.length) {
        mugsLoop(0, mugsIdx, previousSrc);
      }
    });

  // if the modal is closed, reset rating to blank
  $("#modalToggle").on("change", () => {
    if ($("#modalToggle").prop("checked") === false) {
      mugsLoop(0, mugsIdx, previousSrc);
    }
    mugsIdxArr.length = 0;
  });
})();
