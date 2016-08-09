WP_INPUT_SPACE = '=';
WP_INPUT_SPACE_REG = new RegExp('=','g');


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
        } else if ( contents[0].toLowerCase() == ":h" ) {
            showHelpInfo();
            valid = true;
        }
        else if ( contents[0].toLowerCase() == ":test" ) {
//            var wpInStorage = chrome.storage.local.get('abc', function(result){
//                if (result.wordPacks) {
//                    showInfoMedium(result.wordPacks);
//                } else {
//                    showInfoMedium("No such");
//                }
//            });
            showInfoShort("test");
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

function showHelpInfo() {
    helpInfo = "Shortly, this is an online word book. A light-weighted web app "+
      "with words organized in cards. If you believe putting similar words together " +
      "into one card can help momerize, this app could help you manage these cards.<br>"+
      "First of all, you need load a text file to the app by typing ':l'."+
      " In the text file representing word book, '-' is word seperator, and " +
      "'--' is card seperator. Initially, there is a sample word book. You can play with it.<br>" +
      "With one command line, you can do many things listed below. Try it now!"；
    helpInfo += "Find word. [any character]<br>";
    helpInfo += "Below are command starting with a colon.<br>";
    helpInfo += "Load word book. [:l]<br>";
    helpInfo += 'Insert word(s) to a card. [:i word+ number]<br>';
    helpInfo += 'Delete cards specified with card number. [:d number+]<br>';
    helpInfo += 'Add words to a newly created WP. [a word+]<br>';
    helpInfo += 'Save changes. [:s]<br>';
    helpInfo += 'Print all words for exporting. [:e]<br>';
    helpInfo += 'Display some cards randomly. [:r]<br>';
    helpInfo += 'Help. [:h]<br>';
    showInfoShort(helpInfo);
}

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
                var newWord = contents[i];
                if (newWord.indexOf(WP_INPUT_SPACE)>=0){
                    newWord = newWord.replace(WP_INPUT_SPACE_REG, " ");
                }

                wordPacks.get(wpNumber-1).add(newWord);

                // prompt
                showSuccessShort("Word " + newWord + " is reserved :)");

                // Add word to card on page
                addWordToCard(newWord, wpNumber-1);
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

/*Add words to a newly created WP. Contents includes ":a word+ "*/
function addWords(contents) {
    if ( contents.length >= 2 ) {
         var words = new Array();

        for (i = 1; i < contents.length ; i++) {
            var newWord = contents[i];
            if (newWord.indexOf(WP_INPUT_SPACE)>=0){
                newWord = newWord.replace(WP_INPUT_SPACE_REG, " ");
            }
            words.push(newWord);
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

/*Save changes. [:s]*/
function saveToStorage() {
    chrome.storage.local.set({'wordPacks': materializeWordPacks()});
    showSuccessShort("All changes are saved ;)");
}

/*Print all words. [:e]*/
function exportToPrint() {
    $("#p-allWords").text(materializeWordPacks());


}
