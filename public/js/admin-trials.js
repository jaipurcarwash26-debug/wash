document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("trialDoneModal");
  const form = document.getElementById("trialDoneForm");
  const customerName = document.getElementById("trialModalCustomer");
  const reasonField = document.getElementById("trialReasonField");
  const reasonInput = document.getElementById("trialReason");
  const submitBtn = document.getElementById("submitTrialDecision");

  if (!modal || !form || !submitBtn) {
    console.error("Trial modal elements are missing.");
    return;
  }

  const decisionInputs = form.querySelectorAll('input[name="decision"]');

  function updateDecisionState() {
    const selected = form.querySelector('input[name="decision"]:checked');

    const isNo = selected?.value === "NO";

    reasonField.hidden = !isNo;
    reasonInput.required = isNo;

    submitBtn.disabled = !selected;

    if (!selected) {
      submitBtn.textContent = "Continue";
    } else if (isNo) {
      submitBtn.textContent = "Confirm trial closure";
    } else {
      submitBtn.textContent = "Continue to subscription";
    }
  }

  function openModal(button) {
    form.reset();

    form.action = button.dataset.actionUrl;
    customerName.textContent = button.dataset.customerName || "this customer";

    reasonField.hidden = true;
    reasonInput.required = false;
    submitBtn.disabled = true;
    submitBtn.textContent = "Continue";

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("trial-modal-open");

    const firstRadio = form.querySelector('input[name="decision"]');

    firstRadio?.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("trial-modal-open");
  }

  document.querySelectorAll(".trial-done-btn").forEach((button) => {
    button.addEventListener("click", () => openModal(button));
  });

  document
    .getElementById("closeTrialModal")
    ?.addEventListener("click", closeModal);

  document
    .getElementById("cancelTrialModal")
    ?.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  decisionInputs.forEach((radio) => {
    radio.addEventListener("change", updateDecisionState);
  });

  form.addEventListener("submit", (event) => {
    const selected = form.querySelector('input[name="decision"]:checked');

    if (!selected) {
      event.preventDefault();
      alert("Please select YES or NO.");
      return;
    }

    if (selected.value === "NO" && !reasonInput.value.trim()) {
      event.preventDefault();
      reasonInput.focus();
      alert("Please enter the reason for not taking a subscription.");
      return;
    }

    if (!form.action) {
      event.preventDefault();
      alert("The trial decision URL is missing. Please reopen the popup.");
    }
  });
});
