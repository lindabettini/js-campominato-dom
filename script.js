/* L'utente indica un livello di difficoltà in base al quale viene generata una griglia di gioco quadrata, in cui ogni cella contiene un numero tra quelli compresi in un range:
con difficoltà 1 => tra 1 e 100
con difficoltà 2 => tra 1 e 81
con difficoltà 3 => tra 1 e 49
Il computer deve generare 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe.
I numeri nella lista delle bombe non possono essere duplicati.
In seguito l'utente clicca su una cella: se il numero è presente nella lista dei numeri generati - abbiamo calpestato una bomba - la cella si colora di rosso e la partita termina, altrimenti la cella cliccata si colora di azzurro e l'utente può continuare a cliccare sulle altre celle.
La partita termina quando il giocatore clicca su una bomba o raggiunge il numero massimo possibile di numeri consentiti.
Al termine della partita il software deve comunicare il punteggio, cioè il numero di volte che l’utente ha cliccato su una cella che non era una b.
BONUS:
1- quando si clicca su una bomba e finisce la partita, il software scopre tutte le bombe nascoste
2- quando si clicca su una bomba e finisce la partita, evitare che si possa cliccare su altre celle */

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const play = () => {
    // ° Cambio testo bottone
    playButton.innerText = 'Ricomincia';

    // ° Elimino eventuale griglia precedente 
    const grid = document.getElementById('grid');
    grid.innerHTML= '';

    // // FASE PREPARATORIA 
    let attempts = 0;
    const TOTAL_BOMBS = 16; 

    const level = document.getElementById('select-level').value;
    
    let totalCells; 
    let cellsPerRow;

    switch (level) {
        case 'beginner':
            totalCells = 100;
            break;
        case 'expert':
            totalCells = 49;
            break;
        default: 
        totalCells = 81;
    };
    cellsPerRow = Math.sqrt(totalCells);

    const maxAttempts = totalCells - TOTAL_BOMBS;

    // // FUNZIONI 

    //° Genera un tot di numeri unici casuali per le bombe
    const generateBombs = (totalBombs, totalNumbers) => {
        const bombs = [];
        while (bombs.length < totalBombs) {
            const randNumber = getRandomNumber(1, totalNumbers);
            if (!bombs.includes(randNumber)) bombs.push(randNumber);
        }
        return bombs;
    }

    // ° Genero una cella
    const generateCell = (number, cellsPerRow) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.innerText = number; 
        const sideLength = `calc(100% / ${cellsPerRow})`;
        cell.style.width  = sideLength;
        cell.style.height = sideLength;
        return cell;
    }

    // ° Logica di fine partita 
    const gameOver = (bombs, points, hasLost) => {
        // ^ Creeo elemento per messaggio 
        const messageElement = document.createElement('h3'); 
        messageElement.className = 'message';

        // ^ Decido il testo 
        const messageText = hasLost ? `Peccato, hai perso! Punteggio ${points}` : 'Hai vinto! Gioca ancora...';
        messageElement.innerText = messageText; 
        messageElement.classList.add('text-white');

        // ^ Mostro l'elemento
        grid.appendChild(messageElement); 

        // ^ Coloro le bombe
        showBombs(bombs); 
    }

    // ° Rimuovo tutti gli event listener da una cella 
    const disableCell = cell => {
        const clone = cell.cloneNode();
        clone.innerText = cell.innerText; 
        clone.classList.add('disabled'); 
        cell.parentNode.replaceChild(clone, cell); 
        return clone;
    }

    // ° Gestico il click
    const onCellClick = (clickedCell, bombs, number) => {
        // ^ Impedisce fututi altri click su questa cella 
        const disabledCell = disableCell(clickedCell);

        // ^ Controllo se è una bomba 
        if (bombs.includes(number)) {
        // ^ Game over di Sconfitta
            gameOver (bombs, attempts, true);
        }  else {
            disabledCell.classList.add('safe'); 
            attempts++; 
        // ^ Game over di Vittoria
        if (attempts === maxAttempts) {
            gameOver(bombs, attempts, false)
            }
        }
    }

    // ° Mostra le bombe e blocca click
    const showBombs = (bombs) => {
        const cells = document.querySelectorAll('.cell'); 
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            const disabledCell = disableCell(cell);
            const cellNumber = parseInt(disabledCell.innerText); 
            
            if (bombs.includes(cellNumber)) disabledCell.classList.add('bomb');
        }
    }

    // ° Genero la griglia
    const generateGrid = (cellsNumber, cellsPerRow, bombs) => {
        for (let i = 1; i <= cellsNumber; i++) {
            const cell = generateCell(i, cellsPerRow);

            cell.addEventListener('click', (e) => onCellClick(e.target, bombs, i));

            grid.appendChild(cell);
        }
    }

// // -------------------------------------
// //     ESECUZIONE VERA E PROPRIA 
// // -------------------------------------

const bombs = generateBombs(TOTAL_BOMBS, totalCells);

generateGrid(totalCells, cellsPerRow, bombs);

}



// ° FASE INIZIALE 

const playButton = document.getElementById('play');
playButton.addEventListener('click', play);