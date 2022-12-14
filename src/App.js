const { diff, patch } = require("virtual-dom");
const createElement = require("virtual-dom/create-element");
const { deleteCardMsg } = require("./Update.js");
const R = require('ramda');


function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg){
    model = update(msg, model);
    const newModel = model.cards;
    const trueCardsSequence = R.sortBy(R.prop('score'), newModel);
    model.cards = trueCardsSequence;
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
    if (msg.type === "ANSWER_SHOW") {
      dispatch(deleteCardMsg(model.nextId-1));
    }
  }
}

module.exports = {app};