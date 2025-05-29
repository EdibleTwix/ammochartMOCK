const cartridgeDropdown = document.getElementById('cartridge');
const weaponDropdown = document.getElementById('weapon');
const barrelDropdown = document.getElementById('barrel');
const ammoDropdown = document.getElementById('ammo');
const chartDisplay = document.getElementById('chartDisplay');
const showChartBtn = document.getElementById('showChartBtn');

const data = {
  "4.6x30mm": {
    mp7: {
      barrels: {
        "180mm": ["sub sx", "fmj sx", "action sx", "ap sx"]
      }
    }
  },
  "5.56x45mm": {
    ak19: {
      barrels: {
        "415": ["sp"]
      }
    },
    m4a1: {
      barrels: {
        "10.5": ["hpbt", "sp"],
        "14.5": ["sp"],
        "16": ["sp"],
        "18": ["sp"],
        "20": ["sp"]
      }
    }
  }
};

function updateImage() {
  const cartridge = cartridgeDropdown.value;
  const weapon = weaponDropdown.value;
  const barrel = barrelDropdown.value;
  const ammo = ammoDropdown.value;

  chartDisplay.innerHTML = ""; // Clear previous

  if (weapon && barrel && ammo) {
    const filename = `heatmaps/${cartridge}_${weapon}_${barrel}_${ammo}.png`;

    const img = document.createElement('img');
    img.src = filename;
    img.alt = 'Penetration Heatmap';
    img.onerror = function () {
      this.style.display = 'none';
      const msg = document.createElement('p');
      msg.textContent = '⚠️ No data found for that combination.';
      msg.style.color = 'red';
      msg.style.fontWeight = 'bold';
      chartDisplay.appendChild(msg);
    };

    chartDisplay.appendChild(img);
  }

  if (cartridge && data[cartridge]) {
    const combos = [];
    for (const weapon in data[cartridge]) {
      for (const barrel in data[cartridge][weapon].barrels) {
        for (const ammo of data[cartridge][weapon].barrels[barrel]) {
          combos.push(`heatmaps/${cartridge}_${weapon}_${barrel}_${ammo}.png`);
        }
      }
    }

    const list = document.createElement('ul');
    list.style.textAlign = "left";
    combos.forEach(path => {
      const item = document.createElement('li');
      item.textContent = path;
      list.appendChild(item);
    });

    chartDisplay.appendChild(document.createElement('hr'));
    chartDisplay.appendChild(list);
  }
}


cartridgeDropdown.addEventListener('change', function () {
  const cartridge = this.value;

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

  updateImage();
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

  updateImage();
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

  updateImage();
});

ammoDropdown.addEventListener('change', updateImage);
