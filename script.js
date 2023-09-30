const palavra = document.getElementById('word');

const campoLetra = document.getElementById('guess');
const letterGuess = document.getElementById('letter');
const wrongGuesses = document.getElementById('wrongGuesses');

const stickPhase = document.createElement("img");
const stickBox = document.getElementById("boneco");
const guessBtn = campoLetra.querySelector('button');

const btnReset = document.getElementById('reset');
const campoPalavra = document.getElementById('wordTry');
const campoTryWord = document.getElementById('guessWordTry')
const guessCampoBtn = document.getElementById('guessWordTry').querySelector('button');

const sections = document.querySelectorAll('section')
console.log(sections)

const difficulties = document.getElementById('difficulty')
const easyDifficulty = document.querySelector('.easy')
const medDifficulty = document.querySelector('.medium')
const hardDifficulty = document.querySelector('.hard')

let randomWord = '', wordToGuess, maxLetters, minLetters, errors = 0, difficulty;

difficulties.addEventListener('click', async (e) => {
    difficulty = e.target.className;
    try {
        await geraPalavraDeAcordoComDificuldade();
        console.log(randomWord);

        for (let i = 0; i < sections.length; i++) {
            sections[i].style.display = 'block';
        }

        for (let i = 0; i < randomWord.length; i++) {
            palavra.textContent += '_ ';
        }
        wordToGuess = palavra.firstChild.nodeValue.split("");
    } catch (error) {
        console.error('Erro:', error);
    }
});



function checarPalavra(word) {
    geraPalavraAleatoria().then(()=>{
        if(word.toLowerCase() === randomWord){
            setTimeout(() => {
                palavra.innerHTML = `<p>${randomWord}</p><p style="color:green">Parabéns, você venceu!</p>`
                esconder()
                btnReset.style.display = 'inline-block'
            }, 10)
        } else return false
    })
}

function esconder() {
    return campoLetra.style.display = 'none', campoTryWord.style.display = 'none'
}

function exibe(){
    return campoLetra.style.display = 'block', campoTryWord.style.display = 'block'
}

async function geraPalavraDeAcordoComDificuldade() {
    if (randomWord) {
        // Se a palavra já foi buscada antes, retorna a palavra armazenada
        return;
    }

    try {
        const response = await fetch('https://api.dicionario-aberto.net/random');
        if (!response.ok) {
            throw new Error('Erro na solicitação da API');
        }
        const data = await response.json();
        const candidateWord = data.word;

        if (difficulty === 'easy') {
            if (candidateWord.length < 3 || candidateWord.length > 5) {
                return geraPalavraDeAcordoComDificuldade();
            }
        } else if (difficulty === 'medium') {
            if (candidateWord.length < 6 || candidateWord.length > 8) {
                return geraPalavraDeAcordoComDificuldade();
            }
        } else if (difficulty === 'hard') {
            if (candidateWord.length < 9) {
                return geraPalavraDeAcordoComDificuldade();
            }
        }

        randomWord = candidateWord;
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

function msgDerrota() {
    campoPalavra.value = ''
    wrongGuesses.style.display = 'none'
    setTimeout(() => {
        geraPalavraAleatoria().then(() => {
            return palavra.innerHTML += `<p style="color:red; background-color:rgba(0,0,0,0.25); padding:20px; width:100%; margin-top:20px">Wasted</p><p style="color:black">Palavra Correta: <span style="color:green">${randomWord}</span></p>`
        })
    }, 10)
}

function reset() {
    errors = 0;
    randomWord = '';
    campoPalavra.value = '';
    palavra.innerHTML = '';
    wrongGuesses.innerHTML = 'Adivinhações Erradas';
    letterGuess.value = ''
    stickBox.innerHTML = ''
    wrongGuesses.style.display = 'block'
    geraPalavraAleatoria().then(() => {
        for (let letter of randomWord) {
            palavra.textContent += '_ '
        }
    })
    exibe()
    btnReset.style.display = 'none';
}

letterGuess.addEventListener('keypress', (event) => {
    const keyName = event.key;
    if(keyName === 'Enter' && errors < 7){
        let k = 0, counter = 0;
        geraPalavraAleatoria().then(()=>{
            for(let i = 0; i<randomWord.length; i++){
                if (letterGuess.value.toLowerCase() === randomWord[i]){
                    wordToGuess[k] = randomWord[i];
                    counter++;
                } else wordToGuess
                k += 2;
            }
            if(counter === 0 && letterGuess.value != '') {
                const wrongParagraph = document.createElement('p');
                let p = document.querySelector('p');
                errors++;
                stickPhase.width = 256;
                stickBox.innerHTML = ""
                stickPhase.src = `stickman/${errors}.png`;
                stickPhase.style.opacity = '0';
                setTimeout(function() {
                    stickPhase.style.opacity = "1";
                }, 10);
                stickBox.appendChild(stickPhase)
    
                if(wrongGuesses.contains(p)){
                    p.innerText += `, ${letterGuess.value}`
                }else {
                    wrongGuesses.appendChild(wrongParagraph);
                    wrongParagraph.innerText += letterGuess.value
                }
            }
            if(errors === 7){
                stickPhase.style.left = '47.5%';
                msgDerrota();
                esconder();
                btnReset.style.display = 'inline-block';
            }
            else{
                palavra.textContent = wordToGuess.join('')
                checarPalavra(wordToGuess.join(''))
                letterGuess.value = ''
            }
        })
    }
});

campoPalavra.addEventListener('keypress', (event) => {
    keyName = event.key
    if(keyName === 'Enter'){
        if(checarPalavra(campoPalavra.value) === false && campoPalavra.value != ''){
            stickPhase.width = 256;
            stickPhase.src = `stickman/7.png`;
            stickBox.innerHTML = ""
            stickPhase.style.opacity = '0';
            setTimeout(function() {
                stickPhase.style.opacity = "1";
            }, 10);
            stickBox.appendChild(stickPhase)
            stickPhase.style.left = '47.5%';
            msgDerrota();
            esconder();
            btnReset.style.display = 'inline-block';
            letterGuess.value = ''
        }
    }
});
guessCampoBtn.addEventListener('click', (event) => {

    if(!checarPalavra(campoPalavra.value) && campoPalavra.value != ''){

        stickPhase.width = 256;
        stickPhase.src = `stickman/7.png`;
        stickBox.innerHTML = ""
        stickPhase.style.opacity = '0';
        setTimeout(function() {
            stickPhase.style.opacity = "1";
        }, 10);
        stickBox.appendChild(stickPhase)
        stickPhase.style.left = '47.5%';
        msgDerrota();
        esconder();
        btnReset.style.display = 'inline-block';
    }
    else{
        palavra.textContent = wordToGuess.join('')
        letterGuess.value = ''
    }
});

guessBtn.addEventListener('click', (event) => {
    if(letterGuess.value === '' || errors === 7) return
    let k = 0, counter = 0;
    geraPalavraAleatoria().then(()=>{
        for(let i = 0; i<randomWord.length; i++){
            if (letterGuess.value.toLowerCase() === randomWord[i]){
                wordToGuess[k] = randomWord[i];
                counter++;
            } else wordToGuess
            k += 2;
        }
        if(counter === 0 && letterGuess.value != '') {
    
            const wrongParagraph = document.createElement('p');
            let p = document.querySelector('p');
            errors++;
            stickPhase.width = 256;
            stickPhase.src = `stickman/${errors}.png`;
            stickBox.innerHTML = ""
            stickBox.appendChild(stickPhase)
    
            stickPhase.style.opacity = '0';
            setTimeout(function() {
                stickPhase.style.opacity = "1";
            }, 10);
    
            if(wrongGuesses.contains(p)){
                p.innerText += `, ${letterGuess.value}`
            }else {
                wrongGuesses.appendChild(wrongParagraph);
                wrongParagraph.innerText += letterGuess.value
            }
        }
        if(errors === 7){
            stickPhase.style.left = '47.5%';
            msgDerrota();
            esconder();
            btnReset.style.display = 'inline-block';
        }
        else{
            palavra.textContent = wordToGuess.join('')
            checarPalavra(wordToGuess.join(''))
            letterGuess.value = ''
        }
    })
});



