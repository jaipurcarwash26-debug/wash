document.addEventListener("DOMContentLoaded", () => {
  // Subscription plan preview
  const select = document.getElementById("planId");
  const summary = document.getElementById("trialSelectedPlan");
  const price = document.getElementById("trialPlanPrice");
  const duration = document.getElementById("trialPlanDuration");

  if (select && summary && price && duration) {
    const updatePlan = () => {
      const option = select.options[select.selectedIndex];

      if (!option || !option.value) {
        summary.hidden = true;
        return;
      }

      const amount = Number(option.dataset.price);
      const days = Number(option.dataset.duration);

      price.textContent = Number.isFinite(amount)
        ? amount.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
          })
        : "—";

      duration.textContent =
        Number.isFinite(days) && days > 0 ? `${days} days` : "—";

      summary.hidden = false;
    };

    select.addEventListener("change", updatePlan);
    updatePlan();
  }

  // Google Maps preview for the editable location URL
  const mapInput = document.getElementById("customerMapLocationUrl");
  const mapLink = document.getElementById("mapPreviewLink");

  if (mapInput && mapLink) {
    const updateMapLink = () => {
      const value = mapInput.value.trim();

      try {
        const url = new URL(value);

        if (["http:", "https:"].includes(url.protocol)) {
          mapLink.href = url.href;
          mapLink.hidden = false;
          return;
        }
      } catch {
        // Hide the link until a valid URL is entered.
      }

      mapLink.hidden = true;
      mapLink.removeAttribute("href");
    };

    mapInput.addEventListener("input", updateMapLink);
    updateMapLink();
  }
});
