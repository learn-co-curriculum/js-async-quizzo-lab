let categories;
let currentClue;

function requestCategories(){
  return fetch('http://jservice.io/api/categories?count=4')
}

function setCategories(){
  let promise = requestCategories()
  return promise.then((response) => {
    return response.json()
  }).then((categoriesResponse) => {
    return categories = categoriesResponse
  })
}

function requestAndDisplayCategories(){
  let categoryContainer = document.querySelector('.category-container')
  return setCategories().then((categories) => {
    displayCategoriesContainer()
    categoryContainer.innerHTML = makeCategories(categories);
  })
}

function displayCategoriesContainer(){
  let categoryContainer = document.querySelector('.category-container')
  categoryContainer.innerHTML = ''
  categoryContainer.classList.remove('hide')
}

function makeCategories(categories){
    return categories.map((category) => {
      return `<div class="col s3" > <a class="waves-effect waves-light btn">${category.title}</a> </div>`
    }).join(' ')
}

function displayQuestionNumbers(numbers, categories){

  let questionContainer = document.querySelector('.question-container')
  questionContainer.innerHTML = ''
  questionContainer.classList.remove('hide')
  questionContainer.innerHTML =  makeRows(numbers, categories)
}

function makeRow(number, categories){
  if(!categories || categories.length == 0){
    throw new Error('must have at least one category')
  }
  if(!categories.every(category => category.id)){
    throw new Error('category must have an id')
  }
  return categories.map((category) => {
    return `<div class="col s3" >
        <div data-category-id=${category.id} class="waves-effect waves-light btn "> ${number} </div>
      </div>`
  }).join(' ')
}

function makeRows(numbers, categories){
  return numbers.map((number) => {
    return `<div class="row">
              ${makeRow(number, categories)}
            </div>`
  }).join(' ')
}



function requestClue(categoryId, value){

  return fetch(`http://jservice.io/api/clues?category=${categoryId}&value=${value}`).then(
    function(response){
      return response.json()
    }
  )
}

function displayClue(clue){

  let questionContainer = document.querySelector('.question-container').classList.add('hide')
  let categoryContainer = document.querySelector('.category-container').classList.add('hide')

  let answerContainer = document.querySelector('.answer-container')
  let clueTextContainer = document.querySelector('.clue-text')
  clueTextContainer.classList.remove('hide')
  document.querySelector('.clue-container').classList.remove('hide')
  document.querySelector('.answer-container').classList.remove('hide')
  answerContainer.append(clue.question)
}

function onClickAskQuestion(){
  let questionBtns = document.querySelector('.question-container').querySelectorAll('.btn')

  questionBtns.forEach((btn) => {
    btn.addEventListener('click', function(event){
      let value = event.target.innerText
      let categoryId = btn.dataset.categoryId

      requestClue(categoryId, value).then((response) => {
        currentClue = response[0]
        displayClue(response[0])
      })
    })
  })
}



function checkAnswer(clue, answer){
  return clue.answer === answer
}

function resetAfterTwoSeconds(){
  return new Promise(function(resolve){
    setTimeout(function(){
      resolve()
    }, 2000)
  }).then(function(){
    setupPage()
  })
}

function checkAnswerAndDisplay(clue, answer){
  let answerContainer = document.querySelector('.answer-container')
  answerContainer.innerText = ''
  if(checkAnswer(clue, answer)){
    answerContainer.append("That's right")
  } else {
    answerContainer.append(`Sorry, we were looking for: ${clue.answer}`)
  }
  resetAfterTwoSeconds()
}

function checkAndUpdateOnSubmit(){
  let form = document.querySelector('form')
  let input = form.querySelector('input')
  form.addEventListener('submit', function(event){
    event.preventDefault()
    checkAnswerAndDisplay(currentClue, input.value)
  })
}


function removeAnswerDisplayAndInput(){

  let answerContainer = document.querySelector('.answer-container')
  answerContainer.innerText = ''
  answerContainer.classList.add('hide')
  document.querySelector('input[type="text"]').value = ''
}

function hideClueContainer(){
  let clueContainer = document.querySelector('.clue-container')
  clueContainer.classList.add('hide')
}

function setupPage(){
  requestAndDisplayCategories().then(function(){
    let numbers = [200, 400, 600, 800, 1000]
    currentClue = ''
    removeAnswerDisplayAndInput()
    displayQuestionNumbers(numbers, categories)
    hideClueContainer()
    onClickAskQuestion()
    checkAndUpdateOnSubmit()
  })
}
