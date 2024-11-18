let data;
main();

async function main() {
  const response = await fetch('./data.json');
  data = await response.json();
  console.log(data);

  const categories = document.getElementById('category');
  for (const category in data.categories) {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = convert.toTextCase(category);
    categories.appendChild(option);
  }
  categories.value = 'default';
  categories.addEventListener('change', onCategoryChange);
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
};

function onCategoryChange(event) {
  const container = document.getElementById('card-container');
  container.innerHTML = '';

  const category = data.categories[event.target.value];
  console.log('changed to', event.target.value);

  for (key in category.groups) {
    new Group(key, category.groups[key]);
  }
  setHeaderLinks(category.groups);
}

function setHeaderLinks(groups) {
  const headerLinks = document.getElementById('header-links');
  headerLinks.innerHTML = '';

  if (Object.keys(groups).length <= 1) return;

  for (group in groups) {
    const li = document.createElement('li');

    const a = document.createElement('a');
    li.appendChild(a);
    a.textContent = convert.toTextCase(group);
    a.href = `#${convert.toKebabCase(group)}`;

    headerLinks.appendChild(li);
  }
}

class Group {
  constructor(group, parts) {
    this.group = group;
    this.parts = parts;

    const div = document.createElement('div');
    div.classList.add('group');
    div.id = convert.toKebabCase(group);

    const h2 = document.createElement('h2');
    div.appendChild(h2);
    h2.textContent = convert.toTextCase(group);

    const container = document.createElement('div');
    div.appendChild(container);
    container.classList.add('card-container');

    this.parts.forEach((part) => new Card(part, container));

    document.getElementById('card-container').appendChild(div);
  }
}

class Card {
  constructor(part, parentElement) {
    this.part = part;

    if (!this.part.description) return;

    const MISSING_IMAGE_URL = 'https://partsconnect.rushcare.com/assets/img/370X370_No_Image.png';

    const card = document.createElement('div');
    card.classList.add('card');
    card.addEventListener('click', async () => {
      navigator.clipboard.writeText(this.part.partNumber);
      const toaster = document.querySelector('.toaster');
      toaster.style.opacity = 1;

      await new Promise((resolve) => setTimeout(resolve, 500));
      toaster.style.transition = 'opacity 1s ease';
      toaster.style.opacity = 0;

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toaster.style.transition = '';
    });

    const header = document.createElement('div');
    card.appendChild(header);
    header.classList.add('card-header');

    const h3 = document.createElement('h3');
    header.appendChild(h3);
    h3.textContent = this.part.description;

    const p = document.createElement('p');
    header.appendChild(p);
    p.textContent = this.part.partNumber || 'No part number provided.';

    const image = document.createElement('img');
    card.appendChild(image);
    image.src = this.part.imageURL || MISSING_IMAGE_URL;
    image.alt = this.part.description;

    parentElement.appendChild(card);
  }
}
