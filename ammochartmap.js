const cartridgeDropdown = document.getElementById('cartridge');
const weaponDropdown = document.getElementById('weapon');
const barrelDropdown = document.getElementById('barrel');
const ammoDropdown = document.getElementById('ammo');
const chartDisplay = document.getElementById('chartDisplay');

// Static list of all available heatmaps
const allFiles = [
  "5.56x45_ak19_415_sp",
  "5.56x45_m4a1_10.5_hpbt",
  "5.56x45_m4a1_10.5_sp",
  "5.56x45_m4a1_14.5_sp",
  "5.56x45_m4a1_16_sp",
  "5.56x45_m4a1_18_sp",
  "5.56x45_m4a1_20_sp"
];

// Parse into structured data for dropdown logic
const parsedData = allFiles.map(filename => {
  const [cartridge, weapon, barrel, ammo] = filename.split('_');
  return { cartridge, weapon, barrel, ammo, path: `heatmaps/${filename}.png` };
});

function populateDropdown(dropdown, options) {
  dropdown.innerHTML = `<option value="">Select ${dropdown.id.charAt(0).toUpperCase() + dropdown.id.slice(1)}</option>`;
  options.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt;
    option.textContent = opt.toUpperCase();
    dropdown.appendChild(option);
  });
  dropdown.disabled = options.length === 0;
}

function updateDropdowns() {
  const cartridge = cartridgeDropdown.value;
  const weapon = weaponDropdown.value;
  const barrel = barrelDropdown.value;

  // Filter from original data
  const filtered = parsedData.filter(entry =>
    (!cartridge || entry.cartridge === cartridge) &&
    (!weapon || entry.weapon === weapon) &&
    (!barrel || entry.barrel === barrel)
  );

  // Update weapon dropdown
  if (!weapon) {
    const weapons = [...new Set(filtered.map(f => f.weapon))];
    populateDropdown(weaponDropdown, weapons);
  }

  // Update barrel dropdown
  if (weapon && !barrel) {
    const barrels = [...new Set(filtered.map(f => f.barrel))];
    populateDropdown(barrelDropdown, barrels);
  }

  // Update ammo dropdown
  if (barrel) {
    const ammos = [...new Set(filtered.map(f => f.ammo))];
    populateDropdown(ammoDropdown, ammos);
  }
}

function updateImages() {
  const cartridge = cartridgeDropdown.value;
  const weapon = weaponDropdown.value;
  const barrel = barrelDropdown.value;
  const ammo = ammoDropdown.value;

  const filtered = parsedData.filter(entry =>
    (!cartridge || entry.cartridge === cartridge) &&
    (!weapon || entry.weapon === weapon) &&
    (!barrel || entry.barrel === barrel) &&
    (!ammo || entry.ammo === ammo)
  );

  chartDisplay.innerHTML = '';

  if (filtered.length === 0) {
    const msg = document.createElement('p');
    msg.textContent = '⚠️ No matching heatmaps.';
    msg.style.color = 'red';
    msg.style.fontWeight = 'bold';
    chartDisplay.appendChild(msg);
    return;
  }

  filtered.forEach(entry => {
    const img = document.createElement('img');
    img.src = entry.path;
    img.alt = `${entry.cartridge} ${entry.weapon} ${entry.barrel} ${entry.ammo}`;
    img.style.maxWidth = '100%';
    img.style.marginBottom = '1em';
    chartDisplay.appendChild(img);
  });
}

// Initial page load
document.addEventListener('DOMContentLoaded', () => {
  // Show all images on first load
  updateImages();
});

// Event listeners
cartridgeDropdown.addEventListener('change', () => {
  weaponDropdown.value = '';
  barrelDropdown.value = '';
  ammoDropdown.value = '';
  updateDropdowns();
  updateImages();
});

weaponDropdown.addEventListener('change', () => {
  barrelDropdown.value = '';
  ammoDropdown.value = '';
  updateDropdowns();
  updateImages();
});

barrelDropdown.addEventListener('change', () => {
  ammoDropdown.value = '';
  updateDropdowns();
  updateImages();
});

ammoDropdown.addEventListener('change', updateImages);
