var INFOTYPE_INFO = 1;
var INFOTYPE_WARNING = 2;
var INFOTYPE_SUCCESS = 3;
var INFOTYPE_DANGER = 4;

var DURATION_SHORT = 5000;
var DURATION_MEDIUM = 15000;
var DURATION_LONG = 30000;


function showInfo(infoType, duration, infoContent) {
    var $newInfoBox = $("<div class='alert text-center div-info' style='display:none'>"
                       + infoContent + "</div>");
    
    // Set the box type
    switch (infoType) {
        case INFOTYPE_INFO:
            $newInfoBox.addClass("alert-info");
            break;
        case INFOTYPE_WARNING:
            $newInfoBox.addClass("alert-warning");
            break;
        case INFOTYPE_SUCCESS:
            $newInfoBox.addClass("alert-success");
            break;
        case INFOTYPE_DANGER:
            $newInfoBox.addClass("alert-danger");
            break;
    }
    
    $("#div-info").append($newInfoBox);
    $newInfoBox.slideToggle("slow");
    
    // Set the duration (visual time)
    setTimeout(function(){
        hideInfoBox($newInfoBox);
    }, duration);
    
}

/*Hide the info box*/
function hideInfoBox($infoBox) {
    // Hide the infobox
    $infoBox.slideToggle("slow");
    
    // Remove the DOM after 1s
    setTimeout(function(){
        removeInfoBox($infoBox);
    }, 1000)
}

/*Remove the element*/
function removeInfoBox(infoBox) {
    $(infoBox).remove();
}