
var Core = Core;

var animations = (function(_) {
	
	return {
		
		dropDownAnimation: function(el) {
			if (el) {
				el.parentElement.style.backgroundColor = "white";
				var target = el;
				var targetStyle = Math.round(parseInt(_.getComputedStyle(target, "height")));
				if (targetStyle <= 0) {
					target.style.height = "auto";
				} else {
					target.style.height = "0px";
					el.parentElement.style.backgroundColor = "#c1deeb";
				}
			}
		},
		
		addTextToParent: function(el) {
			var target = el.parentElement.parentElement;
			if (target.lastChild.nodeName === "P") {
				target.removeChild(target.lastChild);
			}
			app.checkJobRoles(el);
			app.fillColors(el);
			var txt = document.createElement("P");
			txt.style.fontSize = "1em";
			txt.innerHTML = el.innerHTML;
			target.appendChild(txt);
		},

	};
	
}(Core));

var app = (function(_) {
	var designArray = [];
	return {
		
		init: function() {
			document.getElementById("name").focus();
			document.getElementById("job-role").style.display = "none";
			document.getElementById("colors-js-puns").style.opacity = 0;
			this.styleDropDowns();
			designArray = this.clearColors();
		},
		
		styleDropDowns: function() {
			var widths = [];
			var dropDownParent, dropDownDiv, optionsBlock, firstText, firstTextElement;
			var dropDowns = document.getElementsByTagName("select");
			for (var i = 0; i < dropDowns.length; i++) {
				dropDownParent = dropDowns[i].parentElement;
				dropDownDiv = document.createElement("DIV");
				optionsBlock = document.createElement("DIV");
				firstText = dropDowns[i].childNodes[1].innerHTML;
				firstTextElement = document.createElement("P");
				firstTextElement.innerHTML = firstText;
				dropDownDiv.tabIndex = "0";
				_.addClass(optionsBlock, 'options');
				this.getOptions(dropDowns[i], optionsBlock);
				_.addClass(dropDownDiv, "select");
				widths.push(dropDowns[i].offsetWidth);
				dropDownDiv.appendChild(optionsBlock);
				dropDownDiv.appendChild(firstTextElement);
				dropDownParent.insertBefore(dropDownDiv, dropDowns[i]);
				dropDowns[i].style.position = "absolute";
				dropDowns[i].style.left = "-10000px";
			}
			
			dropDowns = _.getElementsByClass('select');
			for (i = 0; i < widths.length; i++) {
				dropDowns[i].style.width = String(parseInt(widths[i]) + "px");
			}
		},
		
		getOptions: function(sel, div) {
			var options = sel.children;
			for (var opt in options) {
				if (options[opt].innerHTML !== undefined) { 
					var txt = document.createElement("DIV");
					txt.tabIndex = "0";
					_.addClass(txt, "option");
					txt.appendChild(document.createTextNode(options[opt].innerHTML));
					div.appendChild(txt);
				}
			}
		},
		
		checkJobRoles: function(el) {
			var topLevel = el.parentElement.parentElement.parentElement.childNodes[1].innerHTML;
			if (el.innerHTML === "Other" && topLevel === "Basic Info") {
				document.getElementById("job-role").style.display = "block";
			} else if (el.innerHTML !== "Other" && topLevel === "Basic Info") {
				document.getElementById("job-role").style.display = "none";
			}
		},
		
		clearColors: function() {
			var arr = [];
			var el = document.getElementById("colors-js-puns").childNodes[3].childNodes[0].childNodes;
			for (var i = 0; i < el.length; i++) {
				arr.push(el[i].innerHTML);
			}
			document.getElementById("colors-js-puns").childNodes[3].childNodes[0].innerHTML = "";
			document.getElementById("colors-js-puns").childNodes[3].childNodes[1].innerHTML = "";
			return arr;
		},
		
		fillColors: function(el) {
			var str = el.innerHTML.slice(8, el.innerHTML.length);
			var target = document.getElementById("colors-js-puns").childNodes[3].childNodes[0];
			try {
				var patt = new RegExp (str, "i");
			} catch (err) {}
			var txt, i;
			var topLevel = el.parentElement.parentElement.parentElement.childNodes[1].innerHTML;
			if (topLevel === "Design:"){
				target.innerHTML = "";
				for (i = 0; i <= designArray.length; i++) {
					if (patt.test(designArray[i])) {
						document.getElementById("colors-js-puns").style.opacity = 1;
						txt = document.createElement("DIV");
						_.addClass(txt, 'option');
						txt.tabIndex = "0";
						txt.appendChild(document.createTextNode(designArray[i]));
						_.addEventListener(txt, 'click', function() { animations.addTextToParent(this); });
						_.addEventListener(txt, 'keydown', addTextFunction);
						target.appendChild(txt);
					}
				}
			}
		}
  };
  
}(Core));

var clickFunction = function() {
	animations.dropDownAnimation(this.childNodes[0]);
}

var keyDownFunction = function(e) {
	console.log(e.which);
	var test = parseInt(window.getComputedStyle(this.firstChild).getPropertyValue("height"));
	console.log(test);
	if (test > 10) {
		if (e.which === 9) {
			e.preventDefault();
			return 0;
		}
		if (e.which === 40) {
			e.preventDefault();
			if (document.activeElement.className === "select") {
				this.childNodes[0].childNodes[0].focus();
			} else {
				try {
					document.activeElement.nextSibling.focus();
				} catch (err) {};
			}
		} else if (e.which === 38) {
			e.preventDefault();
			try {
				document.activeElement.previousSibling.focus();
			} catch (err) {};
		}
	}
}

var animationFunction = function(e) {
	if (e.which === 13 || e.which === 32) {
		e.preventDefault();
		animations.dropDownAnimation(this.childNodes[0]);
	}
}

var addTextFunction = function(e) {
	if (e.which === 13 || e.which === 32 || e.which === 1) {
		animations.addTextToParent(this);
		console.log(this);
	}
}

app.init();
var sels = Core.getElementsByClass('select');
for (var i = 0; i < sels.length; i++) {
	Core.addEventListener(sels[i], 'click', clickFunction);
	Core.addEventListener(sels[i], 'keydown', keyDownFunction);
	Core.addEventListener(sels[i], 'keydown', animationFunction);
	try {
		var options = sels[i].childNodes[0].childNodes;
	} catch (err) {}
	for (var j = 0; j < options.length; j++) {
		Core.addEventListener(options[j], 'click', addTextFunction);
		Core.addEventListener(options[j], 'keydown', addTextFunction);
	}
}


