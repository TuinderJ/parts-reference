let data;
main();

async function main() {
  const response = await fetch('./data.json');
  data = await response.json();
  console.log('---------------------------------------------------------------------------');
  console.log(data);
  console.log('---------------------------------------------------------------------------');

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
      } else {
        // TODO: Add logic to add spacing between words. This only works for one word strings right now.
        returnValue += char.toLowerCase();
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
  category.forEach((part) => {
    console.log('adding', part);
    const card = new Card(part);
    card.addToDoc(container);
  });
}

class Card {
  constructor(part) {
    this.part = part;
  }

  addToDoc(parentElement) {
    const card = document.createElement('div');
    card.classList.add('card');

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
    image.src = this.part.imageURL;
    image.alt = this.part.description;

    parentElement.appendChild(card);
  }
}
