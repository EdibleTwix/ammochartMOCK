const cartridgeDropdown = document.getElementById('cartridge');
const weaponDropdown = document.getElementById('weapon');
const barrelDropdown = document.getElementById('barrel');
const ammoDropdown = document.getElementById('ammo');
const chartDisplay = document.getElementById('chartDisplay');

// Full dataset grouped by cartridge → weapon → barrel → ammo
const data = {
  "4.6x30mm": {
    mp7: {
      barrels: {
        "180mm": ["sub sx", "fmj sx", "action sx", "ap sx"]
      }
    }
  }
};

cartridgeDropdown.addEventListener('change', function () {
  const cartridge = this.value;

  // Reset all dependent dropdowns
  weaponDropdown.innerHTML = `<option value="">Select Weapon</option>`;
  barrelDropdown.innerHTML = `<option value="">Select Barrel</option>`;
  ammoDropdown.innerHTML = `<option value="">Select Ammo</option>`;
  weaponDropdown.disabled = true;
  barrelDropdown.disabled = true;
  ammoDropdown.disabled = true;

  if (cartridge && data[cartridge]) {
    Object.keys(data[cartridge]).forEach(weapon => {
      const opt = document.createElement('option');
      opt.value = weapon;
      opt.textContent = weapon.toUpperCase();
      weaponDropdown.appendChild(opt);
    });

    weaponDropdown.disabled = false;
  }
});

weaponDropdown.addEventListener('change', function () {
  const cartridge = cartridgeDropdown.value;
  const weapon = this.value;

  barrelDropdown.innerHTML = `<option value="">Select Barrel</option>`;
  ammoDropdown.innerHTML = `<option value="">Select Ammo</option>`;
  barrelDropdown.disabled = true;
  ammoDropdown.disabled = true;

  if (cartridge && weapon && data[cartridge][weapon]) {
    Object.keys(data[cartridge][weapon].barrels).forEach(barrel => {
      const opt = document.createElement('option');
      opt.value = barrel;
      opt.textContent = barrel;
      barrelDropdown.appendChild(opt);
    });

    barrelDropdown.disabled = false;
  }
});

barrelDropdown.addEventListener('change', function () {
  const cartridge = cartridgeDropdown.value;
  const weapon = weaponDropdown.value;
  const barrel = this.value;

  ammoDropdown.innerHTML = `<option value="">Select Ammo</option>`;
  ammoDropdown.disabled = true;

  if (cartridge && weapon && barrel && data[cartridge][weapon].barrels[barrel]) {
    data[cartridge][weapon].barrels[barrel].forEach(ammo => {
      const opt = document.createElement('option');
      opt.value = ammo;
      opt.textContent = ammo.toUpperCase();
      ammoDropdown.appendChild(opt);
    });

    ammoDropdown.disabled = false;
  }
});

document.getElementById('chartForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const weapon = weaponDropdown.value;
  const barrel = barrelDropdown.value;
  const ammo = ammoDropdown.value;

  if (!weapon || !barrel || !ammo) {
    alert('Please select all fields.');
    return;
  }

  const filename = `heatmaps/${weapon}_${barrel}_${ammo}.png`;

chartDisplay.innerHTML = `
  <img src="${filename}" alt="Penetration Heatmap"
       onerror="this.style.display='none'; 
                const msg = document.createElement('p');
                msg.textContent = '⚠️ No data found for that combination.';
                msg.style.color = 'red';
                msg.style.fontWeight = 'bold';
                this.parentElement.appendChild(msg);">
`;

});
