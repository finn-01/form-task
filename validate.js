function Validator(options) {
	var selectorRules = {};
	//Validate
	function validate(inputElement, rule) {
		var errorElement = inputElement.parentElement.querySelector(
			options.errorSelector
		);
		var errorMessage = rule.test(inputElement.value);

		//Lấy ra các Rule
		var rules = selectorRules[rule.selector];

		//Lặp qua từng Rule
		// for (var i = 0; i < rules.length; i++) {
		// 	errorMessage = rules[i](inputElement.val);
		// 	if (errorMessage) break;
		// }

		//console.log(rules);

		if (errorMessage) {
			errorElement.innerText = errorMessage;
			inputElement.parentElement.classList.add("invalid");
		} else {
			errorElement.innerText = "";
			inputElement.parentElement.classList.remove("invalid");
		}

		return !errorMessage;
	}

	//Lấy Element của Form cần Validate
	var formElement = document.querySelector(options.form);

	if (formElement) {
		formElement.onsubmit = function (e) {
			e.preventDefault();

			var isFormValid = true;

			options.rules.forEach((rule) => {
				var inputElement = formElement.querySelector(rule.selector);
				var isValid = validate(inputElement, rule);

				if (!isValid) {
					isFormValid = false;
				}
			});

			var enableInputs = formElement.querySelectorAll(["name"]);

			//console.log(enableInputs);

			if (isFormValid) {
				if (typeof options.onSubmit === "function") {
					//Select tat ca ca input co attribute == name
					var enableInputs = formElement.querySelectorAll("[name]");

					//console.log(enableInputs);

					var formValues = Array.from(enableInputs).reduce((values, input) => {
						return (values[input.name] = input.value) && values;
					}, {});

					options.onSubmit(formValues);
				}
			} else {
				console.log("Loi");
			}
		};

		options.rules.forEach((rule) => {
			var inputElement = formElement.querySelector(rule.selector);
			var errorElement = inputElement.parentElement.querySelector(
				options.errorSelector
			);

			if (Array.isArray(selectorRules[rule.selector])) {
				selectorRules[rule.selector].push(rule.test);
			} else {
				selectorRules[rule.selector] = [rule.test];
			}

			if (inputElement) {
				//Blur
				inputElement.onblur = () => {
					validate(inputElement, rule);
				};

				//Onclick
				inputElement.oninput = () => {
					errorElement.innerText = "";
					inputElement.parentElement.classList.remove("invalid");
				};
			}
		});

		//console.log(selectorRules);
	}
}

//Dieu luat

Validator.isRequired = function (selector) {
	return {
		selector,
		test: function (value) {
			return value ? undefined : "Vui lòng nhâp trường này!";
		},
	};
};

Validator.specialCha = function (selector, message) {
	return {
		selector,
		test: function (value) {
			var regex = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
			return regex.test(value.trim()) ? undefined : message;
		},
	};
};

Validator.minLength = function (selector) {
	return {
		selector,
		test: function (value) {
			var regex =
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/;
			return regex.test(value) ? undefined : "Password phải dài trên 6 kí tự";
		},
	};
};
