function flamesCalculator(name1, name2) {
    name1 = name1.toLowerCase().replace(/\s+/g, "");
    name2 = name2.toLowerCase().replace(/\s+/g, "");

    let count1 = {}, count2 = {};

    for (let char of name1) count1[char] = (count1[char] || 0) + 1;
    for (let char of name2) count2[char] = (count2[char] || 0) + 1;

    for (let char in count1) {
        if (count2[char]) {
            let minCount = Math.min(count1[char], count2[char]);
            count1[char] -= minCount;
            count2[char] -= minCount;
        }
    }

    let total = Object.values(count1).reduce((a, b) => a + b, 0) +
                Object.values(count2).reduce((a, b) => a + b, 0);

    const flames = ['F', 'L', 'A', 'M', 'E', 'S'];
    const meanings = { F: "Friends", L: "Lovers", A: "Affection", M: "Marriage", E: "Enemies", S: "Siblings" };

    if (total === 0) return "Perfect Match!";

    let currentFlames = [...flames];
    while (currentFlames.length > 1) {
        let index = (total - 1) % currentFlames.length;
        currentFlames.splice(index, 1);
    }

    return `${currentFlames[0]} - ${meanings[currentFlames[0]]}`;
}

function startFlames() {
    let name1 = document.getElementById("name1").value;
    let name2 = document.getElementById("name2").value;

    if (!name1 || !name2) return alert("Please enter both names.");

    document.getElementById("loadingSection").style.display = 'block';
    document.getElementById("resultSection").style.display = 'none';
    document.getElementById("flamesText").style.visibility = 'visible';

    let progress = 0;
    let loadingProgress = document.getElementById("loadingProgress");
    let flamesLetters = document.getElementById("flamesText").getElementsByTagName("span");

    let blinkInterval = setInterval(() => {
        flamesLetters[progress % flamesLetters.length].classList.add("active");
        setTimeout(() => flamesLetters[progress % flamesLetters.length].classList.remove("active"), 500);

        progress++;
        loadingProgress.innerText = `${progress}%`;
        loadingProgress.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(blinkInterval);
            let result = flamesCalculator(name1, name2);
            document.getElementById("loadingSection").style.display = 'none';
            document.getElementById("resultSection").style.display = 'block';
            document.getElementById("flamesResult").innerText = result;

            let resultLetter = result.charAt(0).toUpperCase();
            for (let letter of flamesLetters) {
                letter.classList.remove("active");
                if (letter.innerText === resultLetter) {
                    letter.classList.add("active");
                }
            }
        }
    }, 30);
}