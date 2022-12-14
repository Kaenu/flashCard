const R = require('ramda');

const MSGS = {
  SHOW_FORM: 'SHOW_FORM',
  DESCRIPTION_INPUT: 'DESCRIPTION_INPUT',
  ANSWER_INPUT: 'ANSWER_INPUT',
  SAVE_CARD: 'SAVE_CARD',
  DELETE_CARD: 'DELETE_CARD',
  ANSWER_SHOW: 'ANSWER_SHOW'
};

const showFormMsg = showForm => ({  
  type: MSGS.SHOW_FORM,
  showForm
});

const frontInputMsg = description => ({  
  type: MSGS.DESCRIPTION_INPUT,
  description
});

const backInputMsg = back => ({  
  type: MSGS.ANSWER_INPUT,
  back
});

const saveCardMsg = { type: MSGS.SAVE_CARD };

const deleteCardMsg = id => ({
  type: MSGS.DELETE_CARD,
  id
});

const showAnswer = (id, showAnswer = "", changeTextStatus = 1, changeddescription = "", changedAnswer = "") => {
  if (changedAnswer=== "") {
    return {
      type: MSGS.ANSWER_SHOW,
      id,
      showAnswer,
      changeTextStatus,
      changedValue: changeddescription,
      changeType: 1
    };
  } 
  return {
    type: MSGS.ANSWER_SHOW,
    id,
    showAnswer,
    changeTextStatus,
    changedValue: changedAnswer,
    changeType: 2
  };
};

const update = (msg, model) => {
  switch (msg.type) {
    case MSGS.ANSWER_SHOW: {
      const {id, showAnswer, changeTextStatus, changedValue, changeType} = msg;

      const estimateData = showAnswer.split(' ');
      const estimateText = estimateData[0];
      const estimatescore = estimateData[1];
      
      const oneCard = R.filter(
        card => card.id == id, model.cards
      );
      const neuValue = changedValue || '';
      
      const card = {
        id: oneCard[oneCard.length - 1].id + 1, 
        description: changeType === 1 ? neuValue : oneCard[0].description, 
        back: changeType === 2 ? neuValue : oneCard[0].back, 
        toggle: changeTextStatus, 
        answerStatus: estimateText, 
        score: estimatescore
      };
      const cards = [...model.cards, card];
      return {
        ...model, 
        cards, 
        nextId: card.id, 
        description: '',
        back: 0,
        showForm: false,
        toggle: changeTextStatus,
        answerStatus: ""
      };
    }
    case MSGS.SHOW_FORM: {
      const { showForm } = msg;
      return { ...model, showForm, description: '', back: 0 };
    }
    case MSGS.DESCRIPTION_INPUT: {
      const { description } = msg;
      return { ...model, description };
    }
    case MSGS.ANSWER_INPUT: {
      const back = R.pipe( 
        R.defaultTo(0),
      )(msg.back);
      return { ...model, back };
    }
    case MSGS.SAVE_CARD: {
      const updatedModel = add(model);
      return updatedModel;
    }
    case MSGS.DELETE_CARD: {
      const { id } = msg;
      const cards = R.filter(
        card => card.id !== id, model.cards
      );
      return { ...model, cards };
    }
  }
  return model;
};

const add = model => {
  const { nextId, description, back, toggle } = model;
  const card = { id: nextId + 1, description, back, toggle:0};
  const cards = [...model.cards, card];
  return {
    ...model,
    cards,
    nextId: nextId + 1,
    description: '',
    back: 0,
    showForm: false,
    toggle: 0,
    score: 0
  };
};

module.exports = {update, MSGS, add, showFormMsg, frontInputMsg, backInputMsg, saveCardMsg, deleteCardMsg, showAnswer};