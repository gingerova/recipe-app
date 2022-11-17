const mealsEl = document.getElementById('meals');
const favContainer = document.getElementById('fav-meals');
const mealPopup = document.getElementById('meal-popup');
const mealInfoEl = document.getElementById('meal-info');
const popupCloseBtn = document.getElementById('close-popup');
searchTerm =document.getElementById('search-term');
searchBtn =document.getElementById('search');

getRandomMeal();
fetchFavMeals();
async function getRandomMeal(){
const resp= await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
const respData =await resp.json();
const randomMeal=respData.meals[0];
console.log(randomMeal);
addMeal(randomMeal, true);
}

async function getMealbyId(id){
const resp= await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id);
const respData = await resp.json();

const meal = respData.meals[0];

return meal;
}

async function getMealBySearch(term){
const resp= await fetch("https:/www.themealdb.com/api/json/v1/1/search.php?s="+term);
const respData = await resp.json();
const search = respData.meals;
console.log(meals);
return search;
}

function addMeal(mealData, random = false){
    const meal = document.createElement('div');
    meal.classList.add('meal');
    meal.innerHTML = `
        <div class="meal-header">
            ${
                random
                    ? `
            <span class="random"> Random Recipe </span>`
                    : ""
            }
            <img
                src="${mealData.strMealThumb}"
                alt="${mealData.strMeal}"
            />
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `;

const btn = meal.querySelector('.meal-body .fav-btn');
btn.addEventListener('click', () => {
    if(btn.classList.contains("active")){
        removeMealFromLS(mealData.idMeal)
        btn.classList.remove("active");
    }
    else{
        addMealToLS(mealData.idMeal)
        btn.classList.add("active");
    }
    
fetchFavMeals();
});
meal.addEventListener('click', () => {
    showMealInfo(mealData);
});

mealsEl.appendChild(meal);
}

function removeMealFromLS(mealId){
    
    const mealIds = getMealsFromLS();
    localStorage.setItem("mealIds",JSON.stringify(mealIds.filter(id=> id!== mealId)));
}
function addMealToLS(mealId){
    const mealIds = getMealsFromLS();

    localStorage.setItem("mealIds",JSON.stringify([...mealIds, mealId]));
}

function getMealsFromLS(){
    const mealIds=JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals(){
    
favContainer.innerHTML="";
    const mealIds = getMealsFromLS();

    for(let i=0; i<mealIds.length;i++){
        const mealId = mealIds[i];
        meal = await getMealbyId(mealId);
        addMealToFav(meal);
    }
}

function addMealToFav(mealData){
    
    const favMeal = document.createElement('li');
    favMeal.innerHTML=`<img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"><span>${mealData.strMeal}</span>
    <button class="clear"><i class="fas fa-window-close"></i></button>`;

    const btn = favMeal.querySelector('.clear');
    btn.addEventListener('click', () => {
    removeMealFromLS(mealData.idMeal);
    fetchFavMeals();
    });
    favMeal.addEventListener('click', () => {
        showMealInfo(mealData);
    });
favContainer.appendChild(favMeal)

}

function showMealInfo(mealData){
    mealInfoEl.innerHTML="";
 const mealEl = document.createElement('div');

 const ingredients = [];
 for(let i=1; i<=20;i++){
    if(mealData['strIngredient'+i]){
        ingredients.push(`${mealData['strIngredient'+i]} - ${mealData['strMeasure'+i]}`)
    }else{
        break;
    }
 }

 mealEl.innerHTML=`<h1>${mealData.strMeal}</h1>
 <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">

<div>
 <p>${mealData.strInstructions}</p>
 <h3>Ingredients:</h3>
 <ul>
    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
 </ul>`;
mealInfoEl.appendChild(mealEl);
mealPopup.classList.remove('hidden');
}

searchBtn.addEventListener('click',async () => {
    mealsEl.innerHTML='';
const search= searchTerm.value;
const meals = await getMealBySearch(search);
if(meals){
    meals.forEach(meal => {
        addMeal(meal);
        });
}

});

popupCloseBtn.addEventListener("click", () => {
    mealPopup.classList.add("hidden");

});