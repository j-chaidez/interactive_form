// assign Core to Core variable for use outside of modules
var Core = Core;
// create animations module
var animations = (function(_) {
	
	return {
		// this function is responsible for controlling both how the dropdown is animated and its height
		dropDownAnimation: function(el) {
			// pass the element into the function
			if (el) {
				// set the parent element of options element to white; trigger the transition
				el.parentElement.style.backgroundColor = "white";
				// set el as the target element
				var target = el;
				// get the computed style of the element
				var targetStyle = Math.round(parseInt(_.getComputedStyle(target, "height")));
				if (targetStyle <= 0) {
				// if the target style is less than or equal to zero, that means the options need to be expanded
					target.style.height = "auto";
				} else {
				// else, collapse the target
					target.style.height = "0px";
				    // set the style of the target's parent element back to its original
					el.parentElement.style.backgroundColor = "#c1deeb";
				}
			}
		},
		// this function is responsible for adding text to the div when an option is selected
		addTextToParent: function(el) {
			// el is the actual value that was selected; i need to find its top level parent element
			var target = el.parentElement.parentElement;
			// since the text inside of the div is actually just a p element, if it exists and another option is selected, i need to remove it
			if (target.lastChild.nodeName === "P") {
				target.removeChild(target.lastChild);
			}
			// run checkJobRoles function
			app.checkJobRoles(el);
			// run fillColors function
			app.fillColors(el);
			// run checkPaymentOption function
			app.checkPaymentOption(el);
			// create a new P element
			var txt = document.createElement("P");
			// set its font size
			txt.style.fontSize = "1em";
			// set txt's innerHTML equal to the element's HTML
			txt.innerHTML = el.innerHTML;
			// append txt to the target element
			target.appendChild(txt);
		},
		
		adjustTotal: function(cash) {
		    var target = _.getElementsByClass("activities")[0];
			var pageTotal = _.getElementsByClass("total")[0];
			var total;
			if (pageTotal) {
				total = parseInt(pageTotal.innerHTML) + parseInt(cash);
				pageTotal.innerHTML = total;
			} else {
				total = 0;
				total += parseInt(cash);
				var el = document.createElement("H2");
				var span = document.createElement("SPAN");
				el.style.fontSize = "22px";
				el.style.display = "inline-block";
				span.innerHTML = "Total: $";
				span.style.fontWeight = "bold";
				span.style.fontSize = "20px";
				_.addClass(el, "total");
				var txt = document.createTextNode(total);
				el.appendChild(txt);
				target.appendChild(span);
				target.appendChild(el);
			}
		}

	};
	
}(Core));

var app = (function(_) {
	var designArray = [];
	return {
		
		init: function() {
			document.getElementById("name").focus();
			document.getElementById("job-role").style.display = "none";
			document.getElementById("colors-js-puns").style.opacity = 0;
			document.getElementById("paypal").style.display = "none";
			document.getElementById("bitcoin").style.display = "none";
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
				dropDownDiv.id = dropDowns[i].id;
				dropDowns[i].id = "";
				widths.push(dropDowns[i].offsetWidth);
				dropDownDiv.appendChild(optionsBlock);
				dropDownDiv.appendChild(firstTextElement);
				dropDownParent.insertBefore(dropDownDiv, dropDowns[i]);
				dropDowns[i].style.position = "absolute";
				dropDowns[i].style.left = "-10000px";
			}
			
			dropDowns = _.getElementsByClass('select');
			for (i = 0; i < widths.length; i++) {
				dropDowns[i].style.width = String(parseInt(widths[i] + 10) + "px");
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
			var f = function() {
				animations.addTextToParent(this);
			}
			var patt;
			var str = el.innerHTML.slice(8, el.innerHTML.length);
			var target = document.getElementById("colors-js-puns").childNodes[3].childNodes[0];
			try {
				patt = new RegExp (str, "i");
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
						_.addEventListener(txt, 'click', f);
						_.addEventListener(txt, 'keydown', events.addTextFunction);
						target.appendChild(txt);
						target.nextSibling.innerHTML = "";
					}
				}
			}
		},
		
		checkPaymentOption: function(el) {
			if (el.innerHTML === "PayPal") {
				document.getElementById("paypal").style.display = "block";
				document.getElementById("bitcoin").style.display = "none";
				document.getElementById("credit-card").style.display = "none";
			} else if (el.innerHTML === "Bitcoin") {
				document.getElementById("paypal").style.display = "none";
				document.getElementById("bitcoin").style.display = "block";
				document.getElementById("credit-card").style.display = "none";
			} else if (el.innerHTML === "Credit Card") {
				document.getElementById("paypal").style.display = "none";
				document.getElementById("bitcoin").style.display = "none";
				document.getElementById("credit-card").style.display = "block";
			}
		},
		
		
		totalEvents: function(el, clickedObject) {
			var arr = el.innerHTML.split(" ");
			var pos = arr.length - 1;
			var cash = parseInt(arr[pos].slice(1,arr[pos].length));
		    if (el.firstChild.checked) {
				animations.adjustTotal(cash);
			} else if (!el.firstChild.checked) {
				animations.adjustTotal(-cash);
			}
			this.parseEvents(arr, clickedObject);
		},
		
		parseEvents: function(arr, clickedObject) {
			var previous = this.getTime(arr);
			var current;
			var target;
			var labels = document.getElementsByTagName("label");
			for (var i = 0; i < labels.length; i++) {
				if (labels[i].firstChild.type === "checkbox") {
					target = labels[i].firstChild;
					current = labels[i].innerHTML.split(" ");
					current = this.getTime(current);
						if (current.day === previous.day && current.time === previous.time) {
							if (target.checked === false && target.disabled === false) {
								target.disabled = true;
								labels[i].style.textDecoration = "line-through";
							} else {
								target.disabled = false;
								labels[i].style.textDecoration = "none";
							}
						}
					}
				}
			clickedObject.disabled = false;
			clickedObject.parentElement.style.textDecoration = "none";
			},
	
		getTime: function(arr) {
			var pm = /\dPM/gi;
			var am = /\dAM/gi;
			var evt = {};

			var daysOfWeek = {
				Sunday: 1,
				Monday: 2,
				Tuesday: 3,
				Wednesday: 4,
				Thursday: 5,
				Friday: 6,
				Saturday: 7
			};
			
			
			var dayOfWeek = arr.filter(function(item) {
				if (item in daysOfWeek) {
					return item;
				}
			});
			
			var time = arr.filter(function(item) {
				if (pm.test(item) || am.test(item)) {
					return item;
				}
			});
			
			evt.day = dayOfWeek[0];
			evt.time = time[0];
			
			return evt;
		},
		
		verifyName: function(input) {
			var patt = /\w{2,}/;
			if (patt.test(input)) {
				return true;
			} else {
				return false;
			}
		},
		
		verifyCreditCard: function(input) {
			
			var creditCardNumber = input.split("").reverse();
			var arr = creditCardNumber.map(function(number, index) {
				var twice = number * 2;
				if (index % 2 !== 0) {
					return String(twice).split("");
				} else {
					return number;
				}
			});

			var chksum = [].concat.apply([], arr).reduce(function(a, b) {
				return Number(a) + Number(b);
			});
			

		    if (chksum % 10 === 0) {
				console.log(true);
				return true;
		    } else {
				return false;
		    }
		},
		
		verifyEmail: function(input) {
			var patt = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
			return patt.test(input);
		},
		
		verifyZipCode: function(input) {
			var patt = /\d{5}/;
			console.log(patt.test(input));
			return patt.test(input);
		},
		
		verifyCVV: function(input) {
			var patt = /\d{3}/;
			console.log(patt.test(input));
			return patt.test(input);
		}
		
  };
  
}(Core));

app.init();

var events = (function(_) {
	
	var checkboxes = document.getElementsByTagName("input");
	var labels = document.getElementsByTagName("label");
	var sels = _.getElementsByClass('select');
	
	return {
		
		init: function() {
			this.iterateObjects(labels, 'click', this.focusElement, false);
			this.iterateObjects(sels, 'click', this.clickFunction, true);
			this.iterateObjects(sels, 'keydown', this.keyDownFunction, false);
			this.iterateObjects(sels, 'keydown', this.animationFunction, true);
			var btn = document.getElementsByTagName("button")[0];
			_.addEventListener(btn, "click", this.checkInputs);
			for (var i = 0; i < checkboxes.length; i++) {
				if (checkboxes[i].type === "checkbox") {
				_.addEventListener(checkboxes[i], 'click', this.checkBoxListener);
				}
			}
		},
	
		iterateObjects: function(obj, action, func, opts) {
			var options;
			for (var i = 0; i < obj.length; i++) {
				_.addEventListener(obj[i], action, func);
				if (opts) {
					try {
						options = obj[i].childNodes[0].childNodes;
					} catch (err) {}
					console.log("OK");
					for (var j = 0; j < options.length; j++) {
						_.addEventListener(options[j], 'click', this.addTextFunction);
						_.addEventListener(options[j], 'keydown', this.addTextFunction);
					}
				}
			}
		},
		
		clickFunction: function() {
			animations.dropDownAnimation(this.childNodes[0]);
		},
		
		keyDownFunction: function(e) {
			var test = parseInt(window.getComputedStyle(this.firstChild).getPropertyValue("height"));
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
						} catch (err) {}
					}
				} else if (e.which === 38) {
					e.preventDefault();
					try {
						document.activeElement.previousSibling.focus();
					} catch (err) {}
				}
			}
		},
		
		animationFunction: function(e) {
			if (e.which === 13 || e.which === 32) {
				e.preventDefault();
				animations.dropDownAnimation(this.childNodes[0]);
			}
		},
		
		addTextFunction: function(e) {
			if (e.which === 13 || e.which === 32 || e.which === 1) {
				animations.addTextToParent(this);
			}
		},
		
		focusElement: function() {
			try {
				document.getElementById(this.htmlFor).focus();
			} catch (err) {
				console.log("No label for attached");
			}
		},
		
		checkBoxListener: function() {
			app.totalEvents(this.parentElement, this);
		},
		
		checkInputs: function(e) {
			var name = document.getElementById("name");
			var warn = document.createElement("LABEL");
			var email = document.getElementById("mail");
			var creditCardDiv = document.getElementById("credit-card");
			var creditCard = document.getElementById("cc-num");
			var childNodes, i, exists;
			warn.className = "warning";
			
			if (!app.verifyName(name.value)) {
				exists = false;
				childNodes = name.parentNode.children;
				var nameWarning = document.createElement("LABEL");
				nameWarning.innerHTML = "Please enter your name";
				nameWarning.className = "warning";
				e.preventDefault();
				for (i = 0; i < childNodes.length; i++) {
					if (childNodes[i].className === "warning" && childNodes[i].innerHTML === "Please enter your name") {
						childNodes[i].innerHTML = "Please enter your name";
						exists = true;
					}
				}
				if (exists === false) {
					name.parentNode.insertBefore(nameWarning, name);
				}
			}
			
			if (!app.verifyEmail(email.value)) {
				exists = false;
				childNodes = email.parentNode.children;
				var emailWarning = document.createElement("LABEL");
				emailWarning.innerHTML = "Please enter an e-mail";
				emailWarning.className = "warning";
				e.preventDefault();
				for (i = 0; i < childNodes.length; i++) {
					if (childNodes[i].className === "warning" && childNodes[i].innerHTML === "Please enter an e-mail") {
						childNodes[i].innerHTML = "Please enter an e-mail";
						exists = true;
					}
				}
				if (exists === false) {
					name.parentNode.insertBefore(emailWarning, email);
				}
			}
			
			if (_.getComputedStyle(creditCardDiv, "display") !== "none") {
				exists = false;
				var zCode = document.getElementById("zip");
				var cvv = document.getElementById("cvv");
				var ccWarn = document.createElement("LABEL");
				var ccParent = creditCard.parentNode;
				childNodes = ccParent.children;
				ccWarn.innerHTML = "Please enter valid credit card information";
				ccWarn.className = "warning";
				if (creditCard.value === "") {
					e.preventDefault();
					ccParent.removeChild(creditCard.parentNode.childNodes[1]);
					for (i = 0; i < childNodes,length; i++) {
						if (childNodes[i].className === "warning" && childNodes[i].innerHTML === "Please enter valid credit card information") {
							childNodes[i].innerHTML = "Please enter valid credit card information";
							exists = true;
						}
					}
					if (exists === false) {
						creditCard.parentNode.insertBefore(ccWarn, creditCard);
					}
					
				} else if (!app.verifyCreditCard(creditCard.value) ||
						   !app.verifyZipCode(zCode.value) ||
						   !app.verifyCVV(cvv.value)) {
					ccParent.removeChild(creditCard.parentNode.childNodes[1]);
					e.preventDefault();
					for (i = 0; i < childNodes.length; i++) {
						if (childNodes[i].className === "warning" && childNodes[i].innerHTML === "Please enter valid credit card information") {
							childNodes[i].innerHTML = "Please enter valid credit card information";
							exists = true;
						}
					}
					if (exists === false) {
						creditCard.parentNode.insertBefore(ccWarn, creditCard);
					}
				}
			}
		}
	};
	
}(Core));

events.init();


