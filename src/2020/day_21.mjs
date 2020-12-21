import * as fs from 'node:fs';

class Food {
  constructor(data) {
    const [ingredients, allergens] = data.split(' (contains ');
    this.ingredients = ingredients.split(' ');
    this.allergens = allergens.slice(0, -1).split(', ');
  }
}

const foodList = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Food(data));

const allIngredients = [...new Set(foodList.map(food => food.ingredients).flat())];
const allAllergens = [...new Set(foodList.map(food => food.allergens).flat())];

const allergenMap = allAllergens.reduce((acc, cur) => {
  const foodsWithAllergen = foodList.filter(food => food.allergens.includes(cur));
  return {
    ...acc,
    [cur]: allIngredients.filter(ingredient => foodsWithAllergen.every(food => food.ingredients.includes(ingredient))),
  };
}, {});

const identified = new Set([]);

while (true) {
  const identifiable = Object.entries(allergenMap).find(([key, value]) => value.length === 1 && !identified.has(key));
  if (!identifiable) break;
  const [identifiableAllergen, [identifiableIngredient]] = identifiable;

  for (const allergen of allAllergens) {
    if (allergen !== identifiableAllergen) {
      const i = allergenMap[allergen].findIndex(ingredient => ingredient === identifiableIngredient);
      if (i >= 0) allergenMap[allergen].splice(i, 1);
    }
  }

  identified.add(identifiableAllergen);
}

const allergenicIngredients = Object.values(allergenMap).flat();

const numberOfSaveUses = foodList
  .map(food => food.ingredients.filter(ingredient => !allergenicIngredients.includes(ingredient)))
  .reduce((acc, cur) => acc + cur.length, 0);

console.log(`Part 1: ${numberOfSaveUses}`);

const dangerousIngredientList = Object
  .entries(allergenMap)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([_, [value]]) => value)
  .join();

console.log(`Part 2: ${dangerousIngredientList}`);
