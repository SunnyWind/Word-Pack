

/*Add one card after some tiem as the parameter 'delay' specify*/
function addWordsCard($newWordsCard, delay) {
    var shortest = paneHeight($("#card-pane-0"));
    var shortestNum = 0;
    
    for ( var num = 1 ; num < 3 ; num++ ) {
        if ( paneHeight($("#card-pane-"+num)) < shortest ) {
            shortest = paneHeight($("#card-pane-"+num));
            shortestNum = num;
        }
    }
    
    $("#card-pane-" + shortestNum).append($newWordsCard);
    
    setTimeout(function(){
        $newWordsCard.slideToggle("slow");
    }, delay);
    
}

/*Add cards with animation. Cards will be added one by one with 250ms delay
  Input is a array of new words-card*/
function addWordsCards(cardArray) {
    var delay = 0;
    
    for ( i = 0 ; i < cardArray.length ; i++ ) {
        addWordsCard(cardArray[i], delay);
        delay += 250;
    }


}

function constructWordCard(theWP) {
    // turn WP to words card
    $newWordsCard = $('<div class="fluid words-card bg-info" style="display:none" id="div-wc-' +
                      theWP.number + '"></div>');

    var words = theWP.words;
    
    // Add number to card
    // Caution: show number = number + 1
    $number = $('<p class="text-muted">#'+ (theWP.number+1) +'</p>'); 
    $newWordsCard.append($number);
    
    // Add words to card
    for ( j = 0 ; j < words.length ; j++ ) {
        if ( theWP.chosenWords.indexOf("#"+j+"#") < 0 ) {
            $newWord = $('<p class="word">'+ words[j] +'</p>');
        } else {
            $newWord = $('<p class="text-danger word">'+ words[j] +'</p>');
        }
        
        $newWordsCard.append($newWord);
    }
    
    //Reset chosen words
    theWP.chosenWords = "#";
    
    return $newWordsCard;
}

/*Put the new Word card into the first position*/
function putFirstWC($newWordsCard) {
    $("#card-pane-0").prepend($newWordsCard);
    $newWordsCard.slideToggle("slow");
}

function addWordToCard(word, cardNum) {
    $newWord = $('<p class="text-success word" style="display:none">'+ word +'</p>');
    
    $("#div-wc-"+cardNum).append($newWord);
    $newWord.slideToggle("slow");
}

function removeCard(cardNum) {
    $("#div-wc-"+cardNum).fadeOut("fast");
    setTimeout(function(){
        $("#div-wc-"+cardNum).remove();
    }, 500);
}

function removeAllCards() {
    $(".words-card").fadeOut("fast");
    $(".words-card").addClass("words-card-old");
    setTimeout(function(){
        $(".words-card-old").remove();
    }, 500);
}

/*Get pane's height*/
function paneHeight($pane) {
    var height = 0;
    
    $pane.children().each(function(){
        height += $(this).height();
    });
    
    return height;
}