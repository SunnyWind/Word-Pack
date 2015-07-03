
var mPaneOrder = 0;


/*Add one card after some tiem as the parameter 'delay' specify*/
function addWordsCard($newWordsCard, delay) {
    $("#card-pane-" + mPaneOrder).append($newWordsCard);
    setTimeout(function(){
        $newWordsCard.slideToggle("slow");
        mPaneOrder = (mPaneOrder+1)%3;
    }, delay);
    
}

/*Add cards with animation. Cards will be added one by one with 250ms delay
  Input is a array of new words-card*/
function addWordsCards(cardArray) {
    mPaneOrder = 0;
    var delay = 0;
    for ( i = 0 ; i < cardArray.length ; i++ ) {
        addWordsCard(cardArray[i], delay);
        delay += 250;
    }
}

function constructWordCard(theWP) {
    // turn WP to words card
    $newWordsCard = $('<div class="fluid words-card bg-info" style="display:none"></div>');

    var words = theWP.words;
    for ( j = 0 ; j < words.length ; j++ ) {
        $newWord = $('<p>'+ words[j] +'</p>');
        $newWordsCard.append($newWord);
    }
    
    return $newWordsCard;
}

function removeAllCards() {
    $(".words-card").fadeOut("fast");
    $(".words-card").addClass("words-card-old");
    setTimeout(function(){
        $(".words-card-old").remove();
    }, 500);
}