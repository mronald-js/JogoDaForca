const palavras = ['carro', 'celular', 'batata', 'fruta', 'ninja'];
const palavra = document.getElementById('word');
const adivinhacao = document.getElementById('guess');
const btn = document.getElementById('letter');
const wrongGuesses = document.getElementById('wrongGuesses');
const stickPhase = document.createElement("img");
const stickBox = document.getElementById("boneco");
let randomWord = '';
let errors = 0;

//A função abaixo retorna uma palavra aleatoria do array palavras
const escolhePalavraAleatorioa = () => {
    return palavras[Math.floor(Math.random() * (palavras.length - 0) + 0)];
}

for (let letter of escolhePalavraAleatorioa()) {
    palavra.textContent += '_ '
    randomWord += letter
}

let wordToGuess = palavra.firstChild.nodeValue.split("");
console.log(randomWord, wordToGuess, wordToGuess.join(''))


btn.addEventListener('keypress', (event) => {
    const keyName = event.key;
    let counter = 0;
    if(keyName === 'Enter'){
        let k = 0;
        for(let i = 0; i<randomWord.length; i++){
            if(btn.value === randomWord[i]){
                wordToGuess[k] = randomWord[i];
                counter++;
            } else wordToGuess
            k += 2;
        }
        if(counter === 0) {
            const wrongParagraph = document.createElement('p');
            let p = document.querySelector('p');
            errors++;
            stickPhase.width = 256;
            console.log(errors)
            stickPhase.src = `stickman/${errors}.png`;
            stickBox.innerHTML = ""
            stickBox.appendChild(stickPhase)
            if(wrongGuesses.contains(p)){
                p.innerText += `, ${btn.value}`
            }else {
                wrongGuesses.appendChild(wrongParagraph);
                wrongParagraph.innerText += btn.value
            }
        }
        palavra.textContent = wordToGuess.join('')
    }
});



