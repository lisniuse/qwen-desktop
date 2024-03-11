var regex = /head--[\s\S]+ newHead--[\s\S]+/;
var divs = document.getElementsByTagName('div');

for (var i = 0; i < divs.length; i++) {
  var classes = divs[i].className;
  if (regex.test(classes)) {
    divs[i].remove();
  }
}
