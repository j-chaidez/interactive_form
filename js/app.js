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
					target.style.maxHeight = "200px";
					target.style.overflowY = "scroll";
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
		// adjustTotal is responsible for summing the total of the events and displaying it on the page
		adjustTotal: function(cash) {
			// target the 'activities' class
		    var target = _.getElementsByClass("activities")[0];
			// target the 'total' class
			var pageTotal = _.getElementsByClass("total")[0];
			// set an empty variable for the total
			var total;
			// check to see if the 'total' element exists
			if (pageTotal) {
				// if it does, parse the innerHTML for an integer, then add the cash parameter for the new total
				total = parseInt(pageTotal.innerHTML) + parseInt(cash);
				// set the innerHTML equal to total
				pageTotal.innerHTML = total;
			} else {
				// if the element does not exist, it's time to create it; set total equal to zero
				total = 0;
				// since cash is passed in as a string, the function needs to parse it for an integer
				total += parseInt(cash);
				// create an h2 element
				var el = document.createElement("H2");
				// create a span element
				var span = document.createElement("SPAN");
				// set the h2 font size
				el.style.fontSize = "22px";
				// set the h2 display style to inline-block
				el.style.display = "inline-block";
				// set the span's innerHTML to "Total: $"
				span.innerHTML = "Total: $";
				// change the fontWeight to bold
				span.style.fontWeight = "bold";
				// change the span font size to 20px
				span.style.fontSize = "20px";
				// add the class of "total" to the h2 element
				_.addClass(el, "total");
				// create a text node with 'total' attached to it
				var txt = document.createTextNode(total);
				// append text as a child to the h2 element
				el.appendChild(txt);
				// append the span to the target
				target.appendChild(span);
				// append the h2 to the target
				target.appendChild(el);
			}
		}

	};
	
}(Core));

// create the app module
var app = (function(_) {
	// create an empty array
	var designArray = [];
	// return an object as the API for app
	return {
		// the init function is responsible for creating initial state
		init: function() {
			// focus on the name input
			document.getElementById("name").focus();
			// set the 'other-role' display style to none
			document.getElementById("other-role").style.display = "none";
			// set the opacity of the colors-js-puns div to 0
			document.getElementById("colors-js-puns").style.opacity = 0;
			// hide the paypal div
			document.getElementById("paypal").style.display = "none";
			// hide the bitcoin div
			document.getElementById("bitcoin").style.display = "none";
			// call the styleDropDowns function that is contained within this object
			this.styleDropDowns();
			// set designArray equal to clearColors; a function contained within this object
			designArray = this.clearColors();
		},
		// styleDropDowns is responsible for replacing the standard select boxes with custom ones
		styleDropDowns: function() {
			// create an empty widths array
			var widths = [];
			// create the variables that the function uses
			var dropDownParent, dropDownDiv, optionsBlock, firstText, firstTextElement;
			// get all of the select elements in the document
			var dropDowns = document.getElementsByTagName("select");
			// initiate a for loop to iterate over the dropdowns
			for (var i = 0; i < dropDowns.length; i++) {
				// get the parent of the current select element
				dropDownParent = dropDowns[i].parentElement;
				// create new div element that will act as the pseudo-select
				dropDownDiv = document.createElement("DIV");
				// create the options area of the new select box
				optionsBlock = document.createElement("DIV");
				// get the innerHTML of the first child node
				firstText = dropDowns[i].childNodes[1].innerHTML;
				// create a new P element to be appended to the div
				firstTextElement = document.createElement("P");
				// set the innerHTML of that element equal to firstText
				firstTextElement.innerHTML = firstText;
				// set the tab index of the div so you can tab through it
				dropDownDiv.tabIndex = "0";
				// add the class options to the options div
				_.addClass(optionsBlock, 'options');
				// call the getOptions function
				this.getOptions(dropDowns[i], optionsBlock);
				// add the class of 'select' to the new dropDownDiv
				_.addClass(dropDownDiv, "select");
				// set the id of the new dropdown to the currently selected dropdown id
				dropDownDiv.id = dropDowns[i].id;
				// set the dropdown id equal to blank
				dropDowns[i].id = "";
				// push the width of the currently selected dropdown element into the widths array
				widths.push(dropDowns[i].offsetWidth);
				// append the options block to the new dropDownDiv
				dropDownDiv.appendChild(optionsBlock);
				// append the first text element to the dropDownDiv
				dropDownDiv.appendChild(firstTextElement);
				// insert the newly created dropDownDiv before the currently selected select element
				dropDownParent.insertBefore(dropDownDiv, dropDowns[i]);
				// hide the currently selected select element
				dropDowns[i].style.position = "absolute";
				dropDowns[i].style.left = "-10000px";
			}
			// set the width of each newly created select element
			dropDowns = _.getElementsByClass('select');
			for (i = 0; i < widths.length; i++) {
				dropDowns[i].style.width = String(parseInt(widths[i] + 10) + "px");
			}
		},
		// getOptions is responsible for getting the options of each select element; pass in the select element and the options div
		getOptions: function(sel, div) {
			// get the options from the sel parameter
			var options = sel.children;
			// initiate a for loop to iterate through the children
			for (var opt in options) {
				// if the currently select option is not equal to undefined
				if (options[opt].innerHTML !== undefined) { 
					// create a new div element
					var txt = document.createElement("DIV");
					// set the tab index for usability
					txt.tabIndex = "0";
					// add the 'option' class to the div element
					_.addClass(txt, "option");
					// append the innerHTML to the new the div
					txt.appendChild(document.createTextNode(options[opt].innerHTML));
					// append txt to the div parameter
					div.appendChild(txt);
				}
			}
		},
		
		// checkJobRoles is responsible for checking to see if the other option is selected in the job titles
		checkJobRoles: function(el) {
			// this very long statement just finds the top-most level parent element
			var topLevel = el.parentElement.parentElement.parentElement.childNodes[1].innerHTML;
			// check to see if 'Other' is selected and the top-most element is equal to 'Basic Info'
			if (el.innerHTML === "Other" && topLevel === "Basic Info") {
			// if it is, set the display equal to block
				document.getElementById("other-role").style.display = "block";
			} else if (el.innerHTML !== "Other" && topLevel === "Basic Info") {
			// if not, set the style display equal to none
				document.getElementById("other-role").style.display = "none";
			}
		},
		
		// clearColors is responsible for clearing out the colors inside of the colors div
		clearColors: function() {
			// create an empty array
			var arr = [];
			// 
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
			};
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
			
			if (input.length <= 0) {
				return false;
			}
			
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
	var name = document.getElementById("name");
	var warn = document.createElement("LABEL");
	var childNodes, exists;
	warn.className = "warning";
	
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

		checkName: function(e) {
			var name = document.getElementById("name");
			var nameWarning = document.createElement("LABEL");
			if (!app.verifyName(name.value)) {
				exists = false;
				childNodes = name.parentNode.children;
				nameWarning.innerHTML = "Please enter your name";
				nameWarning.className = "warning";
				e.preventDefault();
				events.findLabel(childNodes, "Please enter your name");
				if (exists === false) {
					name.parentNode.insertBefore(nameWarning, name);
				}
			}
		},
		
		checkEmail: function(e) {
			var email = document.getElementById("mail");
			var emailWarning = document.createElement("LABEL");
			if (!app.verifyEmail(email.value)) {
				exists = false;
				childNodes = name.parentNode.children;
				emailWarning.innerHTML = "Please enter a valid e-mail address";
				emailWarning.className = "warning";
				e.preventDefault();
				events.findLabel(childNodes, "Please enter a valid e-mail address");
				if (exists === false) {
					name.parentNode.insertBefore(emailWarning, email);
				}
			}
		},
		
		checkEvents: function(e) {
			
			var checked = false;
			exists = false;
			var activities = _.getElementsByClass("activities")[0];
			var checkWarning = document.createElement("LABEL");
			checkWarning.innerHTML = "Please select an event";
			checkWarning.className = "warning";
			for (var i = 0; i < checkboxes.length; i++) {
				if (checkboxes[i].type === "checkbox") {
					console.log(checkboxes[i].checked);
					if (checkboxes[i].checked === true) {
						checked = true;
					}
				}
			}
			
			if (!checked) {
				e.preventDefault();
				for (i = 0; i < activities.children.length; i++) {
					if (activities.children[i].className === "warning") {
						activities.children[i].innerHTML = "Please select an event";
						exists = true;
					}
				}
				
				if (exists === false) {
					activities.insertBefore(checkWarning, activities.firstChild);
				}
			}
			
		},
		
		checkPaymentType: function(e) {
			exists = false;
			var payment = document.getElementById("payment");
			var paymentWarning = document.createElement("LABEL");
			paymentWarning.innerHTML = "Please select a payment type";
			paymentWarning.className = "warning";
			if (payment.lastChild.innerHTML === "Select Payment Method") {
				e.preventDefault();
				for (var i = 0; i < payment.parentNode.children.length; i++) {
					if (payment.parentNode.children[i].className === "warning") {
						payment.parentNode.children[i].innerHTML = "Please select a payment type";
						exists = true;
					}
				}
				if (exists === false) {
					payment.parentNode.insertBefore(paymentWarning, payment);
				}
			}
		},
		
		checkCreditCard: function(e) {
			exists = false;
			var creditCard = document.getElementById("cc-num");
			var zCode = document.getElementById("zip");
			var cvv = document.getElementById("cvv");
			var creditCardDiv = document.getElementById("credit-card");
			var creditCardWarn = document.createElement("LABEL");
			creditCardWarn.className = "warning";
			creditCardWarn.innerHTML = "Please enter a valid credit card number";
			
			if (creditCardDiv.style.display !== "none") {
				if (!app.verifyCreditCard(creditCard.value) || !app.verifyZipCode(zCode.value) || !app.verifyCVV(cvv.value)) {
					e.preventDefault();
					creditCardDiv.removeChild(creditCardDiv.childNodes[0]);
					
					for (var i = 0; i < creditCardDiv.children.length; i++) {
						if (creditCardDiv.children[i].className === "warning") {
							creditCardDiv.children[i].innerHTML = "Please enter a valid credit card number";
							exists = true;
						}
					}
					
					if (exists === false) {
						creditCardDiv.insertBefore(creditCardWarn, creditCardDiv.children[0]);
					}
				}
			}
		},
		
		findLabel: function(child, txt) {
			for (var i = 0; i < child.length; i++) {
				if (childNodes[i].className === "warning" && childNodes[i].innerHTML === txt) {
					console.log(childNodes[i].innerHTML);
					childNodes[i].innerHTML = txt;
					exists = true;
				}
			}
		},
		
		checkInputs: function(e) {
			events.checkName(e);
			events.checkEmail(e);
			events.checkEvents(e);
			events.checkPaymentType(e);
			events.checkCreditCard(e);
		},
	};
	
}(Core));

events.init();


