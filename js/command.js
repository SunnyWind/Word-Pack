


$("#input-command").change(function(){
    removeAllCards();
    
    findImplicitWord($("#input-command").val());
});


/*search specific word on the packs, add packs with that word to panes*/
function findImplicitWord(word) {
    var result = findWordInWPs(word);
    
    if ( result.length == 0 )
        showInfo(INFOTYPE_WARNING, DURATION_SHORT, "No such word in word packs.")
    else {
        var cardArray = new Array();
        for ( i in result ) {
            cardArray.push(constructWordCard(result[i]));
        }
        
        // Show on page
        addWordsCards(cardArray);
    }
}


/*Find word implicitly in word packs, return array with matched word packs.
 If there is no matched word pack, return array whose length is 0.*/
function findWordInWPs(word) {
    var result = new Array();
    
    // Construct a regular expression
    var regStr = "\\w*";
    for ( i in word ) {
        regStr += ( word[i] + "\\w*" )
    }
    
    var regExp = new RegExp(regStr, "i")// i means ignoring capital
    
    var wps = wordPacks.wps;
    for ( i in wps ) {
        var words = wps[i].words;
        for ( j in words ) {
            if ( regExp.test(words[j]) ) {
                result.push(wps[i]);
                break;
            }
        }
    }
    
    return result;
}