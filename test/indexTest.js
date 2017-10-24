const expect = chai.expect;

describe('index', () => {
  describe('requestCategories', () => {
    let fetchSpy
    beforeEach(function() {
  		 fetchSpy = sinon.stub(window, 'fetch')
    })

    afterEach(function(){
      window.fetch.restore()
    })

    it('uses fetch the api to request categories', function(){
      requestCategories()
      expect(fetchSpy.calledOnce).to.eq(true)
    })

    it('calls the jservice api to request four categories', function(){
      requestCategories()
      expect(fetchSpy.calledWith('http://jservice.io/api/categories?count=4')).to.eq(true)
    })
  })

  describe('setCategories', function(){
    it('requests and sets the categories', function(){
      setCategories().then(function(){
        expect(categories.length).to.eq(4)
      })
    })
  })

  describe('displayCategoriesContainer', function(){
    let categoryContainer = document.querySelector('.category-container')

    it('first clears the content in the categories-container', function(){
      displayCategoriesContainer()
      expect(categoryContainer.innerHTML).to.eq('')
    })

    it('removes the hide class from the categories-container', function(){
      displayCategoriesContainer()
      expect(Array.from(categoryContainer.classList)).to.not.include('hide')
    })
  })

  describe('makeCategories', function(){
    it('returns a new div with a column for every category', function(){
      let categories = [{title: 'foo'}, {title: 'bar'}]
      expect(makeCategories(categories).trim()).to.eq('<div class="col s3" > <a class="waves-effect waves-light btn">foo</a> </div> <div class="col s3" > <a class="waves-effect waves-light btn">bar</a> </div>'.trim())
    })
  })

  describe('requestAndDisplayCategories', () => {
    it('requests the categories and displays them in the categories container', function(){
      let categoryContainer = document.querySelector('.category-container')
      requestAndDisplayCategories().then(() => {
        expect(categoryContainer.querySelectorAll('.btn').length).to.eq(4)
      })
    })

    it('adds a div with a class of col s3 to wrap each button', function(){
      let categoryContainer = document.querySelector('.category-container')
      requestAndDisplayCategories().then(() => {
        expect(categoryContainer.querySelectorAll('.s3').length).to.eq(4)
      })
    })
  })

  describe('makeRow', function(){
    it('returns a string of div with class col s3 for each category', function(){
      let number = 80
      let categories = [{id: 11545, title: 'Great Books'}, {id: 11546, title: 'Good Movies'}, {id: 11547, title: 'Bad Sports Teams'}]
      expect(makeRow(number, categories).match(/<div class="col s3" >/g).length).to.eq(3)
    })

    it('sets a data attribute with a category id equal to the id of category on each button div', function(){
      let number = 80
      let categories = [{id: 3, title: 'Great Books'}, {id: 4, title: 'Good Movies'}, {id: 5, title: 'Bad Sports Teams'}]
      // [345] means 3 or 4 or 5 with regex
      expect(makeRow(number, categories).match(/<div data-category-id=[345] class="waves-effect waves-light btn "> 80 /g).length).to.eq(3)
    })

    it('sets a data attribute with a category id equal to the id of category on each button div', function(){
      let categories = [{id: 3, title: 'Great Books'}, {id: 4, title: 'Good Movies'}, {id: 5, title: 'Bad Sports Teams'}]
      expect(makeRow(80, categories).match(/80/g).length).to.eq(3)
      expect(makeRow(100, categories).match(/100/g).length).to.eq(3)
    })
  })

  describe('makeRows', function(){
    it('returns a row for every category', function(){
      let numbers = [80, 100, 150, 200]
      let categories = [{id: 3, title: 'Great Books'}, {id: 4, title: 'Good Movies'}, {id: 5, title: 'Bad Sports Teams'}]
      expect(makeRows(numbers, categories).match(/div class="row"/g).length).to.eq(4)
    })
  })

  describe('displayQuestionNumbers', function(){
    let questionContainer
    let numbers;
    let categories;

    beforeEach(function(){
      questionContainer = document.querySelector('.question-container')
      numbers = [100, 150, 200]
      categories = [{id: 11545, title: 'Great Books'}, {id: 11546, title: 'Good Movies'}, {id: 11547, title: 'Bad Sports Teams'}]
    })

    it('appends a row for each number', function(){
      displayQuestionNumbers(numbers, categories)
      expect(questionContainer.querySelectorAll('.row').length).to.eq(3)
    })
  })

  describe('requestClue', () => {
    let fetchSpy
    beforeEach(function() {
  		fetchSpy = sinon.stub(window, 'fetch').returns(new Promise(function(){}))
    })

    afterEach(function(){
      window.fetch.restore()
    })

    it('uses fetch the api', function(){
      let categoryId = 11545
      let value = 200
      requestClue(categoryId, value)
      expect(fetchSpy.calledOnce).to.eq(true)
    })

    it('calls the jservice api', function(){
      let categoryId = 11545
      let value = 200
      requestClue(categoryId, value)
      expect(fetchSpy.calledWith('http://jservice.io/api/clues?category=11545&value=200')).to.eq(true)
    })
  })

  describe('displayClue', function(){
    // need more here
    let clue;


    beforeEach(function(){
      clue = {id: 87936, answer: "egg nog",
      question: "George Washington was a fan of this holiday drink but used whiskey & brandy as well as rum", value: 200,
      airdate: "2009-07-10T12:00:00.000Z"}
    })

    it('hides the question-container and category-container', function(){
      let questionContainer = document.querySelector('.question-container')
      let categoryContainer = document.querySelector('.category-container')
      expect(Array.from(categoryContainer.classList)).to.not.include('hide')
      expect(Array.from(questionContainer.classList)).to.not.include('hide')
      displayClue(clue)
      expect(Array.from(questionContainer.classList)).to.include('hide')
      expect(Array.from(categoryContainer.classList)).to.include('hide')
    })

    it('displays the clue-container and answer-container', function(){
      let clueContainer = document.querySelector('.clue-container')
      let answerContainer = document.querySelector('.answer-container')

      answerContainer.classList.add('hide')
      clueContainer.classList.add('hide')
      displayClue(clue)
      expect(Array.from(answerContainer.classList)).to.not.include('hide')
      expect(Array.from(clueContainer.classList)).to.not.include('hide')
    })

    it('appends the clue to the answer-container', function(){
      let answerContainer = document.querySelector('.answer-container')
      displayClue(clue)
      expect(answerContainer.innerHTML).to.include("George Washington")
    })
  })

  describe('checkAnswer', function(){
    let clue;
    beforeEach(function(){
      clue = {id: 87936, answer: "egg nog",
      question: "George Washington was a fan of this holiday drink but used whiskey & brandy as well as rum", value: 200,
      airdate: "2009-07-10T12:00:00.000Z"}
    })

    it('returns false when the answer does not match', function(){
      let answer = 'egg nogger'
      expect(checkAnswer(clue, answer)).to.eq(false)
    })

    it('returns true when the answer does match', function(){
      let answer = 'egg nog'
      expect(checkAnswer(clue, answer)).to.eq(true)
    })
  })

  describe('onClickAskQuestion', function(){
    let fetchSpy
    let event;
    let wrapper;
    let button;
    let displayClueSpy;

    beforeEach(function() {
  		 requestClueSpy = sinon.stub(window, 'requestClue')
       displayClueSpy = sinon.stub(window, 'displayClue')
       requestClueSpy.onCall(0).returns(new Promise(function(){}))
       event = new MouseEvent('click', {
         'view': window,
         'bubbles': true,
         'cancelable': true
       });

      wrapper = document.querySelector('.question-container');
      wrapper.innerHTML = '<div class="btn"> foobar </div>'

      button = wrapper.querySelector('.btn');
    })

    afterEach(function(){
      window.requestClue.restore()
      window.displayClue.restore()
    })

    it('adds a click event listener on all question buttons so that when clicked requests clue', function(){
      onClickAskQuestion()

      button.dispatchEvent(event)
      expect(requestClueSpy.calledOnce).to.eq(true)
    })

    it('adds a click event listener on all question buttons so that when clicked displays clue', function(){
      onClickAskQuestion()
      button.dispatchEvent(event)
      setTimeout(function(){
        expect(displayClueSpy.calledOnce).to.eq(true)
      }, 200)
    })
  })

  describe('checkAnswerAndDisplay', function(){
    let clue;
    let answerContainer
    beforeEach(function(){
      clue = {id: 87936, answer: "egg nog",
      question: "George Washington was a fan of this holiday drink but used whiskey & brandy as well as rum", value: 200,
      airdate: "2009-07-10T12:00:00.000Z"}
      answerContainer = document.querySelector('.answer-container')
    })

    it('appends the text Thats right when correct', function(){
      checkAnswerAndDisplay(clue, "egg noggg")
      expect(answerContainer.innerText.toLowerCase()).to.eq('sorry, we were looking for: egg nog')
    })
  })

  describe('checkAnswerAndDisplay', function(){
    let clue = {answer: 'George Washington'}
    let answerContainer = document.querySelector('.answer-container')

    it('displays Thats right if the user types in the correct answer', function(){
      let answer = 'George Washington'
      checkAnswerAndDisplay(clue, answer)
      expect(answerContainer.innerText).to.eq("That's right")
    })

    it('displays Sorry, we were looking for {answer}, after the wrong answer', function(){
      let answer = 'Tom Jefferson'
      checkAnswerAndDisplay(clue, answer)
      expect(answerContainer.innerText).to.eq("Sorry, we were looking for: George Washington")
    })

    it('calls resetAfterTwoSeconds', function(){
      let resetSpy = sinon.stub(window, 'resetAfterTwoSeconds')
      let answer = 'Tom Jefferson'
      checkAnswerAndDisplay(clue, answer)
      expect(resetSpy.calledOnce).to.eq(true)
      resetAfterTwoSeconds.restore()
    })
  })

  describe('resetAfterTwoSeconds', function(){
    it('returns a promise', function(){
      expect(resetAfterTwoSeconds()).to.be.a('promise')
    })

    it('waits two seconds and then calls setupPage', function(){
      let setupPageSpy = sinon.spy(window, 'setupPage')
      resetAfterTwoSeconds().then(
        function(){
          expect(setupPageSpy.calledOnce).to.eq(true)
        }

      )
      setupPage.restore()
    })
  })

  describe('checkAndUpdateOnSubmit', function(){
    it('checks and updates', function(){
      checkAndUpdateOnSubmit()
    })
  })

  describe('checkAndUpdateOnSubmit', function(){
    let form = document.querySelector('form')
    let submit = form.querySelector('input[type="submit"]')
    let formTextInput = form.querySelector('input[type="text"]')
    currentClue = {answer: 'some good answer'}
    let clickEvent = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    beforeEach(function(){
      formTextInput.value = 'what'
    })

    it('calls checkAnswerAndDisplay when a form is submitted', function(){

      let checkAnswerAndDisplaySpy = sinon.spy(window, 'checkAnswerAndDisplay')
      checkAndUpdateOnSubmit()
      submit.dispatchEvent(clickEvent)
      setTimeout(function(){
        expect(checkAnswerAndDisplaySpy.calledOnce).to.eq(true)
      }, 200)
      checkAnswerAndDisplay.restore()
    })
  })

  describe('removeAnswerDisplayAndInput', function(){
    let answerContainer = document.querySelector('.answer-container')
    let clueContainer = document.querySelector('.clue-container')

    it('clears the text of the answer-container', function(){
      answerContainer.innerText = 'a good answer'
      removeAnswerDisplayAndInput()
      expect(answerContainer.innerText).to.eq('')
    })

    it('hides the answer-container', function(){
      answerContainer.classList.remove('hide')
      removeAnswerDisplayAndInput()
      expect(Array.from(answerContainer.classList)).to.include('hide')
    })

    it('sets the forms input to be blank', function(){
      let textInput = clueContainer.querySelector('input[type="text"]')
      textInput.value = 'answer attempt'
      removeAnswerDisplayAndInput()
      expect(textInput.value).to.eq('')
    })
  })

  describe('hideClueContainer', function(){
    let clueContainer = document.querySelector('.clue-container')

    it('hides the clue container', function(){
      clueContainer.classList.remove('hide')
      hideClueContainer()
      expect(Array.from(clueContainer.classList)).to.include('hide')
    })
  })
})
