$(document).ready(function() {
  $("#scrape-btn").on("click", function() {
    $.ajax("/api/scrape").then(data => {
      console.log(data, $(".card-title"));
    });
  });
});
