fetch("/pages/components/header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header").innerHTML = data;
  })
  .catch((error) => {
    console.error("Không thể load header:", error);
  });



  fetch("/pages/components/footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
    initFooter();
  })
  .catch((error) => {
    console.error("Không thể load footer:", error);
  });
