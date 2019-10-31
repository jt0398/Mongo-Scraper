$(document).ready(function() {
  const dataScraped = localStorage.getItem("dataScraped");

  if()

  $("#scrape-btn").on("click", function(event) {
    event.preventDefault();

    $("#spinner").html(
      `<div class="preloader-wrapper active">
      <div class="spinner-layer spinner-red-only">
          <div class="circle-clipper left">
              <div class="circle"></div>
          </div>
          <div class="gap-patch">
              <div class="circle"></div>
          </div>
          <div class="circle-clipper right">
              <div class="circle"></div>
          </div>
      </div>
  </div>
  <h4>Scraping..</h4>`
    );

    $.ajax("/api/scrape").then(data => {
      localStorage.setItem("dataScraped", data.count);
      location.href = "/";
    });
  });

  $(".saveArticle").on("click", function(event) {
    event.preventDefault();

    $.ajax("/api/articles").then(response => {
      location.href = "/";
    });
  });
});
