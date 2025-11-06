const body = document.body;
const vars = {};
const story = [];
let currentStep = 0;
let waitingForInput = false;

function newText(text) {
    const p = document.createElement("p");
    p.textContent = text;
    body.appendChild(p);
}

function newInput(varName, promptText) {
    waitingForInput = true;
    newText(promptText);

    const input = document.createElement("input");
    input.placeholder = "Type here...";
    body.appendChild(input);
    input.focus();

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            vars[varName] = input.value.trim();
            input.remove();
            newText(`You entered: ${vars[varName]}`);
            waitingForInput = false;
            nextLine();
        }
    });
}

function newChoice(promptText, choices) {
    waitingForInput = true;
    newText(promptText);

    const div = document.createElement("div");
    body.appendChild(div);

    for (const [label, callback] of Object.entries(choices)) {
        const button = document.createElement("button");
        button.textContent = label;
        button.onclick = () => {
            div.remove();
            waitingForInput = false;
            callback();
        };
        div.appendChild(button);
    }
}

function nextLine() {
    if (waitingForInput) return;
    if (currentStep >= story.length) {
        newText("~ The End ~");
        document.removeEventListener("keydown", keyListener);
        return;
    }

    const step = story[currentStep];
    currentStep++;

    if (typeof step === "function") step();
    else newText(step);
}

function keyListener(event) {
    if (event.key === " " || event.key === "Enter") {
        nextLine();
    }
}

function startGame() {
    body.innerHTML = "";
    document.addEventListener("keydown", keyListener);

    story.length = 0;
    currentStep = 0;

    story.push(
        "The story begins with our hero, " + window.name,
        () => newInput("weapon", "What weapon do you carry?"),
        () => {
            newText(`${window.name} grips their ${vars.weapon} tightly.`);
            if (vars.weapon.toLowerCase().includes("sword")) {
                story.splice(currentStep, 0,
                    "The blade gleams under the moonlight.",
                    () => newChoice("Do you raise it high or sheath it?", {
                        "Raise it high": () => {
                            newText(`${window.name} raises the sword, a cry echoes through the forest.`);
                            nextLine();
                        },
                        "Sheath it": () => {
                            newText(`${window.name} sheathes the sword, choosing silence.`);
                            nextLine();
                        }
                    })
                );
            } else {
                story.splice(currentStep, 0,
                    "The weapon feels strange in your hands...",
                    () => newText("A shadow moves nearby.")
                );
            }
            nextLine();
        },
        () => newText("The forest ahead is silent..."),
        () => newText("You take your first step into the unknown.")
    );

    nextLine();
}