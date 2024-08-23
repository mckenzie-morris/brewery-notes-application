import "./styles.css";
import lightModeIcon from "./assets/light-icon.svg";
import darkModeIcon from "./assets/dark-icon.svg";
import $ from "jquery";

// on document ready
$(() => {
  // initialize the html to dark theme
  $("html").addClass("light");
  $("#themeToggleContainer").addClass("light");
});

$("#themeToggle").on("click", () => {
  $("html").toggleClass("light dark");
  $("#themeToggleContainer").toggleClass("light dark");
  if ($("#themeIcon").attr("src") === "light-icon.svg") {
    $("#themeIcon").attr("src", "dark-icon.svg");
  } else {
    $("#themeIcon").attr("src", "light-icon.svg");
  }
});

//////////////////////////////////////////////////////////

$(() => {
  // Use .attr() instead of .data() to get the raw data attribute value
  const queryResultsJsonString = $('#user_input').attr('data-query_results');
  // console.log(queryResultsJsonString)
  
  if (queryResultsJsonString) {
    // Parse the JSON string back into an object/array
    const parsedResults = JSON.parse(queryResultsJsonString);
    // console.log(parsedResults);  // This should log your queryResults array
  } else {
    // console.log('No query results found');
  }
});


$("#search").on('submit', () => {
  console.log('submitted!')
})

// triggerd each time input field changes
$("#user_input").on("input", () => {
  // only trigger debounce function if input value is non-zero
  if ($("#user_input").val().length) {
    const debouncer = setTimeout( () => {
      console.log('Timeout reached, input submitted: ', $("#user_input").val())
    $("#search").trigger('submit');
  }, 1000)
  /* if user begins typing before necessary time has elapsed, reset timer and 
  eliminate pending function execution */
  $("#user_input").on("input", () => {
    console.log('debounced!')
    clearTimeout(debouncer)
  })
}
})


//////////////////////////////////////////////////////////