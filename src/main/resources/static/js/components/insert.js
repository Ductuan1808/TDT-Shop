fetch("/pages/components/header.html")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Không thể tải header: HTTP ${response.status}`);
    }
    return response.text();
  })
  .then((data) => {
    document.getElementById("header").innerHTML = data;
    if (typeof initHeader === "function") {
      initHeader();
    }
  })
  .catch((error) => {
    console.error("Không thể load header:", error);
  });



fetch("/pages/components/footer.html")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Không thể tải footer: HTTP ${response.status}`);
    }
    return response.text();
  })
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
    if (typeof initFooter === "function") {
      initFooter();
    }
  })
  .catch((error) => {
    console.error("Không thể load footer:", error);
  });
