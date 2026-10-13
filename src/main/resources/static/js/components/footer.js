function initFooter() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const icon = question.querySelector("b");

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");

        otherItem.querySelector(".faq-question b").textContent = "+";
      });

      // Nếu cái vừa click chưa mở → mở nó
      if (!isActive) {
        item.classList.add("active");

        icon.textContent = "−";
      }
    });
  });
}
