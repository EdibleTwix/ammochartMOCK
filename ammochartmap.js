const cartridgeDropdown = document.getElementById('cartridge');
const weaponDropdown = document.getElementById('weapon');
const barrelDropdown = document.getElementById('barrel');
const ammoDropdown = document.getElementById('ammo');
const chartDisplay = document.getElementById('chartDisplay');

const allFiles = [
  "5.56x45_ak19_415mm_sp",
  "5.56x45_m4a1_10.5in_hpbt",
  "5.56x45_m4a1_10.5in_sp",
  "5.56x45_m4a1_14.5in_sp",
  "5.56x45_m4a1_16in_sp",
  "5.56x45_m4a1_18in_sp",
  "5.56x45_m4a1_20in_sp"
];

const parsedData = allFiles.map(filename => {
  const [cartridge, weapon, barrel, ammo] = filename.split('_');
  return { cartridge, weapon, barrel, ammo, path: `heatmaps/${filename}.png` };
});

function populateDropdowns() {
  const uniqueCartridges = [...new Set(parsedData.map(d => d.cartridge))];
  const uniqueWeapons = [...new Set(parsedData.map(d => d.weapon))];
  const uniqueBarrels = [...new Set(parsedData.map(d => d.barrel))];
  const uniqueAmmos = [...new Set(parsedData.map(d => d.ammo))];

  const fill = (dropdown, options, label) => {
    dropdown.innerHTML = `<option value="">Select ${label}</option>`;
    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      dropdown.appendChild(option);
    });
    dropdown.disabled = false;
  };

  fill(cartridgeDropdown, uniqueCartridges, "Cartridge");
  fill(weaponDropdown, uniqueWeapons, "Weapon");
  fill(barrelDropdown, uniqueBarrels, "Barrel");
  fill(ammoDropdown, uniqueAmmos, "Ammo");
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
    chartDisplay.innerHTML = '<p style="color:red">⚠️ No matching heatmaps found.</p>';
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

[cartridgeDropdown, weaponDropdown, barrelDropdown, ammoDropdown].forEach(dropdown => {
  dropdown.addEventListener('change', updateImages);
});

document.addEventListener('DOMContentLoaded', () => {
  populateDropdowns();
  updateImages();
});
