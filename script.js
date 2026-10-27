
const BASE_RATE = 9.5304072;

const amountInput = document.getElementById("bnbAmount");
const totalOutput = document.getElementById("totalHype");
const baseOutput = document.getElementById("baseHype");
const bonusOutput = document.getElementById("bonusHype");
const tierLabel = document.getElementById("tierLabel");
const tierRange = document.getElementById("tierRange");

const tierRows = [...document.querySelectorAll(".tier-row")];
const quickButtons = [...document.querySelectorAll("[data-amount]")];

function getTier(amount) {
  if (amount >= 100) {
    return {
      bonus: 0.50,
      label: "50% bonus tier",
      range: "100+ BNB",
      index: 3
    };
  }

  if (amount >= 50) {
    return {
      bonus: 0.30,
      label: "30% bonus tier",
      range: "50–99.99 BNB",
      index: 2
    };
  }

  if (amount >= 10) {
    return {
      bonus: 0.20,
      label: "20% bonus tier",
      range: "10–49.99 BNB",
      index: 1
    };
  }

  return {
    bonus: 0.11,
    label: "11% bonus tier",
    range: "Below 10 BNB",
    index: 0
  };
}

function formatHYPE(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  });
}

function updateCalculator() {
  const amount = Math.max(
    0,
    Number.parseFloat(amountInput.value) || 0
  );

  const tier = getTier(amount);

  // Illustrative calculation; confirm against the deployed contract.
  const base = amount * BASE_RATE;
  const bonus = base * tier.bonus;
  const total = base + bonus;

  totalOutput.textContent = formatHYPE(total);
  baseOutput.textContent = `${formatHYPE(base)} HYPE`;
  bonusOutput.textContent = `${formatHYPE(bonus)} HYPE`;

  tierLabel.textContent = tier.label;
  tierRange.textContent = tier.range;

  tierRows.forEach((row, index) => {
    row.classList.toggle("active", index === tier.index);
  });

  quickButtons.forEach(button => {
    const selected =
      Number(button.dataset.amount) === amount;

    button.classList.toggle("selected", selected);
  });
}

amountInput.addEventListener("input", updateCalculator);

quickButtons.forEach(button => {
  button.addEventListener("click", () => {
    amountInput.value = button.dataset.amount;
    updateCalculator();
  });
});

// Copy the displayed participation address.
const copyButton = document.getElementById("copyAddress");
const addressElement = document.getElementById("paymentAddress");
const copyStatus = document.getElementById("copyStatus");

copyButton.addEventListener("click", async () => {
  const address = addressElement.textContent.trim();

  try {
    await navigator.clipboard.writeText(address);
    copyStatus.textContent =
      "Address copied. Verify it before sending.";
  } catch (error) {
    // Fallback for browsers that block clipboard access.
    const range = document.createRange();
    range.selectNodeContents(addressElement);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    copyStatus.textContent =
      "Select the address and copy it manually.";
  }
});

// Automatically update the copyright year.
document.getElementById("year").textContent =
  new Date().getFullYear();

// Initialize calculator.
updateCalculator();

