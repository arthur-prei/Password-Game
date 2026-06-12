const passwordChars = [
    "first",
    "second",
    "third",
    "fourth"
];

let userAttempts = 5;

const infoText = $("#info");
const remainingAttempts = $("#attempts");

// COLORS
const rootStyles = getComputedStyle(document.documentElement);
const textColor = rootStyles.getPropertyValue("--text-color");

let gamePassword = generatePassword(4);
let userPassword = "";

let playerRecord = 0;
let playerCurrentRun = 0;

const recordSpan = $("#record");
const sequenceSpan = $("#sequence");

remainingAttempts.text(userAttempts);


$("#submit-btn").on("click", () => {
    if ($("#error-msg")) {
                $("#error-msg").remove();
            }
    if (userAttempts > 0) {
        if ($("input").val().length !== 4) {
            $("input").before("<h5 id='error-msg' style='color: red'>Deve ter 4 digitos!</h5>");
        } else {
            validatePasswords();
        }
    }
});
$("#clear").on("click", function () {
    $("input").val("");
    userPassword = "";
});


$(".buttons button").on("click", function () {
    if (userPassword.length === 4) {
        return;
    }

    let text = this.id;
    userPassword += text;

    $("input").val(userPassword);
});


function generatePassword(chars) {
    let available = ["1","2","3","4","5","6","7","8","9"];
    let newPassword = "";
    while (newPassword.length < chars) {
        let randomNumber = Math.floor(Math.random() * available.length);

        newPassword += available[randomNumber];
        available.splice(randomNumber, 1);
    }

    infoText.text("uma nova senha foi gerada!");
    infoText.css("color", "lime");
    console.log(newPassword)
    return newPassword;
}


function resetValues() {

    for (let i = 1; i<$(".buttons button").length + 1; i++) {
        $("button").removeClass("correct exists wrong");
        $(".buttons span").hide();
    }

    passwordChars.forEach(id => {
        $("#" + id).text("?").css("color", textColor);
    });

    infoText.css("color", "lime");
    $("input").val("");

    userPassword = "";
    userAttempts = 5;

    sequenceSpan.text(playerCurrentRun);
    recordSpan.text(playerRecord);

    gamePassword = generatePassword(4);
    remainingAttempts.text(userAttempts);
}


function paintButton(number, className) {
    const button = $("#" + number);

    if (button.hasClass("correct")) {
        return;
    }
    
    if (className === "correct") {
        button.removeClass("exists wrong").addClass("correct");
    } else if (!button.hasClass("exists")) {
        button.removeClass("wrong").addClass(className);
    }
}


function validatePasswords() {
    let equalDigits = 0;

    for (let i = 0; i < gamePassword.length; i++) {
        let char = $("#" + passwordChars[i]);

        if (userPassword[i] === gamePassword[i]) {

            equalDigits ++;
            char.text(userPassword[i]).css("color", "lime");
            paintButton(userPassword[i], "correct");
            $("#" + userPassword[i] + " span").text(i + 1).show();

        } else if (gamePassword.includes(userPassword[i])) {
            char.text(userPassword[i]).css("color", "orange");
            paintButton(userPassword[i], "exists");

        } else {
            char.text(userPassword[i]).css("color", "grey");
            paintButton(userPassword[i], "wrong");
        }
    }
    if (equalDigits === gamePassword.length) {
        playerCurrentRun++;
        if (playerCurrentRun > playerRecord) {
            playerRecord = playerCurrentRun;
        }
        infoText.text("Você acertou a senha!");
        infoText.css("color", "blue");
        setTimeout(() => {
                resetValues();
            }, 2000);

    } else {
        userAttempts--;
        remainingAttempts.text(userAttempts);
        
        if (userAttempts === 0) {
            playerCurrentRun = 0;
            infoText.text("Você não conseguiu acertar a senha! Gerando nova senha...");
            infoText.css("color", "red");
            setTimeout(() => {
                resetValues();
            }, 2000);
        } else {
            infoText.text("Senha incorreta! Tente novamente.");
            infoText.css("color", "orange");
            $("input").val("");
            userPassword = "";
        }
    }
}