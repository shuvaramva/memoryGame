document.addEventListener('DOMContentLoaded', () => {

    const path = "../images/";
    //car options
    const cardElem = [
        {
            name: 'btc',
            img: path + 'BTC.jpg'
        },
        {
            name: 'eth',
            img: path + 'ETH.jpg'
        },
        {
            name: 'bnb',
            img: path + 'BNB.jpg'
        },
        {
            name: 'ada',
            img: path + 'ADA.jpg'
        },
        {
            name: 'dot',
            img: path + 'DOT.jpg'
        },
        {
            name: 'matic',
            img: path + 'MATIC.jpg'
        }
    ];
    var multiplier = 2;
    var cardArray = [];

    const grid = document.querySelector('.grid');
    const blockSizeOption = document.querySelector('#block-size');
    const score = document.querySelector('#score');
    const total = document.querySelector('#total');
    const alert = document.querySelector('.alert');
    const congrat = document.querySelector('.congrats');
    const result = document.querySelector('.result');
    const resetBtn = document.querySelector('#reset');
    const restartBtn = document.querySelector('#restartSameLevel');

    var cardsChosen = [];
    var cardsChosenId = [];
    var cardsWon = [];
    var wait = false;

    var blockSizeSelected = 12;
    var timer = 0;
    var timeTaken = 0;

    //result variables
    var missedCount = 0;

    function createCardPairs(){
        var pair = cardElem.concat(cardElem);
        cardArray = [];
        for(let i = 1; i < multiplier; i++){
            cardArray = cardArray.concat(pair);
        }
        cardArray.sort(() => 0.5 - Math.random());
        reset();
        createBoard();
    }
    createCardPairs();
    
    //create your board
    function createBoard(){
        for(let i = 0; i < cardArray.length; i++){
            var card = document.createElement('img');
            card.setAttribute('src', path + 'blank.jpg');
            card.setAttribute('data-id',i);
            card.addEventListener('click', flipCard);
            grid.appendChild(card);
        }
        total.textContent = cardArray.length/2;
    }


    //check for matches
    function checkForMatch(){
        var cards = document.querySelectorAll('img');
       
        const optionOneId = cardsChosenId[0];
        const optionTwoId = cardsChosenId[1];
       
        if( cardsChosen[0] === cardsChosen[1]){
            alert.textContent = 'You found a match';
            
            cards[optionOneId].setAttribute('src', path + 'white.jpg');
            cards[optionOneId].setAttribute('data-status', '1');
            cards[optionTwoId].setAttribute('src', path + 'white.jpg');
            cards[optionTwoId].setAttribute('data-status', '1');
            cardsWon.push(cardsChosen[0]);
            score.textContent = cardsWon.length; 
            if(cardsWon.length == cardArray.length/2){
                alert.textContent = 'Congratulation! You won!';
                congrats();
            }
        }else{
            cards[optionOneId].setAttribute('src', path + 'blank.jpg');
            cards[optionTwoId].setAttribute('src', path + 'blank.jpg');
            alert.textContent = 'Sorry, try again';
            missedCount++;
        }

        cardsChosen = [];
        cardsChosenId = [];
        wait = false;
    }

    //flip card
    function flipCard(){
        if(!wait){
            var cardId = this.getAttribute('data-id');
            var cardStatus = this.getAttribute('data-status');
        
            if( findPairCount(this) < multiplier && cardStatus != "1"){
                cardsChosen.push(cardArray[cardId].name);
                cardsChosenId.push(cardId);
                this.setAttribute('src',cardArray[cardId].img);
                
                if(cardsChosen.length === 2 ){
                    wait = true;
                    setTimeout(checkForMatch, 500);
                }
            }
        }
    }

    function findPairCount(obj){
        var cardId = obj.getAttribute('data-id');
        var pairCount = cardsWon.filter( elem => elem == cardArray[cardId].name);
        return pairCount.length;
    }

    function runTimer(){
        //timer
        if(timer){
            clearInterval(timer);
        }
        var startTime = new Date().getTime();
        timer = setInterval(_ => {
            var currentTime = new Date().getTime();
            timeTaken = currentTime - startTime;
        }, 1000);
        //console.log('Internal start worker/timer: ' + timeTaken);
    }

    function chooseBlockSize(){
        multiplier = this.value;
        createCardPairs();
        blockSizeSelected = blockSizeOption.options[blockSizeOption.selectedIndex].text;
        runTimer();
    }

    function restart(){
        multiplier = 2;
        createCardPairs();
    }

    function restartSameLevel(){
        multiplier = blockSizeOption.value;
        createCardPairs();
    }

    blockSizeOption.addEventListener('change', chooseBlockSize);
    resetBtn.addEventListener('click', restart);
    restartBtn.addEventListener('click', restartSameLevel);

    function congrats(){
        clearInterval(timer);
        var congratImg = document.createElement('img');
        congratImg.setAttribute('src', path + 'congrats.gif');
        congrat.appendChild(congratImg);
        result.innerHTML = getResult();
    }

    function reset(){
        grid.innerHTML = "";
        var gridWt = 102 * multiplier/(multiplier>4?1.5:1); 
        grid.style.width = gridWt + 'px';
        congrat.innerHTML = "";
        cardsWon = [];
        score.textContent = "0";
        missedCount = 0;
        result.innerHTML = "";
        alert.textContent = "";
        runTimer();
    }

    function getResult(){
        var grade = ['Magnificient', 'Great work!', 'Ok! You can do better!', 'Poor! Keep trying!'];
        var finalGrade = '';

        var exceptedPerc = cardArray.length / (2 * multiplier * multiplier);
        var missedPerc = Math.round((missedCount - exceptedPerc) / (cardArray.length / 2) * 100);
        
        var memoryPower = 100 - missedPerc;
        //console.log(memoryPower);
        
        if(memoryPower >= 80){
            finalGrade = grade[0];
        }
        else if(memoryPower >= 60){
            finalGrade = grade[1];
        }
        else if(memoryPower >= 40){
            finalGrade = grade[1];
        }
        else {
            finalGrade = grade[2];
        }

        let bestScore = localStorage.getItem(blockSizeSelected);
        let newBestScore = timeTaken;
      

        if( bestScore && bestScore < timeTaken){
            newBestScore = bestScore;
        } else{
            localStorage.setItem(blockSizeSelected,newBestScore);
        }

        var resultElem = `<p>You missed <b>${missedCount}</b> times.<br>
            Your memory power is <b>${finalGrade}</b>.<br>
            Best score for Block size <b>${blockSizeOption.options[blockSizeOption.selectedIndex].text}</b> is <b>${displayTimeInClockFormat(newBestScore)}</b></p>`;
        return resultElem;
    }


    function displayTimeInClockFormat(timeIsSec) {
        var displayS = Math.floor((timeIsSec / 1000)) % 60;
        var displayM = Math.floor((timeIsSec / 60000)) % 60;
        var displayH = Math.floor(timeIsSec / (3600 * 1000)) % 24;
    
        displayS = displayS > 9 ? displayS : '0' + displayS;
        displayM = displayM > 9 ? displayM : '0' + displayM;
        displayH = displayH > 9 ? displayH : '0' + displayH;
    
        var displayTime = displayH + ':' + displayM + ':' + displayS;
        return displayTime;
    }
});