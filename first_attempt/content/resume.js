filter("all");

// The function for the selection
function filter(category) {
  console.log("Filtering by category:", category); // Debug statement
  var x, i;
  x = document.getElementsByClassName("c");
  if (category == "all") category = "";
  // Selections
  for (i = 0; i < x.length; i++) {
    removeC(x[i], "show");
    if (x[i].className.indexOf(category) > -1) addC(x[i], "show");
  }
}

// Show filtered elements
function addC(element, name) {
  console.log("Adding class", name, "to element:", element); // Debug statement
  var i, a1, a2;
  a1 = element.className.split(" ");
  a2 = name.split(" ");
  for (i = 0; i < a2.length; i++) {
    if (a1.indexOf(a2[i]) == -1) {
      element.className += " " + a2[i];
    }
  }
}

// Hide elements
function removeC(element, name) {
  var i, a1, a2;
  a1 = element.className.split(" ");
  a2 = name.split(" ");
  for (i = 0; i < a2.length; i++) {
    if (a1.indexOf(a2[i]) > -1) {
      a1.splice(a1.indexOf(a2[i]), 1);
    }
  }
  element.className = a1.join(" ");
}

// Highlight the class
var btnC = document.getElementById("allBtns");
var btns = btnC.getElementsByClassName("r-btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}