$(document).ready(function() {
  $("#scrape-btn").on("click", function(event) {
    event.preventDefault();

    $.ajax("/api/scrape").then(data => {
      console.log(data, $(".card-title").length);
      //location.href = "/";
    });
  });
});
