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


let randomWord = '', wordToGuess;
let errors = 0;


function checarPalavra(word) {
    geraPalavraAleatoria().then(()=>{
        if(word === randomWord){
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

async function geraPalavraAleatoria() {
    console.log(randomWord)
    if (randomWord) {
      // Se a palavra já foi buscada antes, retorna a palavra armazenada
      return randomWord;
    }
  
    try {
      const response = await fetch('https://api.dicionario-aberto.net/random');
      if (!response.ok) {
        throw new Error('Erro na solicitação da API');
      }
      const data = await response.json();
      randomWord = data.word;
      return randomWord;
    } catch (error) {
      console.error('Erro:', error);
      throw error;
    }
}  
function msgDerrota() {
    setTimeout(() => {
        geraPalavraAleatoria().then(() => {
            return palavra.innerHTML += `<p style="color:red; background-color:rgba(0,0,0,0.25); padding:20px; width:100%; margin-top:20px">Wasted</p><p style="color:black">Palavra Correta: <span style="color:green">${randomWord}</span></p>`
        })
    }, 10)
}

function reset() {
    errors = 0;
    randomWord = '';
    palavra.innerHTML = '';
    wrongGuesses.innerHTML = 'Adivinhações Erradas';
    stickBox.innerHTML = '';
    geraPalavraAleatoria().then(() => {
        for (let letter of randomWord) {
            palavra.textContent += '_ '
        }
    })
    exibe()
    btnReset.style.display = 'none';
}

geraPalavraAleatoria().then(() => {
    for (let i = 0; i < randomWord.length; i++) {
        palavra.textContent += '_ '
    }
    wordToGuess = palavra.firstChild.nodeValue.split("");
  });


letterGuess.addEventListener('keypress', (event) => {
    const keyName = event.key;
    if(keyName === 'Enter' && errors < 7){
        let k = 0, counter = 0;
        geraPalavraAleatoria().then(()=>{
            console.log(randomWord, letterGuess.value)
            for(let i = 0; i<randomWord.length; i++){
                if (letterGuess.value === randomWord[i]){
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
    }
});

guessBtn.addEventListener('click', (event) => {
    if(letterGuess.value === '' || errors === 7) return
    let k = 0, counter = 0;
    geraPalavraAleatoria().then(()=>{
        for(let i = 0; i<randomWord.length; i++){
            if (letterGuess.value === randomWord[i]){
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
        }
    })
});



