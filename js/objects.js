WP_DELIMITOR = "-";

function WordPack(ws) {
    this.words = ws;
    this.number = -1; // Every WP has a sequence number
    this.chosenWords = "#"; //Number of chosen words
    this.abandon = false; // Whether the WP is abandoned
    
    this.add = add;
    function add(w) {
        this.words[this.words.length] = w;
    }
    
    this.printAllWords = printAllWords;
    function printAllWords() {
        var content = "";
        for ( x in this.words ) {
            content += (this.words[x] + WP_DELIMITOR);
        }
        return content;
    }
}

function WordPacks() {
    this.size = 0;
    this.wps = new Array();
    
    this.add = add;
    function add(wp) {
        wp.number = this.size;
        this.wps[this.size++] = wp;
    }
    
    this.get = get;
    function get(index) {
        return this.wps[index];
    }
    
    this.abandon = abandon;
    function abandon(index) {
        this.wps[index].abandon = true;
    }
    
    this.printAllWords = printAllWords;
    function printAllWords() {
        content = "";
        for(x in this.wps) {
            content += (this.wps[x].printAllWords() + WP_DELIMITOR);
        }
        return content;
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