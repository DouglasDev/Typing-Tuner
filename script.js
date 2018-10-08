document.addEventListener("keydown", e => {
  e.preventDefault();
  if (
    e.key != "Backspace" &&
    e.key != "Shift" &&
    controller.testingNow == true
  ) {
    controller.checkChar(e.key);
  }
});

let model = {      
  quote:
    "Try to type these timeless words as quickly as possible: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mollis egestas justo sit amet placerat. Duis non nulla non elit tincidunt posuere et eu orci. Maecenas sed eros nec mauris suscipit venenatis. Morbi fringilla a orci sed ullamcorper. In hac habitasse platea dictumst.",
  currentPosition: 0,
  mistakes: {},
  worst: [],

  addMistake: function(){
      let wrong = view.doc[this.currentPosition].toLowerCase();
      if (!this.mistakes[wrong]) {
        this.mistakes[wrong] = 0;
      }
      this.mistakes[wrong] += 1;
  },
  
  topMistakes: function() {
    let arr = Object.entries(model.mistakes);
    arr.sort((a, b) => (a[1] < b[1] ? 1 : -1));

    this.worst = [];
 
    let len=0;
    arr.length>10 ? len=10 : len=arr.length;

    for (let a = 0; a < len; a++) {
      this.worst.push(arr[a][0]);
    }
    return this.worst;
  },

  randomText: function(worst) {
    let str = "";
    for (let a = 0; a < 300; a++) {
str += worst[Math.floor(Math.random() * worst.length)];
    }
    return str;
  }
};

let controller = {
  testingNow: false,
  finishedTest: false,
  
  startTest: function() {
    document.getElementById("start").blur();

    model.currentPosition = 0;
    this.testingNow = true;
    view.displayTest(model.quote);
  },
  
  practiceWorst: function() {  
    if (this.finishedTest==false){view.displayPlainText("First take the test.");}
    else{
    text=model.randomText(model.topMistakes())
    model.currentPosition = 0;
    this.testingNow = true;
    view.displayTest(text);
    }
  },  
  
  stats: function(){
    this.testingNow=false;
   view.displayPlainText("Your worst keys: " + model.topMistakes());
  },

  checkChar: function(key) {

   if ( model.currentPosition>=view.currentTextArray.length-1){
     this.finishedTest=true;
     controller.stats();}
    else{
          console.log(view.doc[model.currentPosition]);
      console.log(key);
    if (view.doc[model.currentPosition] == key) {
      view.styleTypedChar(model.currentPosition, "right", true);
      view.styleTypedChar(model.currentPosition, "current", false);
      
      model.currentPosition += 1;
      view.styleTypedChar(model.currentPosition, "current", true);
    } 
    else {
      view.styleTypedChar(model.currentPosition, "wrong", true);
      model.addMistake()
    }
  }
  },

  finishTest: function(key) {
    if (this.testingNow == true){
      this.finishedTest=true;
      controller.stats();
    }
  }

};

let view = {
  doc:[],
  currentTextArray: [],
  text: document.getElementById("text"),

  clearChildren: function(myNode) {
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
  },

  displayTest: function(testText) { 
      
    this.clearChildren(this.text);   
    this.doc = testText.split("");
    this.currentTextArray=[];
    
    for (e = 0; e < this.doc.length; e++) {
      this.currentTextArray[e] = document.createElement("span");
      this.currentTextArray[e].textContent = this.doc[e];
      this.text.appendChild(this.currentTextArray[e]);
    }

        this.styleTypedChar(model.currentPosition, "current", true);
  },

  displayPlainText: function(text) {
    this.clearChildren(this.text);
    let plainText = document.createElement("span");
    plainText.textContent = text;
    this.text.appendChild(plainText);
  },

  styleTypedChar: function(position, style, add) {
    if (add == true) {
      this.currentTextArray[position].classList.add(style);
    } else {
      this.currentTextArray[position].classList.remove(style);
    }
  }
};