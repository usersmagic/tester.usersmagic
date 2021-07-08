let userEmail, userId, targetId;
let filters = [], filterIndex = 0, filtersEnded = false;
let questions = [], project, filterAnswer, submition, campaign, answers = {};
let question_types = {
  short_text: '', long_text: '', range: '', radio: '', checked: '',
  open_answer: '', opinion_scale: '', multiple_choice: '', yes_no: ''
};
let saveError = false;
let yourAnswer, other;
let unknownErrorTitle, tryAgainLaterText, okayText, confirmText, cancelText, required, clearAnswers, areYouSureTitle, noUpdateAfterSubmitText;


function throwUnknownError() {
  createConfirm({
    title: document.getElementById('unknown-error').innerHTML,
    text: ''
  }, res => { return });
}

function validateUserWithPassword() {
  document.querySelector('.email-page-two-wrapper').style.display = 'none';
  document.querySelector('.validate-password-wrapper').style.display = 'flex';
  document.querySelector('.password-error').innerHTML = '';
  document.getElementById('password-input').focus();
}

function validateUserAndUpdateFilters() {
  serverRequest('/auth/temporary', 'POST', {
    email: userEmail.trim()
  }, res => {
    if (!res.success && res.error == 'not_authenticated_request')
      return validateUserWithPassword();
    if (!res.success)
      return window.location = '/';

    userId = res.id;
    updateFiltersByUserId();
  });
}

function createProgressBar(index) {
  const questionWrapper = document.querySelector('.question-wrapper');
  const questionProgressBar = document.createElement('div');
  questionProgressBar.classList.add('question-progress-bar');
  questionWrapper.appendChild(questionProgressBar);

  if (filtersEnded)
    index += filters.length;

  const questionProgressBarInnerLine = document.createElement('div');
  questionProgressBarInnerLine.classList.add('question-progress-bar-inner-line');
  questionProgressBarInnerLine.style.width = ((index * questionProgressBar.offsetWidth) / ((filters.length+questions.length-1))) + 'px';
  questionProgressBar.appendChild(questionProgressBarInnerLine);
}

function createOtherOptionInput(wrapper, type, value) {
  const eachQuestionOtherOptionInputWrapper = document.createElement('div');
  eachQuestionOtherOptionInputWrapper.classList.add('each-question-other-option-input-wrapper');

  if (type == 'radio') {
    const radioChoiceWrapper = document.createElement('div');
    radioChoiceWrapper.classList.add('radio-choice-wrapper');
    if (value.length)
      radioChoiceWrapper.classList.add('selected-choice');
    const radioChoiceIcon = document.createElement('div');
    radioChoiceIcon.classList.add('radio-choice-icon');
    radioChoiceWrapper.appendChild(radioChoiceIcon);
    eachQuestionOtherOptionInputWrapper.appendChild(radioChoiceWrapper);
  } else if (type == 'checked') {
    const checkedChoiceWrapper = document.createElement('div');
    checkedChoiceWrapper.classList.add('checked-choice-wrapper');
    if (value.length)
      checkedChoiceWrapper.classList.add('selected-choice');
    const checkedChoiceIcon = document.createElement('div');
    checkedChoiceIcon.classList.add('checked-choice-icon');
    checkedChoiceIcon.classList.add('fas');
    checkedChoiceIcon.classList.add('fa-check');
    checkedChoiceWrapper.appendChild(checkedChoiceIcon);
    eachQuestionOtherOptionInputWrapper.appendChild(checkedChoiceWrapper);
  } else {
    return;
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.value = value;
  input.placeholder = other;
  eachQuestionOtherOptionInputWrapper.appendChild(input);

  wrapper.appendChild(eachQuestionOtherOptionInputWrapper);
}

function createQuestion(question, answer, index) {
  document.querySelector('.country-question-wrapper').style.display = document.querySelector('.gender-question-wrapper').style.display = document.querySelector('.birth-year-question-wrapper').style.display = 'none';
  
  if (filtersEnded) {
    const questionWrapper = document.querySelector('.question-wrapper');
    questionWrapper.style.display = 'flex';
    questionWrapper.innerHTML = '';
    createProgressBar(index);
  
    const questionInfoWrapper = document.createElement('div');
    questionInfoWrapper.classList.add('question-info-wrapper');
  
    const questionType = document.createElement('span');
    questionType.classList.add('question-type');
    questionType.innerHTML = question_types[question.type];
    questionInfoWrapper.appendChild(questionType);
  
    const questionRequired = document.createElement('span');
    questionRequired.classList.add('question-required');
    if (question.required)
      questionRequired.innerHTML = required;
    else
      questionRequired.innerHTML = notRequired; 
    questionInfoWrapper.appendChild(questionRequired);
  
    questionWrapper.appendChild(questionInfoWrapper);
  
    const questionText = document.createElement('span');
    questionText.classList.add('question-text');
    questionText.innerHTML = question.text;
    questionWrapper.appendChild(questionText);
  
    if (question.type == 'yes_no') {
      const yesnoButtonsWrapper = document.createElement('div');
      yesnoButtonsWrapper.classList.add('each-question-yesno-buttons-wrapper');
  
      const noButton = document.createElement('div');
      noButton.classList.add('each-question-no-button');
      const noI = document.createElement('i');
      noI.classList.add('fas');
      noI.classList.add('fa-times');
      noButton.appendChild(noI);
      const noSpan = document.createElement('span');
      noSpan.innerHTML = no;
      noButton.appendChild(noSpan);
      if (answer == 'no')
        noButton.classList.add('selected-no-button');
      yesnoButtonsWrapper.appendChild(noButton);
  
      const yesButton = document.createElement('div');
      yesButton.classList.add('each-question-yes-button');
      const yesI = document.createElement('i');
      yesI.classList.add('fas');
      yesI.classList.add('fa-check');
      yesButton.appendChild(yesI);
      const yesSpan = document.createElement('span');
      yesSpan.innerHTML = yes;
      yesButton.appendChild(yesSpan);
      if (answer == 'yes')
        yesButton.classList.add('selected-yes-button');
      yesnoButtonsWrapper.appendChild(yesButton);
  
      questionWrapper.appendChild(yesnoButtonsWrapper);
    } else if (question.type == 'open_answer') {
      const inputLong = document.createElement('textarea');
      inputLong.classList.add('general-input-with-border-long');
      inputLong.classList.add('answer-input'); // For DOM selection, not styling
      inputLong.placeholder = yourAnswer;
      inputLong.value = answer;
      questionWrapper.appendChild(inputLong);
    } else if (question.type == 'opinion_scale') {
      const opinionOuterWrapper = document.createElement('div');
      opinionOuterWrapper.classList.add('each-question-opinion-outer-wrapper');
  
      const opinionScaleWrapper = document.createElement('div');
      opinionScaleWrapper.classList.add('each-question-opinion-scale-wrapper');
      for (let i = question.range.min; i <= question.range.max; i++) {
        if (i != question.range.min) {
          const eachEmptyScale = document.createElement('div');
          eachEmptyScale.classList.add('each-question-empty-scale');
          opinionScaleWrapper.appendChild(eachEmptyScale);
        }
        const eachScale = document.createElement('span');
        eachScale.classList.add('each-question-each-scale');
        if (answer == i)
          eachScale.classList.add('each-question-selected-scale');
        eachScale.innerHTML = i;
        opinionScaleWrapper.appendChild(eachScale);
      }
      opinionOuterWrapper.appendChild(opinionScaleWrapper);
  
      const opinionLine = document.createElement('div');
      opinionLine.classList.add('each-question-opinion-line');
      for (let i = 0; i < 3; i++) {
        const eachOpinionLine = document.createElement('div');
        eachOpinionLine.classList.add('each-question-opinion-line-item');
        opinionLine.appendChild(eachOpinionLine);
      }
      opinionOuterWrapper.appendChild(opinionLine);
  
      const opinionTextWrapper = document.createElement('div');
      opinionTextWrapper.classList.add('each-question-opinion-text-wrapper');
      const leftOpinionText = document.createElement('span');
      leftOpinionText.classList.add('each-question-opinion-text-left');
      leftOpinionText.innerHTML = question.labels.left;
      opinionTextWrapper.appendChild(leftOpinionText);
      const middleOpinionText = document.createElement('span');
      middleOpinionText.classList.add('each-question-opinion-text-middle');
      middleOpinionText.innerHTML = question.labels.middle;
      opinionTextWrapper.appendChild(middleOpinionText);
      const rightOpinionText = document.createElement('span');
      rightOpinionText.classList.add('each-question-opinion-text-right');
      rightOpinionText.innerHTML = question.labels.right;
      opinionTextWrapper.appendChild(rightOpinionText);
      opinionOuterWrapper.appendChild(opinionTextWrapper);
  
      questionWrapper.appendChild(opinionOuterWrapper);
    } else if (question.type == 'multiple_choice') {
      question.choices.forEach(choice => {
        const eachQuestionChoice = document.createElement('div');
        eachQuestionChoice.classList.add('each-question-choice');
        if (question.subtype == 'single') {
          eachQuestionChoice.classList.add('each-question-choice-radio');
          const radioChoiceWrapper = document.createElement('div');
          radioChoiceWrapper.classList.add('radio-choice-wrapper');
          if (choice == answer)
            radioChoiceWrapper.classList.add('selected-choice');
          const radioChoiceIcon = document.createElement('div');
          radioChoiceIcon.classList.add('radio-choice-icon');
          radioChoiceWrapper.appendChild(radioChoiceIcon);
          eachQuestionChoice.appendChild(radioChoiceWrapper);
        } else {
          eachQuestionChoice.classList.add('each-question-choice-checked');
          const checkedChoiceWrapper = document.createElement('div');
          checkedChoiceWrapper.classList.add('checked-choice-wrapper');
          if (answer.includes(choice))
            checkedChoiceWrapper.classList.add('selected-choice');
          const checkedChoiceIcon = document.createElement('div');
          checkedChoiceIcon.classList.add('checked-choice-icon');
          checkedChoiceIcon.classList.add('fas');
          checkedChoiceIcon.classList.add('fa-check');
          checkedChoiceWrapper.appendChild(checkedChoiceIcon);
          eachQuestionChoice.appendChild(checkedChoiceWrapper);
        }
        const span = document.createElement('span');
        span.innerHTML = choice;
        eachQuestionChoice.appendChild(span);
        questionWrapper.appendChild(eachQuestionChoice);
      });
    }
  
    const clearQuestionButton = document.createElement('span');
    clearQuestionButton.classList.add('clear-question-button');
    clearQuestionButton.innerHTML = clearAnswers;
    questionWrapper.appendChild(clearQuestionButton);
  
    if ((!answer || !answer.length) && question.required)
      document.querySelector('.next-button').style.cursor = 'not-allowed';
    else
      document.querySelector('.next-button').style.cursor = 'pointer';
  } else {
    const questionWrapper = document.querySelector('.question-wrapper');
    questionWrapper.innerHTML = '';

    createProgressBar(index);
  
    if (question.type == 'special') {
      questionWrapper.style.display = 'none';
  
      if (question._id == 'age') {
        document.querySelector('.birth-year-question-wrapper').style.display = 'flex';
      } else if (question._id == 'gender') {
        document.querySelector('.gender-question-wrapper').style.display = 'flex';
      } else if (question._id == 'country') {
        document.querySelector('.country-question-wrapper').style.display = 'flex';
      }
    } else {
      questionWrapper.style.display = 'flex';
  
      const questionInfoWrapper = document.createElement('div');
      questionInfoWrapper.classList.add('question-info-wrapper');
    
      const questionType = document.createElement('span');
      questionType.classList.add('question-type');
      questionType.innerHTML = question_types[question.type];
      questionInfoWrapper.appendChild(questionType);
    
      const questionRequired = document.createElement('span');
      questionRequired.classList.add('question-required');
      questionRequired.innerHTML = required;
      questionInfoWrapper.appendChild(questionRequired);
    
      questionWrapper.appendChild(questionInfoWrapper);
    
      const questionText = document.createElement('span');
      questionText.classList.add('question-text');
      questionText.innerHTML = question.text;
      questionWrapper.appendChild(questionText);
      
      if (question.type == 'short_text') {
        const input = document.createElement('input');
        input.classList.add('general-input-with-border');
        input.classList.add('answer-input'); // For DOM selection, not styling
        input.placeholder = yourAnswer;
        input.value = answer;
        questionWrapper.appendChild(input);
      } else if (question.type == 'long_text') {
        const inputLong = document.createElement('textarea');
        inputLong.classList.add('general-input-with-border-long');
        inputLong.classList.add('answer-input'); // For DOM selection, not styling
        inputLong.placeholder = yourAnswer;
        inputLong.value = answer;
        questionWrapper.appendChild(inputLong);
      } else if (question.type == 'range') {
        const opinionOuterWrapper = document.createElement('div');
        opinionOuterWrapper.classList.add('each-question-opinion-outer-wrapper');
    
        const opinionScaleWrapper = document.createElement('div');
        opinionScaleWrapper.classList.add('each-question-opinion-scale-wrapper');
        for (let i = question.min_value; i <= question.max_value; i++) {
          if (i != question.min_value) {
            const eachEmptyScale = document.createElement('div');
            eachEmptyScale.classList.add('each-question-empty-scale');
            opinionScaleWrapper.appendChild(eachEmptyScale);
          }
          const eachScale = document.createElement('span');
          eachScale.classList.add('each-question-each-scale');
          if (answer == i)
            eachScale.classList.add('each-question-selected-scale');
          eachScale.innerHTML = i;
          opinionScaleWrapper.appendChild(eachScale);
        }
        opinionOuterWrapper.appendChild(opinionScaleWrapper);
    
        const opinionLine = document.createElement('div');
        opinionLine.classList.add('each-question-opinion-line');
        for (let i = 0; i < 3; i++) {
          const eachOpinionLine = document.createElement('div');
          eachOpinionLine.classList.add('each-question-opinion-line-item');
          opinionLine.appendChild(eachOpinionLine);
        }
        opinionOuterWrapper.appendChild(opinionLine);
    
        const opinionTextWrapper = document.createElement('div');
        opinionTextWrapper.classList.add('each-question-opinion-text-wrapper');
        const leftOpinionText = document.createElement('span');
        leftOpinionText.classList.add('each-question-opinion-text-left');
        leftOpinionText.innerHTML = question.min_explanation;
        opinionTextWrapper.appendChild(leftOpinionText);
        const middleOpinionText = document.createElement('span');
        middleOpinionText.classList.add('each-question-opinion-text-middle');
        middleOpinionText.innerHTML = '';
        opinionTextWrapper.appendChild(middleOpinionText);
        const rightOpinionText = document.createElement('span');
        rightOpinionText.classList.add('each-question-opinion-text-right');
        rightOpinionText.innerHTML = question.max_explanation;
        opinionTextWrapper.appendChild(rightOpinionText);
        opinionOuterWrapper.appendChild(opinionTextWrapper);
    
        questionWrapper.appendChild(opinionOuterWrapper);
      } else if (question.type == 'radio' || question.type == 'checked') {
        question.choices.forEach(choice => {
          const eachQuestionChoice = document.createElement('div');
          eachQuestionChoice.classList.add('each-question-choice');
          if (question.type == 'radio') {
            eachQuestionChoice.classList.add('each-question-choice-radio');
            const radioChoiceWrapper = document.createElement('div');
            radioChoiceWrapper.classList.add('radio-choice-wrapper');
            if (choice == answer)
              radioChoiceWrapper.classList.add('selected-choice');
            const radioChoiceIcon = document.createElement('div');
            radioChoiceIcon.classList.add('radio-choice-icon');
            radioChoiceWrapper.appendChild(radioChoiceIcon);
            eachQuestionChoice.appendChild(radioChoiceWrapper);
          } else {
            eachQuestionChoice.classList.add('each-question-choice-checked');
            const checkedChoiceWrapper = document.createElement('div');
            checkedChoiceWrapper.classList.add('checked-choice-wrapper');
            if (answer.includes(choice))
              checkedChoiceWrapper.classList.add('selected-choice');
            const checkedChoiceIcon = document.createElement('div');
            checkedChoiceIcon.classList.add('checked-choice-icon');
            checkedChoiceIcon.classList.add('fas');
            checkedChoiceIcon.classList.add('fa-check');
            checkedChoiceWrapper.appendChild(checkedChoiceIcon);
            eachQuestionChoice.appendChild(checkedChoiceWrapper);
          }
          const span = document.createElement('span');
          span.innerHTML = choice;
          eachQuestionChoice.appendChild(span);
          questionWrapper.appendChild(eachQuestionChoice);
        });
        if (question.other_option) {
          if (question.type == 'radio') {
            if (question.choices.includes(answer))
              createOtherOptionInput(questionWrapper, question.type, '');
            else
              createOtherOptionInput(questionWrapper, question.type, answer);
          } else {
            if (answer.find(ans => !question.choices.includes(ans)))
              createOtherOptionInput(questionWrapper, question.type, answer.find(ans => !question.choices.includes(ans)));
            else
              createOtherOptionInput(questionWrapper, question.type, '');
          }
        }
      }
    
      const clearQuestionButton = document.createElement('span');
      clearQuestionButton.classList.add('clear-question-button');
      clearQuestionButton.innerHTML = clearAnswers;
      questionWrapper.appendChild(clearQuestionButton);
    
      if (!answer || !answer.length)
        document.querySelector('.next-button').style.cursor = 'not-allowed';
      else
        document.querySelector('.next-button').style.cursor = 'pointer';
    }
  }
}

function updateFilterAnswer(callback) {
  serverRequest('/auth/session', 'GET', {}, res => {
    if (!res.success || !res.user) return callback(res.error || true);

    const filter = filters[filterIndex];
    const user = res.user;
    
    if (!user.information)
      user.information = {};

    if (filter.type == 'special') {
      let filterName = filter._id;
      if (filter._id == 'age')
        filterName = 'birth_year';

      if (user[filterName])
        filterAnswer = user[filterName];
      else
        filterAnswer = '';
      
      return callback(false);
    } else {
      if (user.information[filter._id.toString()])
        filterAnswer = user.information[filter._id.toString()];
      else
        filterAnswer = filter.type == 'checked' ? [] : '';
      return callback(false);
    }
  });
}

function validateFiltersAndCreateSubmition() {
  document.querySelector('.back-button').style.cursor = 'not-allowed';
  const questionOuterWrapper = document.querySelector('.question-outer-wrapper');
  questionOuterWrapper.style.display = 'none';

  serverRequest(`/test/custom/filter/validate?target_id=${targetId}`, 'GET', {}, res => {
    if (!res.success) return throwUnknownError();

    if (!res.res)
      return finishSubmition();

    serverRequest(`/test/custom/submition?target_id=${targetId}`, 'GET', {}, res => {
      if (!res.success) return throwUnknownError();
      
      if (res.submition.status != 'saved')
        return finishSubmition();

      serverRequest(`/test/custom/data?id=${res.submition._id.toString()}`, 'GET', {}, res => {
        if (!res.success) return throwUnknownError();

        questions = res.data.questions;
        campaign = res.data.campaign;
        submition = res.data.submition;
        submition.last_question = Math.max(0, submition.last_question);

        for (let i = 0; i < questions.length; i++)
          answers[questions[i].question._id] = Array.isArray(questions[i].answer) ? questions[i].answer.map(answer => answer) : questions[i].answer; // Duplicate the array to avoid pointer errors
    
        questionOuterWrapper.style.display = 'flex';
        createAllWrapperContent();
      });
    });
  });
}

function createFinishPageQuestionsWrapperContent() {
  const questionsWrapper = document.querySelector('.finish-page-questions-wrapper');
  questionsWrapper.innerHTML = '';

  questions.forEach((question, i) => {
    const eachQuestion = document.createElement('div');
    eachQuestion.classList.add('finish-page-each-question-wrapper');
    if (i == 0)
      eachQuestion.style.paddingTop = '0px';

    const eachQuestionText = document.createElement('span');
    eachQuestionText.classList.add('finish-page-each-question-text');
    eachQuestionText.innerHTML = (i+1) + '. ' + question.question.text;
    eachQuestion.appendChild(eachQuestionText);

    if (question.question.type != 'checked') {
      const eachAnswer = document.createElement('span');
      eachAnswer.classList.add('finish-page-each-question-answer');
      eachAnswer.innerHTML = question.answer;
      eachQuestion.appendChild(eachAnswer);
    } else {
      question.answer.forEach(answer => {
        const eachAnswer = document.createElement('span');
        eachAnswer.classList.add('finish-page-each-question-answer');
        eachAnswer.innerHTML = '- ' + answer;
        eachQuestion.appendChild(eachAnswer);
      });
    }

    questionsWrapper.appendChild(eachQuestion);
  });
}

function createAllWrapperContent() {
  if (filterIndex >= filters.length) {
    filterIndex = filters.length;
    filtersEnded = true;
  }

  if (filtersEnded) {
    let last_question = submition.last_question;

    if (last_question > 0)
      document.querySelector('.back-button').style.cursor = 'pointer';

    const questionOuterWrapper = document.querySelector('.question-outer-wrapper');
    const finishPageOuterWrapper = document.querySelector('.finish-page-outer-wrapper');

    questionOuterWrapper.style.display = finishPageOuterWrapper.style.display = 'none';

    if (last_question < 0)
      last_question = 0;
    
    if (last_question == questions.length) {
      finishPageOuterWrapper.style.display = 'flex';
      createFinishPageQuestionsWrapperContent();
    } else {
      questionOuterWrapper.style.display = 'flex';
      createQuestion(questions[last_question].question, questions[last_question].answer, last_question);
    }
  } else {
    updateFilterAnswer(err => {
      if (err) return throwUnknownError();

      createQuestion(filters[filterIndex], filterAnswer, filterIndex);
    });
  }
}

function finishSubmition() {
  return window.location = '/completed';
}

function updateFiltersByUserId() {
  if (!userId)
    return throwUnknownError();

  serverRequest(`/test/custom/filter?target_id=${targetId}`, 'GET', {}, res => {
    if (!res.success)
      return throwUnknownError();

    filters = res.filters;
    document.querySelector('.start-page-wrapper').style.display = 'none';
    document.querySelector('.question-outer-wrapper').style.display = 'flex';

    if (filters.length)
      return createAllWrapperContent();

    filtersEnded = true;
    validateFiltersAndCreateSubmition();
  });
}

function saveAnswers(callback) {
  if (saveError)
    return;

  if (filtersEnded) {
    if (submition.last_question < 0)
      submition.last_question = 0;

    serverRequest('/test/custom/save?id=' + submition._id, 'POST', {
      last_question: submition.last_question,
      answers // Save the current answers
    }, res => {
      if (!res.success) {
        saveError = true;
        createConfirm({
          title: unknownErrorTitle,
          text: tryAgainLaterText,
          reject: confirmText
        }, res => {
          return callback(false);
        });
      } else {
        if (submition.last_question > -1 && submition.last_question < questions.length) {
          questions[submition.last_question].question.required
          if ((answers[questions[submition.last_question].question._id] && answers[questions[submition.last_question].question._id].length) || questions[submition.last_question].question.required)
            document.querySelector('.next-button').style.cursor = 'pointer';
          else
            document.querySelector('.next-button').style.cursor = 'not-allowed';
        }
        callback(true);
      }
    });
  } else {
    serverRequest('/test/custom/filter/save', 'POST', {
      id: filters[filterIndex]._id.toString(),
      answer: filterAnswer
    }, res => {
      if (!res.success) {
        saveError = true;
        createConfirm({
          title: unknownErrorTitle,
          text: tryAgainLaterText,
          reject: confirmText
        }, res => { return callback(false); });
      } else {
        if (filterAnswer && filterAnswer.length)
          document.querySelector('.next-button').style.cursor = 'pointer';
        else
          document.querySelector('.next-button').style.cursor = 'not-allowed';
        callback(true);
      }
    });
  }
}

function submitAnswers(callback) {
  serverRequest('/test/custom/submit?id=' + submition._id, 'GET', {}, res => {
    if (!res.success) {
      createConfirm({
        title: unknownErrorTitle,
        text: tryAgainLaterText,
        reject: confirmText
      }, res => { return callback(false); });
    } else {
      callback(true);
    }
  });
}

window.onload = () => {
  listenDropDownListInputs(document); // Listen for drop down items

  targetId = document.getElementById('target-id').value;
  project = JSON.parse(document.getElementById('project').value);
  questions = project.questions;

  unknownErrorTitle = document.querySelector('.unknown-error-title').innerHTML;
  tryAgainLaterText = document.querySelector('.try-again-later-text').innerHTML;
  okayText = document.querySelector('.okay-text').innerHTML;
  confirmText = document.querySelector('.confirm-text').innerHTML;
  cancelText = document.querySelector('.cancel-text').innerHTML;
  required = document.querySelector('.required').innerHTML;
  clearAnswers = document.querySelector('.clear-answers').innerHTML;
  areYouSureTitle = document.querySelector('.are-you-sure-title').innerHTML;
  noUpdateAfterSubmitText = document.querySelector('.no-update-after-submit-text').innerHTML;

  question_types.short_text = document.querySelector('.short-text-type').innerHTML;
  question_types.long_text = document.querySelector('.long-text-type').innerHTML;
  question_types.range = document.querySelector('.range-type').innerHTML;
  question_types.radio = document.querySelector('.radio-type').innerHTML;
  question_types.checked = document.querySelector('.checked-type').innerHTML;
  question_types.yes_no = document.querySelector('.yes-no-type').innerHTML;
  question_types.open_answer = document.querySelector('.open-answer-type').innerHTML;
  question_types.opinion_scale = document.querySelector('.opinion-scale-type').innerHTML;
  question_types.multiple_choice = document.querySelector('.multiple-choice-type').innerHTML;

  yourAnswer = document.querySelector('.your-answer').innerHTML;
  other = document.querySelector('.other').innerHTML;

  const emailPageOneWrapper = document.querySelector('.email-page-one-wrapper');
  const emailPageTwoWrapper = document.querySelector('.email-page-two-wrapper');
  const agreementWrapper = document.querySelector('.agreement-wrapper');
  const agreementCheckboxWrapper = document.querySelector('.agreement-checkbox-wrapper');
  const validatePasswordWrapper = document.querySelector('.validate-password-wrapper');
  const pageOneEmailError = document.querySelector('.page-one-email-error');
  const pageTwoEmailError = document.querySelector('.page-two-email-error');
  const passwordError = document.querySelector('.password-error');

  const writeEmailError = document.getElementById('write-email-error').innerHTML;
  const confirmEmailError = document.getElementById('confirm-email-error').innerHTML;
  const wrongConfirmEmailError = document.getElementById('wrong-confirm-email-error').innerHTML;
  const writePasswordError = document.getElementById('write-password-error').innerHTML;
  const wrongPasswordError = document.getElementById('wrong-password-error').innerHTML;
  const agreementError = document.getElementById('agreement-error').innerHTML;

  emailPageOneWrapper.onsubmit = event => {
    event.preventDefault();

    const email = document.getElementById('email-input').value;

    if (!email || !email.length)
      return pageOneEmailError.innerHTML = writeEmailError;

    userEmail = email;
    emailPageOneWrapper.style.display = 'none';
    emailPageTwoWrapper.style.display = 'flex';
    pageTwoEmailError.innerHTML = '';
    document.getElementById('confirm-email-input').focus();
  }

  emailPageTwoWrapper.onsubmit = event => {
    event.preventDefault();

    const confirmEmail = document.getElementById('confirm-email-input').value;

    if (!confirmEmail || !confirmEmail.length)
      return pageTwoEmailError.innerHTML = confirmEmailError;

    if (userEmail != confirmEmail) {
      pageOneEmailError.innerHTML = '';
      emailPageOneWrapper.style.display = 'flex';
      emailPageTwoWrapper.style.display = 'none';
      document.getElementById('email-input').focus();
      pageOneEmailError.innerHTML = wrongConfirmEmailError;
      return;
    }

    if (!agreementWrapper.childNodes[0].checked)
      return pageTwoEmailError.innerHTML = agreementError;

    validateUserAndUpdateFilters();
  }

  validatePasswordWrapper.onsubmit = event => {
    event.preventDefault();
    passwordError.innerHTML = '';

    const password = document.getElementById('password-input').value;

    if (!password || !password.length)
      return passwordError.innerHTML = writePasswordError;

    serverRequest('/auth/login', 'POST', {
      email: userEmail,
      password
    }, res => {
      if (!res.success)
        return passwordError.innerHTML = wrongPasswordError;

      userId = res.id;
      updateFiltersByUserId();
    });
  }

  document.addEventListener('click', event => {
    if (filtersEnded) {
      // Next button is clicked
      if (event.target.classList.contains('next-button') || event.target.parentNode.classList.contains('next-button')) {
        document.querySelector('.back-button').style.cursor = 'pointer';
        if ((!questions[submition.last_question].answer || !questions[submition.last_question].answer.length) && questions[submition.last_question].question.required)
          return;
        
        submition.last_question++;
        saveAnswers(res => {
          if (res) createAllWrapperContent();
        });
      }

      // Back button is clicked
      if (event.target.classList.contains('back-button') || event.target.parentNode.classList.contains('back-button')) {
        submition.last_question--;
        if (submition.last_question == 0)
          document.querySelector('.back-button').style.cursor = 'not-allowed';
        saveAnswers(res => {
          if (res) createAllWrapperContent();
        });
      }

      // Back button in finish page is clicked, create the last question content
      if (event.target.classList.contains('finish-page-back-button') || event.target.parentNode.classList.contains('finish-page-back-button')) {
        submition.last_question--;
        createAllWrapperContent();
      }

      // Submit test button is clicked
      if (event.target.classList.contains('finish-page-submit-button') || event.target.parentNode.classList.contains('finish-page-submit-button')) {
        createConfirm({
          title: areYouSureTitle,
          text: noUpdateAfterSubmitText,
          reject: cancelText,
          accept: confirmText
        }, res => {
          if (!res) return;

          submitAnswers(res => {
            if (res) return finishSubmition();
          });
        });
      }

      // Yes No question no-button clicked
      if (event.target.classList.contains('each-question-no-button') || event.target.parentNode.classList.contains('each-question-no-button')) {
        let target = event.target;
        if (event.target.parentNode.classList.contains('each-question-no-button'))
          target = event.target.parentNode;

        questions[submition.last_question].answer = 'no';
        answers[questions[submition.last_question].question._id] = 'no';
        if (document.querySelector('.selected-yes-button'))
          document.querySelector('.selected-yes-button').classList.remove('selected-yes-button');
        target.classList.add('selected-no-button');
        saveAnswers(res => { return });
      }

      // Yes No question yes-button clicked
      if (event.target.classList.contains('each-question-yes-button') || event.target.parentNode.classList.contains('each-question-yes-button')) {
        let target = event.target;
        if (event.target.parentNode.classList.contains('each-question-yes-button'))
          target = event.target.parentNode;

        questions[submition.last_question].answer = 'yes';
        answers[questions[submition.last_question].question._id] = 'yes';
        if (document.querySelector('.selected-no-button'))
          document.querySelector('.selected-no-button').classList.remove('selected-no-button');
        target.classList.add('selected-yes-button');
        saveAnswers(res => { return });
      }

      // Range question clicked
      if (event.target.classList.contains('each-question-each-scale')) {
        questions[submition.last_question].answer = event.target.innerHTML;
        answers[questions[submition.last_question].question._id] = event.target.innerHTML;
        if (document.querySelector('.each-question-selected-scale'))
          document.querySelector('.each-question-selected-scale').classList.remove('each-question-selected-scale');
        event.target.classList.add('each-question-selected-scale');
        saveAnswers(res => { return });
      }

      // Radio choice clicked
      if (event.target.classList.contains('each-question-choice-radio')) {
        const target = event.target;
        questions[submition.last_question].answer = target.childNodes[1].innerHTML;
        answers[questions[submition.last_question].question._id] = target.childNodes[1].innerHTML;
        if (document.querySelector('.selected-choice'))
          document.querySelector('.selected-choice').classList.remove('selected-choice');
        target.childNodes[0].classList.add('selected-choice');
        saveAnswers(res => { return });
      } else if (event.target.parentNode.classList.contains('each-question-choice-radio')) {
        const target = event.target.parentNode;
        questions[submition.last_question].answer = target.childNodes[1].innerHTML;
        answers[questions[submition.last_question].question._id] = target.childNodes[1].innerHTML;
        if (document.querySelector('.selected-choice'))
          document.querySelector('.selected-choice').classList.remove('selected-choice');
        target.childNodes[0].classList.add('selected-choice');
        saveAnswers(res => { return });
      } else if (event.target.parentNode.parentNode.classList.contains('each-question-choice-radio')) {
        const target = event.target.parentNode;
        questions[submition.last_question].answer = target.childNodes[1].innerHTML;
        answers[questions[submition.last_question].question._id] = target.childNodes[1].innerHTML;
        if (document.querySelector('.selected-choice'))
          document.querySelector('.selected-choice').classList.remove('selected-choice');
        target.childNodes[0].classList.add('selected-choice');
        saveAnswers(res => { return });
      }

      // Checked choice clicked
      if (event.target.classList.contains('each-question-choice-checked')) {
        const target = event.target;
        if (target.childNodes[0].classList.contains('selected-choice')) {
          questions[submition.last_question].answer = questions[submition.last_question].answer.filter(choice => choice != target.childNodes[1].innerHTML);
          answers[questions[submition.last_question].question._id] = answers[questions[submition.last_question].question._id].filter(choice => choice != target.childNodes[1].innerHTML);
          target.childNodes[0].classList.remove('selected-choice');
          saveAnswers(res => { return });
        } else {
          questions[submition.last_question].answer.push(target.childNodes[1].innerHTML);
          answers[questions[submition.last_question].question._id].push(target.childNodes[1].innerHTML);
          target.childNodes[0].classList.add('selected-choice');
          saveAnswers(res => { return });
        }
      } else if (event.target.parentNode.classList.contains('each-question-choice-checked')) {
        target = event.target.parentNode;
        if (target.childNodes[0].classList.contains('selected-choice')) {
          questions[submition.last_question].answer = questions[submition.last_question].answer.filter(choice => choice != target.childNodes[1].innerHTML);
          answers[questions[submition.last_question].question._id] = answers[questions[submition.last_question].question._id].filter(choice => choice != target.childNodes[1].innerHTML);
          target.childNodes[0].classList.remove('selected-choice');
          saveAnswers(res => { return });
        } else {
          questions[submition.last_question].answer.push(target.childNodes[1].innerHTML);
          answers[questions[submition.last_question].question._id].push(target.childNodes[1].innerHTML);
          target.childNodes[0].classList.add('selected-choice');
          saveAnswers(res => { return });
        }
      } else if (event.target.parentNode.parentNode.classList.contains('each-question-choice-checked')) {
        target = event.target.parentNode.parentNode;
        if (target.childNodes[0].classList.contains('selected-choice')) {
          questions[submition.last_question].answer = questions[submition.last_question].answer.filter(choice => choice != target.childNodes[1].innerHTML);
          answers[questions[submition.last_question].question._id] = answers[questions[submition.last_question].question._id].filter(choice => choice != target.childNodes[1].innerHTML);
          target.childNodes[0].classList.remove('selected-choice');
          saveAnswers(res => { return });
        } else {
          questions[submition.last_question].answer.push(target.childNodes[1].innerHTML);
          answers[questions[submition.last_question].question._id].push(target.childNodes[1].innerHTML);
          target.childNodes[0].classList.add('selected-choice');
          saveAnswers(res => { return });
        }
      }

      // Clear answers
      if (event.target.classList.contains('clear-question-button')) {
        if (Array.isArray(questions[submition.last_question].answer)) {
          questions[submition.last_question].answer = [];
          answers[questions[submition.last_question].question._id] = [];
        } else {
          questions[submition.last_question].answer = '';
          answers[questions[submition.last_question].question._id] = '';
        }

        if (document.querySelector('.answer-input'))
          document.querySelector('.answer-input').value = '';
        if (document.querySelector('.each-question-selected-scale'))
          document.querySelector('.each-question-selected-scale').classList.remove('each-question-selected-scale');
        const allClickedChoices = document.querySelectorAll('.selected-choice');
        allClickedChoices.forEach(choice => {
          choice.classList.remove('selected-choice');
        });

        if (document.querySelector('.selected-no-button'))
          document.querySelector('.selected-no-button').classList.remove('selected-no-button');

        if (document.querySelector('.selected-yes-button'))
          document.querySelector('.selected-yes-button').classList.remove('selected-yes-button');

        if (questions[submition.last_question].question.required)
          document.querySelector('.next-button').style.cursor = 'not-allowed';
        else
          document.querySelector('.next-button').style.cursor = 'pointer';
      }
    } else {
      // Agreement checkbox is clicked
      if (event.target.classList.contains('agreement-wrapper') || event.target.parentNode.classList.contains('agreement-wrapper') || event.target.parentNode.parentNode.classList.contains('agreement-wrapper')) {
        if (agreementWrapper.childNodes[0].checked) {
          agreementWrapper.childNodes[0].checked = false;
          agreementCheckboxWrapper.style.backgroundColor = 'rgb(254, 254, 254)';
          agreementCheckboxWrapper.style.borderColor = 'rgba(151, 151, 151, 0.3)';
        } else {
          agreementWrapper.childNodes[0].checked = true;
          agreementCheckboxWrapper.style.backgroundColor = 'rgb(46, 197, 206)';
          agreementCheckboxWrapper.style.borderColor = 'transparent';
        }
      }

      // Next button is clicked
      if (event.target.classList.contains('next-button') || event.target.parentNode.classList.contains('next-button')) {
        if (filterIndex > filters.length - 1)
          return;

        const filter = filters[filterIndex];

        if (filter._id == 'age')
          filterAnswer = document.getElementById('birth-year-input').value;
        else if (filter._id == 'gender')
          filterAnswer = document.getElementById('gender-input').value;
        else if (filter._id == 'country')
          filterAnswer = document.getElementById('country-input').value;

        saveAnswers(res => {
          if (res) {
            if (filterIndex == filters.length-1) {
              filtersEnded = true;
              return validateFiltersAndCreateSubmition();
            }
            filterIndex++;
            createAllWrapperContent();
          }
        });
      }

      // Back button is clicked
      if (event.target.classList.contains('back-button') || event.target.parentNode.classList.contains('back-button')) {
        isaveAnswers(res => {
          if (res) {
            filterIndex--;
            createAllWrapperContent();
          }
        });
      }
      
      // Range question clicked
      if (event.target.classList.contains('each-question-each-scale')) {
        filterAnswer = event.target.innerHTML;
        if (document.querySelector('.each-question-selected-scale'))
          document.querySelector('.each-question-selected-scale').classList.remove('each-question-selected-scale');
        event.target.classList.add('each-question-selected-scale');
        saveAnswers(res => { return });
      }

      // Radio choice clicked
      if (event.target.classList.contains('each-question-choice-radio')) {
        const target = event.target;
        filterAnswer = target.childNodes[1].innerHTML;
        if (document.querySelector('.selected-choice'))
          document.querySelector('.selected-choice').classList.remove('selected-choice');
        target.childNodes[0].classList.add('selected-choice');
        saveAnswers(res => { return });
      } else if (event.target.parentNode && event.target.parentNode.classList.contains('each-question-choice-radio')) {
        const target = event.target.parentNode;
        filterAnswer = target.childNodes[1].innerHTML;
        if (document.querySelector('.selected-choice'))
          document.querySelector('.selected-choice').classList.remove('selected-choice');
        target.childNodes[0].classList.add('selected-choice');
        saveAnswers(res => { return });
      } else if (event.target.parentNode && event.target.parentNode.parentNode && event.target.parentNode.parentNode.classList.contains('each-question-choice-radio')) {
        const target = event.target.parentNode;
        filterAnswer = target.childNodes[1].innerHTML;
        if (document.querySelector('.selected-choice'))
          document.querySelector('.selected-choice').classList.remove('selected-choice');
        target.childNodes[0].classList.add('selected-choice');
        saveAnswers(res => { return });
      }

      // Checked choice clicked
      if (event.target.classList.contains('each-question-choice-checked')) {
        const target = event.target;
        if (!filterAnswer)
          filterAnswer = [];

        if (target.childNodes[0].classList.contains('selected-choice')) {
          filterAnswer = filterAnswer.filter(choice => choice != target.childNodes[1].innerHTML);
          target.childNodes[0].classList.remove('selected-choice');
          saveAnswers(res => { return });
        } else {
          filterAnswer.push(target.childNodes[1].innerHTML);
          target.childNodes[0].classList.add('selected-choice');
          saveAnswers(res => { return });
        }
      } else if (event.target.parentNode.classList.contains('each-question-choice-checked')) {
        target = event.target.parentNode;
        if (!filterAnswer)
          filterAnswer = [];

        if (target.childNodes[0].classList.contains('selected-choice')) {
          filterAnswer = questions[submition.last_question].answer.filter(choice => choice != target.childNodes[1].innerHTML);
          target.childNodes[0].classList.remove('selected-choice');
          saveAnswers(res => { return });
        } else {
          filterAnswer.push(target.childNodes[1].innerHTML);
          target.childNodes[0].classList.add('selected-choice');
          saveAnswers(res => { return });
        }
      } else if (event.target.parentNode.parentNode.classList.contains('each-question-choice-checked')) {
        target = event.target.parentNode.parentNode;
        if (!filterAnswer)
          filterAnswer = [];

        if (target.childNodes[0].classList.contains('selected-choice')) {
          filterAnswer = filterAnswer.filter(choice => choice != target.childNodes[1].innerHTML);
          target.childNodes[0].classList.remove('selected-choice');
          saveAnswers(res => { return });
        } else {
          filterAnswer.push(target.childNodes[1].innerHTML);
          target.childNodes[0].classList.add('selected-choice');
          saveAnswers(res => { return });
        }
      }

      // Clear answers
      if (event.target.classList.contains('clear-question-button')) {
        if (Array.isArray(filterAnswer))
          filterAnswer = [];
        else
          filterAnswer = '';

        if (document.querySelector('.answer-input'))
          document.querySelector('.answer-input').value = '';
        if (document.querySelector('.each-question-selected-scale'))
          document.querySelector('.each-question-selected-scale').classList.remove('each-question-selected-scale');
        const allClickedChoices = document.querySelectorAll('.selected-choice');
        allClickedChoices.forEach(choice => {
          choice.classList.remove('selected-choice');
        });
        if (document.querySelector('.each-question-other-option-input-wrapper'))
          document.querySelector('.each-question-other-option-input-wrapper').childNodes[1].value = '';

        document.querySelector('.next-button').style.cursor = 'not-allowed';
      }
    }
  });

  document.addEventListener('input', event => {
    if (filtersEnded) {
      // Listen for short_text or long_text answers
      if (event.target.classList.contains('answer-input')) {
        questions[submition.last_question].answer = event.target.value;
        answers[questions[submition.last_question].question._id] = event.target.value;
        saveAnswers(res => { return });
      }
    } else {
      // Update next button status
      if (event.target.value.length)
        document.querySelector('.next-button').style.cursor = 'pointer';
      else
        document.querySelector('.next-button').style.cursor = 'not-allowed';

      // Listen for other_option on radio and checked choices
      if (event.target.parentNode.classList.contains('each-question-other-option-input-wrapper')) {
        const question = filters[filterIndex];

        if (question.type == 'radio') {
          if (document.querySelector('.selected-choice'))
            document.querySelector('.selected-choice').classList.remove('selected-choice');
          filterAnswer = '';
          
          if (event.target.value.length) {
            event.target.parentNode.childNodes[0].classList.add('selected-choice');
            filterAnswer = event.target.value;
          }
        } else if (question.type == 'checked') {
          if (event.target.value.length) {
            event.target.parentNode.childNodes[0].classList.add('selected-choice');

            // Delete old custom choices
            filterAnswer = filterAnswer.filter(choice => question.choices.includes(choice));
            
            // Push new choices
            filterAnswer.push(event.target.value);
          } else {
            event.target.parentNode.childNodes[0].classList.remove('selected-choice');
            filterAnswer = filterAnswer.filter(choice => question.choices.includes(choice));
          }
        } else {
          return;
        }

        saveAnswers(res => { return });
      }
    }
  });
}
