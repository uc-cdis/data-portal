let jsonError = "<p>Unable to load json file. Is it an http or https link directly to the .json?</p>";
let contributeForm = "<p>JSON file loaded. If you see nothing, then there was probably no location data in the file.</p>";

// ------- Modal js ---------
// Modal footer object
var messageModal = document.getElementById("message-modal");

// Get the <span> element that closes the footer modal
var footerSpan = document.getElementsByClassName("close-footer")[0];

// Error flag
var errorFlag = false;

// Map toggle boolean
var mapSide = true;


// When the user clicks on <span> (x) in the footer, close the modal
footerSpan.onclick = function() {
  messageModal.style.display = "none";
}

// When the user clicks outside the footer modal it should dissapear
window.onclick = function(event) {
  if (event.target == messageModal) {
    messageModal.style.display = "none";
  }
}

// Toggles the map side bar
function mapSideToggle() {
  var buttonDiv = document.getElementById("map-side-interface-button");
  var sideMenu = document.getElementById("map-side-menu");
  if (mapSide) {
    sideMenu.style.width = "0";
    buttonDiv.innerHTML = "<i class=\"arrow right-arrow\"></i>";
    buttonDiv.style.left = "0";
  } else {
    sideMenu.style.width = "300px";
    buttonDiv.style.left = "300px";
    buttonDiv.innerHTML = "<i class=\"arrow left-arrow\"></i>";
  }
  mapSide = !mapSide;
}


// Will display the footer modal with a message
// the boolean will determine to higlight it red for an error or not red for a regular message
function displayFooterMessage(text, error) {
  messageModal.style.display = "block";
  if (!errorFlag) {
    if (error) {
      errorFlag = true;
      document.getElementById("modal-footer").innerHTML = "<div class=\"error\">" + text + "</div>";
    } else {
      document.getElementById("modal-footer").innerHTML = "<div>" + text + "</div>";
    }
  } else {
    console.log("Cannot display a new footer message unless the errorFlag is cleared.");
  }
}

// will be called from standard ajax error call
function ajaxErrorHandle(XMLHttpRequest, textStatus, errorThrown) {
  displayFooterMessage("An error has occured: " + errorThrown, true);
}
