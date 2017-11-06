window.onload = function() {
  updateItems()
  $(".action-new").click(function() {
    $(".creation-window").addClass("active");
  });
  $(".creation-window .x-out").click(function() {
    $(".creation-window").toggleClass("active");
  });

  $(".action-tell-me").click(tellMeFunction);
  $(".tell-me-window .x-out").click(function() {
    $(".tell-me-window").removeClass("active");
  });

  $(".action-open-clear").click(function() {
    $(".clear-window").addClass("active");
  });
  $(".clear-window .x-out").click(function() {
    $(".clear-window").toggleClass("active");
  });

  $(".action-clear").click(function() {
    clearLocalStorage();
    updateItems();
    $(".clear-window").removeClass("active");
  });

  $(".action-tell-me-different").click(tellMeDifferentFunction);

  $("#create").click(function() {
    var title = $("#input_title").val();
    if(title === "")
    {
      $("#input_title").addClass("red-border");
      return;
    }
    $("#input_title").removeClass("red-border");
    var description = $("#input_description").val();
    var count = parseInt($("#input_times").val());
    if(isNaN(count)) {
      count = 0;
    }
    var newActivityEntry = {
        "title": title,
        "description": description,
        "count": count
    };
    // add to JSON
    var allJsonData = getStoredJSON();
    allJsonData[title] = newActivityEntry;
    localStorage.setItem('allJsonData', JSON.stringify(allJsonData));
    updateItems();
    $(".creation-window").toggleClass("active");
    $("#input_title").val("");
    $("#input_description").val("");
    $("#input_times").val("");
  });

  $(".activity").click(function() {
    var focusedActivity = $(this)[0].firstChild.innerHTML;
    $(".tell-me-window").addClass("active");
  });

  $(".action-do-it").click(doItFunction);

  document.addEventListener('keydown', function(event) {
    if(!($(".pop-up-window.creation-window").hasClass("active"))) {
      if(event.keyCode ==  84) tellMeDifferentFunction(); // t
      else if(event.keyCode ==  68) doItFunction(); // d
      else if(event.keyCode ==  88) { // x
        console.log("X");
        $(".pop-up-window.creation-window").removeClass("active");
        $(".pop-up-window.tell-me-window").removeClass("active");
        $(".pop-up-window.clear-window").removeClass("active");
      }
    }
  });
}


function getStoredJSON() {
  // Retrieve the object from storage
  var allJsonData = JSON.parse(localStorage.getItem('allJsonData'));
  if(allJsonData === null) {
    allJsonData = {
    }
  }
  return allJsonData;
}

function clearLocalStorage() {
  localStorage.clear();
}

function updateItems() {
  var allJsonData = getStoredJSON();
  $(".activities-container").html("");
  jQuery.each(allJsonData, function() {
    $(".activities-container").append(
      "<div class='activity'>" +
        "<h2 class='title cursive'>" + this.title + "</h2>" +
        "<p class='count'>Done " + this.count + " times</p>" +
        "<p class='description'>" + this.description + "</p>" +
      "</div>"
    );
  });
}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

function psuedoRandomActivity() {
  var allJsonData = getStoredJSON();
  var counts = [];
  for(activity in allJsonData) {
    counts.push(allJsonData[activity].count);
  }
  var maxCount = getMaxOfArray(counts);

  var pickList = [];
  for(activity in allJsonData) {
    var weight = maxCount - allJsonData[activity].count + 1;
    for(var i = 0; i < weight; ++i) {
      pickList.push(activity);
    }
  }
  var randIdx = Math.floor(Math.random() * pickList.length);
  var title = pickList[randIdx];
  var description = allJsonData[title].description;
  var count = allJsonData[title].count;
  $(".tell-me-window .title").text(title);
  $(".tell-me-window .description").text(description);
  $(".tell-me-window .count").text("Done " + count + " times");
  return title;
}

function tellMeFunction() {
  psuedoRandomActivity();
  $(".tell-me-window").addClass("active");
}

function tellMeDifferentFunction() {
  var length = Object.keys(getStoredJSON()).length;
  if( length <= 1) {
    return tellMeFunction();
  }
  var previousTitle = $(".tell-me-window .title").text();
  do {
    psuedoRandomActivity();
  } while ($(".tell-me-window .title").text() === previousTitle);
  $(".tell-me-window").addClass("active");
}

function doItFunction() {
  var allJsonData = getStoredJSON();
  var title = $(".tell-me-window .title").text();
  var description = allJsonData[title].description;
  var count = parseInt(allJsonData[title].count);
  if(isNaN(count)) {
    count = 0;
  }
  ++count;
  var editedActivityEntry = {
      "title": title,
      "description": description,
      "count": count
  };
  // add to JSON
  var allJsonData = getStoredJSON();
  allJsonData[title] = editedActivityEntry;
  localStorage.setItem('allJsonData', JSON.stringify(allJsonData));
  updateItems();
  $(".tell-me-window .count").text("Done " + count + " times");
  $(".tell-me-window").removeClass("active");
}
