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

  $("#clear-btn").on("click", function(event) {
    event.preventDefault();

    $.ajax("/api/articles", { type: "DELETE" }).then(response => {
      location.reload();
    });
  });

  $(".deleteArticle").on("click", function(event) {
    event.preventDefault();

    const id = $(this).data("id");

    $.ajax("/api/savedarticles/delete", {
      type: "DELETE",
      data: { id }
    }).then(response => {
      location.reload();
    });
  });

  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems, {});

  $(".modal").modal();

  $(".addNotes").on("click", function(event) {
    event.preventDefault();

    const id = $(this).data("id");

    loadNotes(id);

    $("#saveNotes").attr("data-id", id);

    $("#articleNotes").modal("open");
  });

  function loadNotes(id) {
    $.ajax(`/api/savedarticles/${id}/notes/`).then(article => {
      $("#articleTitle").text(article.title);

      $("#articleNotes .modal-content .collection").empty();

      if (article.notes.length === 0) {
        $("#articleNotes .modal-content .collection").append(
          "<li class='collection-item'>No Notes</li>"
        );
      } else {
        let htmlNotes = "";

        for (const note of article.notes) {
          htmlNotes += `<li class="collection-item"><div class="row"><div class="col s11">${note.body}</div><div class="col s1"><a data-id='${note._id}' class='btn-floating btn-small red waves-effect waves-light deleteNote'><i class='material-icons'>delete</i></a></div></div></li>`;
        }

        htmlNotes += `<script language="javascript">
        $(".deleteNote").on("click", function(event) {
          event.preventDefault();
      
          const id = $(this).data("id");
      
          console.log(id);
      
          $.ajax("/api/savedarticles/notes/${id}/delete", { type: "DELETE" }).then(
            response => {
              $(this).parent().parent().parent().remove();
            }
          );
        });
        </script>
        `;

        $("#articleNotes .modal-content .collection").append(htmlNotes);
      }
    });
  }

  $("#saveNotes").on("click", function(event) {
    event.preventDefault();

    const id = $(this).data("id");
    const notes = $("#txtNotes").val();

    $.post("/api/savedarticles/notes", { id, notes }).then(response => {
      $("#txtNotes").val("");
      M.textareaAutoResize($("#txtNotes"));
      loadNotes(id);
    });
  });
});
