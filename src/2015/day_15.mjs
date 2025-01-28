import fs from 'node:fs';

class Ingredient {
  constructor(data) {
    const [name, properties] = data.split(': ');
    this.name = name;
    this.properties = Object.fromEntries(
      properties.split(', ').map(prop => {
        const [key, value] = prop.split(' ');
        return [key, Number(value)];
      }),
    );
  }
}

const ingredients = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Ingredient(data));

const getScore = (recipe) => {
  const properties = ['capacity', 'durability', 'flavor', 'texture'];
  const propertyScores = properties.map(prop => ingredients.reduce((acc, cur, i) => acc + (cur.properties[prop] * recipe[i]), 0));
  return propertyScores.map(score => Math.max(score, 0)).reduce((acc, cur) => acc * cur, 1);
};

const findMaxScore = (ingredients, totalTeaspoons, ingredientIndex = 0, currentRecipe = [], currentSum = 0) => {
  if (ingredientIndex === ingredients.length - 1) {
    currentRecipe.push(totalTeaspoons - currentSum);
    const score = getScore(currentRecipe);
    currentRecipe.pop();
    return score;
  }

  let maxScore = 0;
  for (let i = 0; i <= totalTeaspoons - currentSum; i++) {
    currentRecipe.push(i);
    maxScore = Math.max(maxScore, findMaxScore(ingredients, totalTeaspoons, ingredientIndex + 1, currentRecipe, currentSum + i));
    currentRecipe.pop();
  }

  return maxScore;
};

const maxScore = findMaxScore(ingredients, 100);
console.log(`Part 1: ${maxScore}`);
