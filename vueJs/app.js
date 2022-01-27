const path = "../images/";

const blockSizeOption = document.querySelector('#block-size');
const alert = document.querySelector('.alert');
const congrat = document.querySelector('.congrats');
const result = document.querySelector('.result');
const resetBtn = document.querySelector('#reset');
const restartBtn = document.querySelector('#restartSameLevel');


let app = Vue.createApp({
    data: function() {
        return{
            blockSizeArr: [
                { value: "2", text: "12 (Default)"},
                { value: "3", text: "24"},
                { value: "4", text: "36"},
                { value: "5", text: "48"},
                { value: "6", text: "60"},
                { value: "11", text: "12"},
                { value: "22", text: "24"}
            ],
            cardElem: [
                { name: 'btc', img: path + 'BTC.jpg' },
                { name: 'eth', img: path + 'ETH.jpg' },
                { name: 'bnb', img: path + 'BNB.jpg' },
                { name: 'ada', img: path + 'ADA.jpg' },
                { name: 'dot', img: path + 'DOT.jpg' },
                { name: 'matic', img: path + 'MATIC.jpg' }
            ],
            multiplier: 2,
            cardArray: [],
            cardsChosen: [],
            cardsChosenId: [],
            cardsWon: [],
            wait: false,
            missedCount: 0,
            blockSizeSelected: 12,
            timer: 0,
            timeTaken: 0
        }
    },
    created(){
        this.createCardPairs()
    },
    computed:{
        blockSize(){
            return this.cardArray.length/2;
        },
        blankCard(){
            return path + 'blank.jpg';
        },
        setGridWidth(){
            return 102 * this.multiplier/(this.multiplier>4?1.5:1); 
        }
    },
    methods:{
        createCardPairs(){
            var pair = this.cardElem.concat(this.cardElem);
            this.cardArray = [];
            for(let i = 1; i < this.multiplier; i++){
                this.cardArray = this.cardArray.concat(pair);
            }
            this.cardArray.sort(() => 0.5 - Math.random());
            this.reset();
        },
        chooseBlockSize(e){
            this.multiplier = e.target.value;
            this.createCardPairs();
            console.log("Value: " + this.multiplier + "  == " + e.target.options[e.target.selectedIndex].text);
            
        },
        flipCard(e){
            if(!this.wait){
                var cardId = e.target.getAttribute('data-id');
                var cardStatus = e.target.getAttribute('data-status');
            
                if( this.findPairCount(e.target) < this.multiplier && cardStatus != "1"){
                    this.cardsChosen.push(this.cardArray[cardId].name);
                    this.cardsChosenId.push(cardId);
                    e.target.setAttribute('src',this.cardArray[cardId].img);
                    
                    if(this.cardsChosen.length === 2 ){
                        this.wait = true;
                        setTimeout(this.checkForMatch, 500);
                    }
                }
            }
        },
        checkForMatch(){
            var cards = document.querySelectorAll('img');
           
            const optionOneId = this.cardsChosenId[0];
            const optionTwoId = this.cardsChosenId[1];
           
            if( this.cardsChosen[0] === this.cardsChosen[1]){
                alert.textContent = 'You found a match';
                
                cards[optionOneId].setAttribute('src', path + 'white.jpg');
                cards[optionOneId].setAttribute('data-status', '1');
                cards[optionTwoId].setAttribute('src', path + 'white.jpg');
                cards[optionTwoId].setAttribute('data-status', '1');
                this.cardsWon.push(this.cardsChosen[0]);
                if(this.cardsWon.length == this.cardArray.length/2){
                    alert.textContent = 'Congratulation! You won!';
                    this.congrats();
                }
            }else{
                cards[optionOneId].setAttribute('src', path + 'blank.jpg');
                cards[optionTwoId].setAttribute('src', path + 'blank.jpg');
                alert.textContent = 'Sorry, try again';
                this.missedCount++;
            }
    
            this.cardsChosen = [];
            this.cardsChosenId = [];
            this.wait = false;
        },
        findPairCount(obj){
            var cardId = obj.getAttribute('data-id');
            var pairCount = this.cardsWon.filter( elem => elem == this.cardArray[cardId].name);
            return pairCount.length;
        },
        reset(){
            congrat.innerHTML = "";
            this.cardsWon = [];
            this.missedCount = 0;
            result.innerHTML = "";
            alert.textContent = "";
            this.runTimer();
        },
        runTimer(){
            //timer
            if(this.timer){
                clearInterval(this.timer);
            }
            var startTime = new Date().getTime();
            this.timer = setInterval(_ => {
                var currentTime = new Date().getTime();
                this.timeTaken = currentTime - startTime;
            }, 1000);
            //console.log('Internal start worker/timer: ' + timeTaken);
        }
    }
});

app.mount('#app');

