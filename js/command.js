


$("#input-command").keydown(function(event){  
    
        if(event.keyCode == "13") 
            command();
});  

    
    
function command() {
    
    var command = $("#input-command").val().trim();
    if ( command == "")
        return;
    
    if (command.indexOf(":") == 0) {
        // Command mode: Manipulate WP
        var contents = command.split(/\s+/);
        var valid = false; // If it's a invalid command
        
        if ( contents[0].toLowerCase() == ":i" ) {
            // Add word
            valid = insertWords(contents);
        } else if ( contents[0].toLowerCase() == ":a" ) {
            // Add word card
            valid = addWords(contents);
        } else if ( contents[0].toLowerCase() == ":d" ) {
            // Delete word
            valid = deleteWPs(contents);
        } else if ( contents[0].toLowerCase() == ":l" ) {
            // Load word book
            $("#div-loadFile").modal("show");
            valid = true;
        } else if ( contents[0].toLowerCase() == ":e" ) {
            exportToPrint();
            $("#div-export").modal("show");
            valid = true;
        } else if ( contents[0].toLowerCase() == ":s" ) {
            saveToStorage();
            valid = true;
        } else if ( contents[0].toLowerCase() == ":r" ) {
            removeAllCards();
            showSomeWPs();
            valid = true;
        }
        
        if (!valid){
        showInfo(INFOTYPE_WARNING, DURATION_SHORT, "Invalid command :(");
        }
    }else {
        // Search mode: Search specific word
        findImplicitWord(command.replace(/\s+/g, ""));
    }
    
    
};


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
        
        removeAllCards();
        
        // Show on page
        addWordsCards(cardArray);
    }
}

/*Insert words to a WP. Contents includes ":i word+ number"*/
function insertWords(contents) {
    if ( contents.length >= 3 ) {
        var wpNumber = parseInt(contents[contents.length-1]);
        if ( !isNaN(wpNumber) && wpNumber > 0 && wpNumber <= wordPacks.size ) {
            if ( wordPacks.get(wpNumber-1).abandon ) {
                showDangerShort("#" + wpNumber + " word pack was deleted QAQ");
                return false;
            }
            
            for (i = 1; i < contents.length-1 ; i++) {
                
                wordPacks.get(wpNumber-1).add(contents[i]);

                // prompt
                showSuccessShort("Word " + contents[i] + " is reserved :)");

                // Add word to card on page
                addWordToCard(contents[i], wpNumber-1);
            }
            
            return true;
        } else {
            showDangerShort("Number " + wpNumber + " is invalid - O -");
            return false;
        }
    } else {
        return false;
    }
}

/*Delete WPs specified with numbers. Contents includes ":d number+"*/
function deleteWPs(contents) {
    if( contents.length > 1 ) {
        for (i = 1; i < contents.length ; i++) {
            var wpNumber = parseInt(contents[i]);
            if ( !isNaN(wpNumber) ) {
                
                if ( wpNumber > 0 && wpNumber <= wordPacks.size ) {
                    wordPacks.abandon(wpNumber-1);
                    showSuccessShort("#" + contents[i] + " word pack is deleted :)");
                    removeCard(wpNumber-1);
                    return true;
                } else {
                    showDangerShort("There is no #" + contents[i] + ", please check @ . @");
                    return false;
                }
                
            } else {
                showDangerShort("Don't fool me, " + contents[i] + " is not a number =  =!");
                return false;
            }
        }
    } else {
        return false;
    }
}

/*Insert words to a newly created WP. Contents includes ":a word+ "*/
function addWords(contents) {
    if ( contents.length >= 2 ) {
         var words = new Array();
        
        for (i = 1; i < contents.length ; i++) {
            words.push(contents[i]);
        }

        var wordPack = new WordPack(words);
        wordPacks.add(wordPack);
        
        $newWC = constructWordCard(wordPack);
        putFirstWC($newWC);
        
        // prompt
        showSuccessShort("New words are packed ^3^");
        
        return true;
        
    } else {
        return false;
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
        // Skip abandoned WP
        if(wps[i].abandon)
            continue;
        
        var words = wps[i].words;
        var bingo = false; //If contain the specific word
        
        for ( j in words ) {
            if ( regExp.test(words[j]) ) {
                bingo = true;
                wps[i].chosenWords += (j+"#");
            }
        }
        
        if (bingo) {
            result.push(wps[i]);
        }
    }
    
    return result;
}

function materializeWordPacks() {
    wordPacks.abandon(1);
    return wordPacks.printAllWords();
}

function saveToStorage() {
    localStorage.wordPacks = materializeWordPacks();
    showSuccessShort("All changes are saved ;)");
}

function exportToPrint() {
    $("#p-allWords").text(materializeWordPacks());
    
    
}