document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems, {});
});

// Or with jQuery

$(document).ready(function() {
  $(".sidenav").sidenav();
});
