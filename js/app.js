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
			// target the colors select box
			var el = document.getElementById("colors-js-puns").childNodes[3].childNodes[0].childNodes;
			// initiate a for loop
			for (var i = 0; i < el.length; i++) {
				// push the innerHTML into the newly created array
				arr.push(el[i].innerHTML);
			}
			// clear the whole select box
			document.getElementById("colors-js-puns").childNodes[3].childNodes[0].innerHTML = "";
			document.getElementById("colors-js-puns").childNodes[3].childNodes[1].innerHTML = "";
			// return the newly created array
			return arr;
		},
		
		// fillColors is responsible for filling the color select box
		fillColors: function(el) {
			// designate a function to use for the upcoming click event handler
			var f = function() {
				animations.addTextToParent(this);
			};
			// the patt variable is used for the regexp
			var patt;
			// get the value of the target element and slice in order to get the value
			var str = el.innerHTML.slice(8, el.innerHTML.length);
			// designate the target element
			var target = document.getElementById("colors-js-puns").childNodes[3].childNodes[0];
			// try catch block just in case str isn't defined
			try {
				patt = new RegExp (str, "i");
			} catch (err) {}
			// declare the txt and i variables
			var txt, i;
			// get the uppermost top level element
			var topLevel = el.parentElement.parentElement.parentElement.childNodes[1].innerHTML;
			// if the top level equal to "Design:"
			if (topLevel === "Design:"){
				// set the target innerHTML equal to nothing
				target.innerHTML = "";
				// initiate a for loop
				for (i = 0; i <= designArray.length; i++) {
					// run a test on the currently indexed designArray
					if (patt.test(designArray[i])) {
						// set the opacity of the hidden element to 1
						document.getElementById("colors-js-puns").style.opacity = 1;
						// create a new div element
						txt = document.createElement("DIV");
						// add the class 'option' to txt
						_.addClass(txt, 'option');
						// set the tab index
						txt.tabIndex = "0";
						// append the a new text node to txt
						txt.appendChild(document.createTextNode(designArray[i]));
						// add event listeners
						_.addEventListener(txt, 'click', f);
						_.addEventListener(txt, 'keydown', events.addTextFunction);
						// add the txt variable to the target 
						target.appendChild(txt);
						// set the innerHTML of the next sibling to nothing
						target.nextSibling.innerHTML = "";
					}
				}
			}
		},
		
		// checkPaymentOption is a function designed to check the payment option that has been selected
		checkPaymentOption: function(el) {
			// if one option is selected, hide all other options
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
		
		// totalEvents is responsible for summing the total of the events
		totalEvents: function(el, clickedObject) {
			// create an array out of parameter el's innerHTML
			var arr = el.innerHTML.split(" ");
			// mark the target position
			var pos = arr.length - 1;
			// get the 'cash' value of the last element in the array 
			var cash = parseInt(arr[pos].slice(1,arr[pos].length));
		    if (el.firstChild.checked) {
			// if the element is checked, call adjustTotal to modify the cash value
				animations.adjustTotal(cash);
			} else if (!el.firstChild.checked) {
			// if checked is false, subtract the cash value
				animations.adjustTotal(-cash);
			}
			// call parseEvents
			this.parseEvents(arr, clickedObject);
		},
		
		// parseEvents is responsible for making sure that two items that occur at the same time cannot be selected
		parseEvents: function(arr, clickedObject) {
			// get the previously clicked time value
			var previous = this.getTime(arr);
			// declare the rest of the variables
			var current;
			var target;
			// get all of the label elements in the document
			var labels = document.getElementsByTagName("label");
			// initiate a for loop
			for (var i = 0; i < labels.length; i++) {
				// if the labels firstChild is a checkbox
				if (labels[i].firstChild.type === "checkbox") {
					// set the target equal to the currently indexed label's firstChild
					target = labels[i].firstChild;
					// set current equal to labels[i] innerHTML
					current = labels[i].innerHTML.split(" ");
					// get the time
					current = this.getTime(current);
						// if the current day and time match the previous day and time, disable that option and set the text-decoration
						if (current.day === previous.day && current.time === previous.time) {
							if (target.checked === false && target.disabled === false) {
								target.disabled = true;
								labels[i].style.textDecoration = "line-through";
							} else {
						// else enable the element and set the text decoration to none
								target.disabled = false;
								labels[i].style.textDecoration = "none";
							}
						}
					}
				}
			// prevent the clicked object (checkbox) from being disabled with the following
			clickedObject.disabled = false;
			clickedObject.parentElement.style.textDecoration = "none";
			},
		// getTime is a function that is responsible for getting the time value of one of the checked events
		getTime: function(arr) {
			// create a regexp for AM value and PM value
			var pm = /\dPM/gi;
			var am = /\dAM/gi;
			// create an evt object
			var evt = {};
			
			// create a daysOfWeek object that has a number that corresponds to the day of the week itself
			var daysOfWeek = {
				Sunday: 1,
				Monday: 2,
				Tuesday: 3,
				Wednesday: 4,
				Thursday: 5,
				Friday: 6,
				Saturday: 7
			};
			
			// filter through the arr parameter
			var dayOfWeek = arr.filter(function(item) {
				// if the currently index item in the array is equal is in daysOfWeek, return the item
				if (item in daysOfWeek) {
					return item;
				}
			});
			// filter through the arr parameter
			var time = arr.filter(function(item) {
				// if PM is in item or AM is in item, return the item
				if (pm.test(item) || am.test(item)) {
					return item;
				}
			});
			
			// store the discovered values inside of the evt object
			evt.day = dayOfWeek[0];
			evt.time = time[0];
			
			// return evt for further use
			return evt;
		},
		
		// this function verifies the name input
		verifyName: function(input) {
			// this pattern checks to see if the input is longer than two characters
			var patt = /\w{2,}/;
			// if it is, return true, else return false;
			if (patt.test(input)) {
				return true;
			} else {
				return false;
			}
		},
		
		// this verifyCreditCard function is a spin on the Luhn algorithm
		verifyCreditCard: function(input) {
			
			// if the input length is less than or equal to zero, the user forgot to enter information; return false
			if (input.length <= 0) {
				return false;
			}
			// first take the input, split it into an array, and reverse it
			var creditCardNumber = input.split("").reverse();
			// map through the array to create a new array
			var arr = creditCardNumber.map(function(number, index) {
				// twice is equal to the current number * 2
				var twice = number * 2;
				// if the current index is odd, return an array of twice (20 would end up being ["2", "0"])
				if (index % 2 !== 0) {
					return String(twice).split("");
				} else {
				// else we can just return the number
					return number;
				}
			});
			
			// create the checksum variable to see if the number is going to end up being a valid credit card number
			var chksum = [].concat.apply([], arr).reduce(function(a, b) {
				// at this point we're going to have arrays in arrays, so we have to flatten the array; [].concat.apply([], arr) does this by applying
				// concat to the empty array object for each element inside of the current array
				// reduce the entire array
				return Number(a) + Number(b);
			});
			
			// if the chksum modulo ten is equal to zero, the credit card is valid, return true. else return false
		    if (chksum % 10 === 0) {
				console.log(true);
				return true;
		    } else {
				return false;
		    }
		},
		
		// verify the email
		verifyEmail: function(input) {
			var patt = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
			// regExp taken from http://regexlib.com/REDetails.aspx?regexp_id=16
			return patt.test(input);
			// test the input to determine if the value is valid
		},
		
		// verify the zip code
		verifyZipCode: function(input) {
			// if the zip code has five digits, we'll assume that it's valid. return true or false based off of the test
			var patt = /\d{5}/;
			console.log(patt.test(input));
			return patt.test(input);
		},
		
		// verify the CVV
		verifyCVV: function(input) {
			// CVV's typically have three digits, test to see if a three digit number is supplied. if it is, return true, else return false;
			var patt = /\d{3}/;
			console.log(patt.test(input));
			return patt.test(input);
		}
		
  };
  
}(Core));

// initialize the app module
app.init();

var events = (function(_) {
	// declare all of the variables that we'll need later
	var checkboxes = document.getElementsByTagName("input");
	var labels = document.getElementsByTagName("label");
	var sels = _.getElementsByClass('select');
	var name = document.getElementById("name");
	var warn = document.createElement("LABEL");
	var childNodes, exists;
	warn.className = "warning";
	
	return {
		// the init function is responsible for initializing events default state
		init: function() {
			// call the iterateObjects function to add the events to each of the elements
			this.iterateObjects(labels, 'click', this.focusElement, false);
			this.iterateObjects(sels, 'click', this.clickFunction, true);
			this.iterateObjects(sels, 'keydown', this.keyDownFunction, false);
			this.iterateObjects(sels, 'keydown', this.animationFunction, true);
			// get the only button inside of the document
			var btn = document.getElementsByTagName("button")[0];
			// add a click event listenener and assign it to checkInputs
			_.addEventListener(btn, "click", this.checkInputs);
			// initiate a for loop
			for (var i = 0; i < checkboxes.length; i++) {
				// if we find a checkbox, add a click event listener to it that points to the checkBoxListener function
				if (checkboxes[i].type === "checkbox") {
				_.addEventListener(checkboxes[i], 'click', this.checkBoxListener);
				}
			}
		},
		
		// i saw the same code popping up over and over, so i created this function to handle the repetition
		iterateObjects: function(obj, action, func, opts) {
			// obj is the actual object that we are placing an event listener on. in this case it's a collection of objects
			// action is the action that we wish to assign to the object
			// func is the function that we'll assign to the event handler
			// opts checks to see if "options" are available (for select boxes);
			// declare the options variable
			var options;
			// initiate a for loop
			for (var i = 0; i < obj.length; i++) {
				// add the desired event listener to the currently indexed object
				_.addEventListener(obj[i], action, func);
				// if options are available
				if (opts) {
					try {
						// try to get the childNodes, if not then throw an error
						options = obj[i].childNodes[0].childNodes;
					} catch (err) {}
					// console.log for debugging purposes
					console.log("OK");
					// initiate an inner loop for the options (if they exist)
					for (var j = 0; j < options.length; j++) {
						// add the event listeners
						_.addEventListener(options[j], 'click', this.addTextFunction);
						_.addEventListener(options[j], 'keydown', this.addTextFunction);
					}
				}
			}
		},
		
		// designate the clickFunction used for the select boxes
		clickFunction: function() {
			// call the dropDownAnimation function
			animations.dropDownAnimation(this.childNodes[0]);
		},
		
		// this function prevents the default screen scroll when a select box is chosen
		keyDownFunction: function(e) {
			// get the computed height value for this' firstChild value. we're testing to see if the optionsBlock is shown or not
			var test = parseInt(window.getComputedStyle(this.firstChild).getPropertyValue("height"));
			// if the test is greater than 10, it's safe to assume that the options block is shown
			if (test > 10) {
				// if e.which === 9, prevent default and return 0;
				if (e.which === 9) {
					e.preventDefault();
					return 0;
				}
				// if e.which === 40 (down) prevent the default event
				if (e.which === 40) {
					e.preventDefault();
					// set focus on the first element in the list if the currently selected element is the select box
					if (document.activeElement.className === "select") {
						this.childNodes[0].childNodes[0].focus();
					} else {
						// try to focus on the next sibling if not. try catch is used here because when you reach the end of the list, an error will be thrown as there is no next sibling
						try {
							document.activeElement.nextSibling.focus();
						} catch (err) {}
					}
				// if up is clicked prevent default and find the previousSibling, add focus. try catch is used for the same reason here
				} else if (e.which === 38) {
					e.preventDefault();
					try {
						document.activeElement.previousSibling.focus();
					} catch (err) {}
				}
			}
		},
		
		// set animationFunction for use with event handlers
		animationFunction: function(e) {
			// trigger the event function if spacebar or enter is pressed
			if (e.which === 13 || e.which === 32) {
				e.preventDefault();
				animations.dropDownAnimation(this.childNodes[0]);
			}
		},
		
		// set addTextFunction for use with event handlers
		addTextFunction: function(e) {
			// trigger the addTextToParent function is spacebar or enter is pressed
			if (e.which === 13 || e.which === 32 || e.which === 1) {
				animations.addTextToParent(this);
			}
		},
		
		// mimick the default focus behavior for select elements on the page
		focusElement: function() {
			// try to see if the current clicked element has a matching id, if it doesn't then console.log that no label is available for attached
			try {
				document.getElementById(this.htmlFor).focus();
			} catch (err) {
				console.log("No label for attached");
			}
		},
		
		// create the checkBoxListener function for use with event handlers
		checkBoxListener: function() {
			// call the app.totalEvents function
			app.totalEvents(this.parentElement, this);
		},

		// checkName is responsible for calling the verifyName function and displaying warnings if the input is wrong
		checkName: function(e) {
			// get the object with the id of name
			var name = document.getElementById("name");
			// create a label for use as a warning 
			var nameWarning = document.createElement("LABEL");
			// if app.verifyName produces false, the input is wrong
			if (!app.verifyName(name.value)) {
				// exists is used to ehck if the label already exists on the page; default is false (element hasn't been created yet)
				exists = false;
				// get the childNodes of the parentNode of name
				childNodes = name.parentNode.children;
				// set the innerHTML of nameWarning equal to "Please enter your name"
				nameWarning.innerHTML = "Please enter your name";
				// set the className of nameWarning equal to "warning"
				nameWarning.className = "warning";
				// prevent default behavior of the button press
				e.preventDefault();
				// check to see if the label exists already 
				events.findLabel(childNodes, "Please enter your name");
				// if it doesn't then insert it before the name object
				if (exists === false) {
					name.parentNode.insertBefore(nameWarning, name);
				}
			}
		},
		
		// check e-mail does the EXACT same thing as checkName, in just about the same order
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
		
		// checkEvents makes sure that at least one event item is clicked
		checkEvents: function(e) {
			// this variable acts as a boolean value to check if a checkbox has been clicked
			var checked = false;
			// exists is default to false; the warning label doesn't exist yet 
			exists = false;
			// get the div with the class of activities
			var activities = _.getElementsByClass("activities")[0];
			// create a label called checkWarning
			var checkWarning = document.createElement("LABEL");
			// set the innerHTML of checkWarning equal to "Please select an event"
			checkWarning.innerHTML = "Please select an event";
			// set the className of checkWarning equal to warning
			checkWarning.className = "warning";
			// initiate a for loop
			for (var i = 0; i < checkboxes.length; i++) {
				// iterate over the checkboxes
				if (checkboxes[i].type === "checkbox") {
					// if we are dealing with a checkbox
					// and it's checked
					if (checkboxes[i].checked === true) {
						// the user has checked a checkbox
						checked = true;
					}
				}
			}
			
			// if a box has not been checked
			if (!checked) {
				// prevent default behavior of the button press
				e.preventDefault();
				// initiate a for loop
				for (i = 0; i < activities.children.length; i++) {
					// check to see if the warning label already exists
					if (activities.children[i].className === "warning") {
						// update the HTML
						activities.children[i].innerHTML = "Please select an event";
						// set exists equal to true
						exists = true;
					}
				}
				// if not, then insert the warning label before activities firstChild
				if (exists === false) {
					activities.insertBefore(checkWarning, activities.firstChild);
				}
			}
			
		},
		
		// checkPaymentType is responsible for making sure the the user has selected a payment type
		checkPaymentType: function(e) {
			// exists is set to false as the label, by default, hasn't been appended yet
			exists = false;
			// get the element with the id of payment
			var payment = document.getElementById("payment");
			// create a label element named paymentWarning
			var paymentWarning = document.createElement("LABEL");
			// set the innerHTML of paymentWarning to "Please select a payment type"
			paymentWarning.innerHTML = "Please select a payment type";
			// set the className of paymentWarning to "warning"
			paymentWarning.className = "warning";
			// if payments option is "select payment method"
			if (payment.lastChild.innerHTML === "Select Payment Method") {
				// the user hasn't selected a valid payment option, prevent default behavior of the button press
				e.preventDefault();
				// initiate a for loop
				for (var i = 0; i < payment.parentNode.children.length; i++) {
					// try to find a label with class of warning 
					if (payment.parentNode.children[i].className === "warning") {
						// if it is found, just update the innerHTML and set exists to true
						payment.parentNode.children[i].innerHTML = "Please select a payment type";
						exists = true;
					}
				}
				// otherwise if the element hasn't been found, it hasn't been created
				if (exists === false) {
					// insert the paymentWarning before payment
					payment.parentNode.insertBefore(paymentWarning, payment);
				}
			}
		},
		
		// checkCreditCard is responsible for calling verifyCreditCard and displaying an error if the input is invalid
		checkCreditCard: function(e) {
			// set exists equal to false as the element hasn't been created by default
			exists = false;
			// get the element with the id of cc-num
			var creditCard = document.getElementById("cc-num");
			// get the zip code element
			var zCode = document.getElementById("zip");
			// get the cvv element
			var cvv = document.getElementById("cvv");
			// get the credit card div
			var creditCardDiv = document.getElementById("credit-card");
			// create a new label element
			var creditCardWarn = document.createElement("LABEL");
			// set the classname equal to "warning"
			creditCardWarn.className = "warning";
			// set the innerHTML equal to "Please enter a valid credit card number"
			creditCardWarn.innerHTML = "Please enter a valid credit card number";
			// check to see if the creditCardDiv is even displayed. if it isn't, then another payment option has been selected
			if (creditCardDiv.style.display !== "none") {
				// if any of the inputs are incorrect
				if (!app.verifyCreditCard(creditCard.value) || !app.verifyZipCode(zCode.value) || !app.verifyCVV(cvv.value)) {
					// prevent the default behavior of the button press
					e.preventDefault();
					// remove the existing child node
					creditCardDiv.removeChild(creditCardDiv.childNodes[0]);
					// initiate a for loop
					for (var i = 0; i < creditCardDiv.children.length; i++) {
						// check to see if a warning label exists
						if (creditCardDiv.children[i].className === "warning") {
							// if it does then just update the innerHTML and set the exists variable equal to true
							creditCardDiv.children[i].innerHTML = "Please enter a valid credit card number";
							exists = true;
						}
					}
					// if exists is false, the element hasn't been appended
					if (exists === false) {
						// insert the creditCardWarn before the first child of the credit card div
						creditCardDiv.insertBefore(creditCardWarn, creditCardDiv.children[0]);
					}
				}
			}
		},
		
		// findLabel was an attempt to create something that would iterate through the children and find warning labels
		findLabel: function(child, txt) {
			// initiate a for loop
			for (var i = 0; i < child.length; i++) {
				// if a warning label exists with the matching innerHTML
				if (childNodes[i].className === "warning" && childNodes[i].innerHTML === txt) {
					// just update the innerHTML and set the exists variable equal to true
					childNodes[i].innerHTML = txt;
					exists = true;
				}
			}
		},
		
		// call all of the functions that we addressed previously passing in the event parameter
		checkInputs: function(e) {
			events.checkName(e);
			events.checkEmail(e);
			events.checkEvents(e);
			events.checkPaymentType(e);
			events.checkCreditCard(e);
		},
	};
	
}(Core));
// initialize events
events.init();


