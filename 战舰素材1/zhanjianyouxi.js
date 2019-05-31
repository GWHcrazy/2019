var view = {
  displaymessageArea: function(msg){
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayHit: function(location){
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
  displayMiss: function(location){
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
}
var model = {
  boardSize: 7,
  numShips: 3,
  shipsSunk: 0,
  shipLength: 3,
  ships:  [ { locations: [0, 0, 0], hits: ["", "", ""] },
            { locations: [0, 0, 0], hits: ["", "", ""] },
            { locations: [0, 0, 0], hits: ["", "", ""] },],
  fire: function(guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = 'hit';
        var daji = document.getElementById(ship.locations[index])
        daji.style.backgroundImage = 'url(baozha.png)'
        for (var i = 0; i < ship.locations.length; i++) {
          view.displayHit(ship.locations[i])
        }
        view.displayHit(guess);
        view.displaymessageArea("击中!");
        if (this.isSunk(ship)) {
          view.displaymessageArea("你击沉了一艘战舰!");
          this.shipsSunk++;
          for (var k = 0; k < this.shipLength; k++) {
            var daji = document.getElementById(ship.locations[k])
            daji.style.backgroundImage = 'url(baozha.png)'
          }
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displaymessageArea("你没打中.");
    return false;
  },
  isSunk: function(ship) {
    var count = 0;
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] === "hit") {
        count++
      }
      if (count > this.shipLength * 0.666) {
        return true;
      }
    }
    return false;
  },
  generateShipLocations: function() {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },
  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations; 
  },
  collision: function(locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0;j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
}
var controller = {
  guesses: 0,
  processGuess: function(e) {
    var paramType = typeof e;
    var location
    if (paramType === 'object') {
      location = e.target.id
    } else {
      location = parseGuess(e)
    }
    if (location) {
      controller.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displaymessageArea('你击沉了所有战舰，经过 ' + controller.guesses + '次猜测');
      }
    }
  }
}
function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
  if (guess === null || guess.length !== 2) {
    alert("请输入正确位置！");
  } else {
    firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);
    if (isNaN(row) || isNaN(column)) {
      alert("输入位置不存在.");
    } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
      alert("找不到输入位置!");
    } else {
      return row + column; 
    }
  }
  return null;
}

function init() {
  var fireButton = document.getElementById("fireButton");
  console.log (model.ships);
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
  model.generateShipLocations()
  var mouseFire = document.getElementsByTagName('td')
  for (var i = 0; i < mouseFire.length; i ++) {
    mouseFire[i].onclick = controller.processGuess;
  }
}
function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = ""; 
}
function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}
window.onload = init;