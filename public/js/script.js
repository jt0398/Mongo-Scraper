$(document).ready(function() {
  const dataScraped = localStorage.getItem("dataScraped");

  $("#scrapeSpinner").addClass("hide");

  if (dataScraped) {
    $("#newScraped").removeClass("hide");
    $("#newScraped").text(dataScraped);

    setTimeout(() => {
      $("#newScraped").text("");
      $("#newScraped").addClass("hide");
      localStorage.clear();
    }, 30000);
  }

  $("#scrape-btn").on("click", function(event) {
    event.preventDefault();

    $("#scrapeSpinner").removeClass("hide");

    $.ajax("/api/scrape").then(data => {
      const newCount = data.count - $(".card-title").length;
      console.log(newCount, data.count, $(".card-title").length);
      if (newCount > 0) {
        localStorage.setItem("dataScraped", newCount);
        location.href = "/";
      } else {
        $("#scrapeSpinner").addClass("hide");
      }
    });
  });

  $(".saveArticle").on("click", function(event) {
    event.preventDefault();

    const id = $(this).data("id");

    $.post("/api/articles", { id }).then(response => {
      location.href = "/";
    });
  });
});
