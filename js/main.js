
var mPaneOrder = 0;


function WordPack(ws) {
    this.words = ws;
    
    this.add = add;
    function add(w) {
        this.words[this.words.length] = w;
    }
}

function WordPacks() {
    this.size = 0;
    this.wps = new Array();
    
    this.add = add;
    function add(wp) {
        this.wps[this.size++] = wp;
    }
    
    this.get = get;
    function get(index) {
        return this.wps[index];
    }
}

function WordMap() {
    this.map = {};
    
    this.put = put;
    function put(key, value) {
        this.map[key] = value;
    }
    
    this.get = get;
    function get(key) {
        if (key in this.map)
            return this.map[key];
        else
            return null;
    }
}

// Global variables
var wordPacks = new WordPacks();
var wordMap = new WordMap();
var curIndex = -1;

function readFile() 
{ 
    // Hide the browse button
    $("#btn-browse-file").slideToggle("slow");
    $("#div-info").slideToggle("fast");
    
    // Info
    showInfo(INFOTYPE_INFO, DURATION_SHORT, "Loading file...");
    
    var reader = new FileReader();  
    //将文件以文本形式读入页面  
    var files = $("#input-file").prop("files"); 
    reader.readAsText(files[0]);  
    reader.onload=function(f){
        // Info
        showInfo(INFOTYPE_INFO, DURATION_SHORT, "Constructing word packs...");
        
        // Construct word packs
        constructPacks(this.result);
        
        // Info
        showInfo(INFOTYPE_SUCCESS, DURATION_SHORT, "Now you can start :)");
        
        // Show command box
        $("#div-command").slideToggle("slow");
        
        showAllWPs();
    }  
}

function showAllWPs() {
    for( i = 0; i < 5 ; i++ ) {
        
        // turn WP to words card
        $newWordsCard = $('<div class="fluid words-card words-card-n bg-info"></div>');
        
        var words = wordPacks.get(i).words;
        for ( j = 0 ; j < words.length ; j++ ) {
            $newWord = $('<p>'+ words[j] +'</p>');
            $newWordsCard.append($newWord);
        }
        
        addWordsCard($newWordsCard);
    }
}

function constructPacks(rawData) {
    var lines = rawData.split(/\r?\n/g); // tolerate both Windows and Unix linebreaks

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

function searchWP() {
    var word = $("#input-search-main").val();
    var result=document.getElementById("result");  
    curIndex = wordMap.get(word);
    if ( curIndex == null )
        result.innerHTML="NONE";
    else
        result.innerHTML=wordPacks.get(curIndex).words;
}

function addWord() {
    var word = $("#input-add-word").val();
    wordPacks.get(curIndex).add(word);
    wordMap.put(word, curIndex);
}

function saveFile() {
    
}


function addWordsCard($newWordsCard) {
    $("#card-pane-" + mPaneOrder).append($newWordsCard);
    
    mPaneOrder = (mPaneOrder+1)%3;
}


$("#input-file").change(function(){
    readFile();
});

$("#btn-browse-file").click(function(){
    $("#input-file").click();
});





