let form1 = document.querySelector(".form");
let formGroups = document.querySelectorAll(".form-group");
let btn = document.querySelectorAll(".btn");
let btnSubmit = document.querySelector(".form-submit");

for (var i = 0; i < btn.length; i++) {
	btn[i].addEventListener("click", function (e) {
		e.preventDefault();
	});
}

let loginBtn = document.querySelector(".login-btn");
let registerBtn = document.querySelector(".register-btn");

let createFullName = document.createElement("div");
createFullName.className = "form-group";
createFullName.innerHTML = `
        <label for="fullname" class="form-label">Tên đầy đủ</label>
        <input
            id="fullname"
            name="fullname"
            rules="required"
            type="text"
            placeholder="VD: Lê Văn Tèo"
            class="form-control"
        />
        <span class="form-message"></span>
`;

loginBtn.onclick = function () {
	if (!this.classList.contains("active")) {
		formGroups = document.querySelectorAll(".form-group");
		form1.removeChild(formGroups[0]);
		this.classList.add("active");
		registerBtn.classList.remove("active");
		btnSubmit.innerHTML = "Đăng nhập";
	}
};

registerBtn.onclick = function () {
	if (!this.classList.contains("active")) {
		formGroups = document.querySelectorAll(".form-group");
		form1.insertBefore(createFullName, form1.children[2]);
		this.classList.add("active");
		loginBtn.classList.remove("active");
		btnSubmit.innerHTML = "Đăng ký";
	}
};

function Validator(formSelector) {
	var _this = this;
	var formRules = {};

	function getParent(element, selector) {
		while (element.parentElement) {
			if (element.parentElement.matches(selector)) {
				return element.parentElement;
			}
			element = element.parentElement;
		}
	}

	// Quy ước tạo rule:
	// - Nếu có lỗi return `message lỗi`
	// - Nếu không lỗi return `undefined`
	var validatorRules = {
		required: function (value) {
			return value ? undefined : "Vui lòng nhập trường này";
		},
		email: function (value) {
			var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			return regex.test(value) ? undefined : "Vui lòng nhập nhập đúng định dạng email";
		},
		min: function (min) {
			return function (value) {
				return value.length >= min
					? undefined
					: `Vui lòng nhập ít nhấp ${min} ký tự`;
			};
		},
		max: function (max) {
			return function (value) {
				return value.length <= max
					? undefined
					: `Vui lòng nhập ít nhấp ${max} ký tự`;
			};
		},
	};

	var ruleName = "required";
	// console.log(validatorRules[ruleName]);

	// Lấy ra form element từ trong DOM theo `formSelector`
	var formElement = document.querySelector(formSelector);

	// Chỉ xử lý khi có element trong DOM
	if (formElement) {
		var inputs = formElement.querySelectorAll("[name][rules]");
		for (var input of inputs) {
			var rules = input.getAttribute("rules").split("|");
			for (var rule of rules) {
				var ruleInfo;
				var isRuleHasValue = rule.includes(":");

				if (isRuleHasValue) {
					ruleInfo = rule.split(":");
					rule = ruleInfo[0];
					// console.log(validatorRules[rule](ruleInfo[1]))
				}

				var ruleFunc = validatorRules[rule];

				if (isRuleHasValue) {
					ruleFunc = ruleFunc(ruleInfo[1]);
				}

				// console.log(rule);

				if (Array.isArray(formRules[input.name])) {
					formRules[input.name].push(ruleFunc);
				} else {
					formRules[input.name] = [ruleFunc];
				}
			}

			// Lắng nghe sự kiện để validate (blur, change)
			input.onblur = handleValidate;
			input.oninput = handleClearError;
		}

		// Hàm thực hiện validate
		function handleValidate(e) {
			var rules = formRules[e.target.name];
			var errorMessage;
			for (var rule of rules) {
				errorMessage = rule(event.target.value);
				if (errorMessage) break;
			}

			// Nếu có lỗi thì hiển thị message lỗi ra UI
			if (errorMessage) {
				var formGroup = getParent(e.target, ".form-group");

				if (formGroup) {
					formGroup.classList.add("invalid");
					var formMessage = formGroup.querySelector(".form-message");
					if (formMessage) {
						formMessage.innerText = errorMessage;
					}
				}
			}

			return !errorMessage;
		}

		// Hàm clear message lỗi
		function handleClearError(e) {
			var formGroup = getParent(e.target, ".form-group");
			if (formGroup.classList.contains("invalid")) {
				formGroup.classList.remove("invalid");
				var formMessage = formGroup.querySelector(".form-message");
				if (formMessage) {
					formMessage.innerText = "";
				}
			}
		}

		// Xử lý hành vi submit form
		formElement.onsubmit = function (e) {
			e.preventDefault();

			var inputs = formElement.querySelectorAll("[name][rules]");
			var isValid = true;

			for (var input of inputs) {
				if (!handleValidate({ target: input })) {
					isValid = false;
				}
			}

			// Khi không có lỗi submit form
			if (isValid) {
				formElement.submit();
			}
		};
	}
}
