window.onload = function() {
updateItems()
  $("#action-new").click(function() {
    $(".creation-window").toggle();
  });
  $(".x-out").click(function() {
    $(".creation-window").toggle();
  });
  $("#action-clear").click(function() {
    clearLocalStorage();
    updateItems();
  });

  $("#create").click(function() {
    var title = $("#title").val();
    var description = $("#description").val();
    var count = 0;
    var newActivityEntry = {
        "title": title,
        "description": description,
        "count": count
    };
    // console.log(newActivityEntry);
    // add to JSON
    var allJsonData = getStoredJSON();

    console.log(JSON.stringify(allJsonData));
    allJsonData[title] = newActivityEntry;
    console.log(JSON.stringify(allJsonData));
    localStorage.setItem('allJsonData', JSON.stringify(allJsonData));
    updateItems()
  });
}


function getStoredJSON() {
  // Retrieve the object from storage
  console.log(localStorage);
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
        "<h2 class='cursive'>" + this.title + "</h2>" +
        "<p class='count'>Done " + this.count + " times</p>" +
        "<p class='description'>" + this.description + "</p>" +
      "</div>"
    );
  });
}
