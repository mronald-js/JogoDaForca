// Elementos HTML
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
const contact = document.getElementById('contact')
const difficulties = document.getElementById('difficulty')
const easyDifficulty = document.querySelector('.easy')
const medDifficulty = document.querySelector('.medium')
const loading = document.getElementById('loadingPage')
const theme = document.getElementById('theme-color')

// Variáveis de jogo
let randomWord = '', wordToGuess, maxLetters, minLetters, errors = 0, difficulty, wordValid = 1;

// Manipulador de eventos para selecionar a dificuldade
difficulties.addEventListener('click', async (e) => {

    difficulty = e.target.className;

    // Verifique se a dificuldade é 'easy', 'medium' ou 'hard'
    if (difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard') {
        try {

            
            await geraPalavraDeAcordoComDificuldade();
            
            // Exibe as seções relevantes e oculta o carregamento e as dificuldades
            for (let i = 0; i < sections.length; i++)
            sections[i].style.display = 'block';
        
            theme.style.marginTop = '10px'
            loading.style.display = 'none'
            difficulties.style.display = 'none';
            contact.style.display = 'flex';
            contact.style.display = 'flex'
            document.getElementById('white-space').style.display = 'block'

            // Inicializa a palavra com espaços em branco
            for (let i = 0; i < randomWord.length; i++)
                palavra.textContent += '_ ';

            // Armazena a palavra a ser adivinhada em um array
            wordToGuess = palavra.firstChild.nodeValue.split("");
        } catch (error) {
            console.error('Erro:', error);
        }
    }
});

theme.addEventListener('click', (e) => {
    if( document.body.style.backgroundColor != 'black' ) {

        document.body.style.backgroundColor = 'black'
        difficulties.querySelector('h2').style.color = 'white'
        document.body.style.color = 'white'
        theme.style.filter = 'invert(100%)'
        document.getElementById('icons').style.filter = 'invert(100%)'
        document.getElementById('contact').querySelector('a').style.color = 'white'
        document.getElementById('Title').style.backgroundColor = 'rgba(255,255,255,0.8)'
        document.getElementById('Title').querySelector('h1').style.color = 'black'
        document.getElementById('gallow').querySelector('img').src = 'icons/gallowWhite.png'
        stickPhase.style.filter = 'invert(100%)'
        
    } else {
        document.getElementById('icons').style.filter = 'invert(0%)'
        theme.style.filter = 'invert(0%)'
        document.body.style.color = 'black'
        stickPhase.style.filter = 'invert(0%)'
        difficulties.querySelector('h2').style.color = 'black'
        document.getElementById('contact').querySelector('a').style.color = 'black'
        document.body.style.backgroundColor = 'white'
        document.getElementById('Title').querySelector('h1').style.color = 'white'
        document.getElementById('gallow').querySelector('img').src = 'icons/gallowDark.png'
        document.getElementById('Title').style.backgroundColor = 'rgba(0, 0, 0, 0.65)'
    }
})

// Função para verificar uma letra adivinhada
function checarPalavra(word) {
    geraPalavraDeAcordoComDificuldade().then(() => {
        let k = 0, counter = 0;
        for (let i = 0; i < randomWord.length; i++) {
            if (word[k] === randomWord[i]) counter++;
            k += 2;
        }

        if (counter === randomWord.length || word === randomWord) {
            setTimeout(() => {
                esconder()
                btnReset.style.display = 'inline-block'
                palavra.innerHTML = `<p>${randomWord}</p><p style="color:green">Parabéns, você venceu!</p>`
            }, 10)
        } else wordValid = 0
    })
}

// Funções de exibição e ocultação de campos de entrada
function esconder() {
    return campoLetra.style.display = 'none', campoTryWord.style.display = 'none'
}

function exibe() {
    return campoLetra.style.display = 'block', campoTryWord.style.display = 'block'
}

// Função assíncrona para gerar uma palavra de acordo com a dificuldade
async function geraPalavraDeAcordoComDificuldade() {
    if (randomWord)
        // Se a palavra já foi buscada antes, retorna a palavra armazenada
        return;
    try {
        loading.style.display = 'flex'
        difficulties.style.display = 'none';

        const response = await fetch('https://api.dicionario-aberto.net/random');

        if (!response.ok) throw new Error('Erro na solicitação da API');

        const data = await response.json();
        const candidateWord = data.word;

        switch (difficulty) {
            case 'easy':
                if (candidateWord.length < 3 || candidateWord.length > 5) {
                    return geraPalavraDeAcordoComDificuldade();
                }
                break;
            case 'medium':
                if (candidateWord.length < 6 || candidateWord.length > 8) {
                    return geraPalavraDeAcordoComDificuldade();
                }
                break;
            case 'hard':
                if (candidateWord.length < 9) {
                    return geraPalavraDeAcordoComDificuldade();
                }
                break;
            default:
                // Trate um caso em que difficulty não corresponda a 'easy', 'medium' ou 'hard' aqui, se necessário.
                break;
        }
        
        randomWord = candidateWord;

    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

// Função para exibir uma mensagem de derrota
function msgDerrota() {
    campoPalavra.value = ''
    wrongGuesses.style.display = 'none'
    setTimeout(() => {
        geraPalavraDeAcordoComDificuldade().then(() => {
            return palavra.innerHTML += `<p style="color:red; background-color:rgba(0,0,0,0.25); padding:20px; width:100%; margin-top:20px">Wasted</p><p>Palavra Correta: <span style="color:green">${randomWord}</span></p>`
        })
    }, 10)
}

// Função de reinicialização do jogo
function reset() {
    errors = 0;
    randomWord = '';
    campoPalavra.value = '';
    palavra.innerHTML = '';
    wrongGuesses.innerHTML = 'Adivinhações Erradas';
    letterGuess.value = ''
    stickBox.innerHTML = ''
    wrongGuesses.style.display = 'flex'
    for (let i = 0; i < sections.length; i++) {
        sections[i].style.display = 'none';
    }
    difficulties.style.display = 'flex'
    contact.style.display = 'none'
    exibe()
    btnReset.style.display = 'none';
}

// Manipulador de eventos para adivinhar uma letra
letterGuess.addEventListener('keypress', (event) => {
    const keyName = event.key;

    if (keyName === 'Enter' && errors < 7) {
        checarPalavra(wordToGuess.join(''))
        let k = 0, counter = 0;
        geraPalavraDeAcordoComDificuldade().then(() => {
            for (let i = 0; i < randomWord.length; i++) {
                if (letterGuess.value.toLowerCase() === randomWord[i]) {
                    wordToGuess[k] = randomWord[i];
                    counter++;
                } else wordToGuess
                k += 2;
            }

            if (counter === 0 && letterGuess.value != '') {
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

                if (wrongGuesses.contains(p)) {
                    p.innerText += `, ${letterGuess.value}`
                } else {
                    wrongGuesses.appendChild(wrongParagraph);
                    wrongParagraph.innerText += letterGuess.value
                }
            }

            if (errors === 7) {
                stickPhase.style.left = '46.5%';
                msgDerrota();
                esconder();
                btnReset.style.display = 'inline-block';
            } else {
                palavra.textContent = wordToGuess.join('')
                letterGuess.value = ''
            }
        })
    }
});

// Manipulador de eventos para adivinhar uma palavra
campoPalavra.addEventListener('keypress', (event) => {

    keyName = event.key

    if (keyName === 'Enter') {
        checarPalavra(campoPalavra.value);
        if (wordValid === 0 && campoPalavra.value != '') {
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

// Manipulador de eventos para adivinhar uma palavra
guessCampoBtn.addEventListener('click', (event) => {
    checarPalavra(campoPalavra.value);
    if (wordValid === 0 && campoPalavra.value != '') {
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
    } else {
        palavra.textContent = wordToGuess.join('')
        letterGuess.value = ''
    }
});

// Manipulador de eventos para adivinhar uma letra
guessBtn.addEventListener('click', (event) => {
    if (letterGuess.value === '' || errors === 7) return
    let k = 0, counter = 0;

    geraPalavraDeAcordoComDificuldade().then(() => {
        for (let i = 0; i < randomWord.length; i++) {
            if (letterGuess.value.toLowerCase() === randomWord[i]) {
                wordToGuess[k] = randomWord[i];
                counter++;
            } else wordToGuess
            k += 2;
        }
        if (counter === 0 && letterGuess.value != '') {
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

            if (wrongGuesses.contains(p)) {
                p.innerText += `, ${letterGuess.value}`
            } else {
                wrongGuesses.appendChild(wrongParagraph);
                wrongParagraph.innerText += letterGuess.value
            }
        }
        if (errors === 7) {
            stickPhase.style.left = '47.5%';
            msgDerrota();
            esconder();
            btnReset.style.display = 'inline-block';
        } else {
            palavra.textContent = wordToGuess.join('')
            checarPalavra(wordToGuess.join(''))
            letterGuess.value = ''
        }
    })
});
