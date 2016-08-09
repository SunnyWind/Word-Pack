





// Global variables
var wordPacks = new WordPacks();
var wordMap = new WordMap();
var curIndex = -1;

// Construct wordpack from local storage
if (localStorage.wordPacks) {

    // Info
    showInfo(INFOTYPE_INFO, DURATION_SHORT, "Constructing word packs...");

    // Construct word packs
    constructPacks(localStorage.wordPacks);

    // Info
    showInfo(INFOTYPE_SUCCESS, DURATION_SHORT, "Now you can start :)");


    showSomeWPs();
} else {
    showInfoMedium("Start from typing ':h'...");

    // Construct sample word packs
    var sampleCon = "portray-portrait-contour-delineate-sketch-depict--sketch-"+
    "skeleton--luxury-luxurious--explicit-implicit--fertile-fertilize-fertilizer"+
    "--compass-surpass-transcend-surmount-exceed--elude-allude-hint-imply--cower-"+
    "coward-crow-crowd-crowded--edible-edify--estimate-evaluate-eliminate--animated"+
    "-vivid--adhere-cohere-adherent-coherent-inherent--scold-rebuke-decry-censur"+
    "e-reproach--prompt-impromptu--";
    constructPacks(sampleCon);
    localStorage.wordPacks = this.result;
}

function readFile()
{
    // Hide the browse button
    $("#div-loadFile").modal("hide");
//    $("#div-info").slideToggle("fast");

    // Info
    showInfo(INFOTYPE_INFO, DURATION_SHORT, "Loading file...");

    var reader = new FileReader();
    var files = $("#input-file").prop("files");
    var bookFile = files[0];
    reader.readAsText(bookFile);
    reader.onload=function(f){
        // Info
        showInfo(INFOTYPE_INFO, DURATION_SHORT, "Constructing word packs...");

        // Construct word packs
        constructPacks(this.result);

        // Info
        showInfo(INFOTYPE_SUCCESS, DURATION_SHORT, "Now you can start :)");

        showSomeWPs();

        // Write the content to the local storage
        localStorage.wordPacks = this.result;
    }
}

/*Generate 5 cards randomly*/
function showSomeWPs() {
    // Store all new cards
    var cardArray = new Array();

    for( i = 0; i < 5 ; i++ ) {
        var indexR = parseInt(wordPacks.size * Math.random());
        // turn WP to words card
        $newWordsCard = constructWordCard(wordPacks.get(indexR));

        cardArray.push($newWordsCard);
    }

    addWordsCards(cardArray);
}

function constructPacks(rawData) {
    var lines = rawData.split(WP_DELIMITOR); // tolerate both Windows and Unix linebreaks

    var words = new Array();
    var j = 0;
    for(var i = 0; i < lines.length; i++) {
        if (lines[i] == ""){
            var wordPack = new WordPack(words);
            wordPacks.add(wordPack);
            words = new Array();
            j = 0;
        } else {
            wordMap.put(lines[i], wordPacks.size);
            words[j++] = lines[i];
        }
    }
}




//$(document).click(function(e){
//    obj = $(e.srcElement || e.target);
//    if (!$(obj).is("#div-loadFile") ) {
//        $("#div-loadFile").slideUp();
//    }
//});

$("#input-file").change(function(){
    readFile();
});

$("#btn-browse-file").click(function(){
    $("#input-file").click();
    setTimeout(function(){$('#div-loadFile').show();},1000);

});

// Bind dictionary
$("body").on("click", ".word", function(){
    var url = "http://dict.youdao.com/search?q="+$(this).text()+"&keyfrom=dict.index";

    $.get(url, function(data){
        $resultPage = $(data);

        showInfoMedium($resultPage.find(".trans-container").text());
    });

});



$('div.card-pane').on("click", ".word", function() {
    var wordToTranslate = $(this).text();
    var youdaoUrl = "http://fanyi.youdao.com/openapi.do?keyfrom=WordPack&key=92892259&type=data&doctype=jsonp&version=1.1&q="+wordToTranslate+"&callback=translate";
    $.ajax({
        url: youdaoUrl,
        type: "GET",
        dataType: 'JSONP',
        jsonp: 'translate'
    });
    // $.get(youdaoUrl,function(data,status){
    //     showInfo("Data: " + data + "\nStatus: " + status);
    // });
});

function translate(result) {
    if ( result.errorCode != 0 ){
        showDangerShort("Fail to translate the word :(");
        return;
    }

    var content = "英/" + result.basic['uk-phonetic'] + "/&nbsp;&nbsp;&nbsp;&nbsp;美/" + result.basic['uk-phonetic'] + "/</br>";
    var explains = result.basic.explains;
    for ( x in explains ) {
        content += (explains[x]+"</br>");
    }
    showSuccessMedium(content);
}
