let data;
main();

async function main() {
  let response = await fetch('./data.json');
  data = await response.json();
  console.log(data);

  const categories = document.querySelector('form').querySelector('select[name="category"]');
  for (const category in data.categories) {
    addOption({ parentElement: categories, value: category });
  }
  addOption({ parentElement: categories, value: 'new', textContent: 'New...' });
  categories.value = 'default';
  document.querySelectorAll('select').forEach((select) => select.addEventListener('change', onSelectChange));

  document.querySelector('form').addEventListener('submit', onSubmit);
}

const convert = {
  toTextCase: (string) => {
    let returnValue = '';
    for (let i = 0; i < string.length; i++) {
      const char = string[i];
      if (i == 0) {
        returnValue += char.toUpperCase();
      } else if (char === char.toUpperCase()) {
        returnValue += ` ${char}`;
      } else {
        returnValue += char;
      }
    }
    return returnValue;
  },

  toKebabCase: (string) => {
    let returnValue = '';
    for (let i = 0; i < string.length; i++) {
      const char = string[i];
      if (i == 0) {
        returnValue += char.toLowerCase();
      } else if (char === char.toUpperCase()) {
        returnValue += `-${char.toLowerCase()}`;
      } else {
        returnValue += char;
      }
    }
    return returnValue;
  },

  toSnakeCase: (string) => {
    let returnValue = '';
    for (let i = 0; i < string.length; i++) {
      const char = string[i];
      if (i == 0) {
        returnValue += char.toLowerCase();
      } else if (char === ' ') {
        returnValue += string[i + 1].toUpperCase();
        i++;
      } else {
        returnValue += char;
      }
    }
    return returnValue;
  },
};

function addOption({ parentElement, value, textContent = null }) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = textContent ? textContent : convert.toTextCase(value);
  parentElement.appendChild(option);
}

function onSelectChange(event) {
  switch (event.target.name) {
    case 'category':
      const categoryText = document.getElementById('category-text');
      const groupSelect = document.querySelector('[name="group"]');
      const groupText = document.getElementById('group-text');
      groupSelect.innerHTML = '';
      switch (event.target.value) {
        case 'new':
          categoryText.style.display = 'inline-block';
          categoryText.removeAttribute('disabled');
          groupText.style.display = 'inline-block';
          groupText.removeAttribute('disabled');
          break;

        default:
          categoryText.style.display = 'none';
          categoryText.setAttribute('disabled', '');

          for (group in data.categories[event.target.value].groups) {
            addOption({ parentElement: groupSelect, value: group });
          }
          break;
      }
      groupSelect.value = 'default';
      addOption({ parentElement: groupSelect, value: 'new', textContent: 'New...' });
      break;

    case 'group':
      const groupyText = document.getElementById('group-text');
      switch (event.target.value) {
        case 'new':
          groupyText.style.display = 'inline-block';
          groupyText.removeAttribute('disabled');
          break;

        default:
          groupyText.style.display = 'none';
          groupyText.setAttribute('disabled', '');

          break;
      }
      break;

    default:
      break;
  }
}

function onSubmit(event) {
  event.preventDefault();
  let category = event.target.category[0].value;
  switch (category) {
    case 'new':
      category = convert.toSnakeCase(event.target.category[1].value);
      break;
  }
  let group = event.target.group[0].value;
  switch (group) {
    case 'new':
      group = convert.toSnakeCase(event.target.group[1].value);
      break;
  }
  const description = event.target['description'].value;
  const partNumber = event.target['part-number'].value;
  const imageURL = event.target['image-url'].value;

  if (!category || !group || !description || !partNumber) return alert('Fill everything out...');

  if (event.target.category[0].value === 'new') data.categories[category] = { groups: {} };
  if (event.target.group[0].value === 'new') data.categories[category].groups[group] = [];

  data.categories[category].groups[group].push({ description, partNumber, imageURL });
  navigator.clipboard.writeText(JSON.stringify(data));
  // window.location.href = '/HTML/Part%20Reference/index.html?';
}
