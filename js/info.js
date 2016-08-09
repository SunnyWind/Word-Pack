var INFOTYPE_INFO = 1;
var INFOTYPE_WARNING = 2;
var INFOTYPE_SUCCESS = 3;
var INFOTYPE_DANGER = 4;

var DURATION_SHORT = 10000;
var DURATION_MEDIUM = 30000;
var DURATION_LONG = 60000;


function showInfoShort(infoContent) {
    showInfo(INFOTYPE_INFO, DURATION_SHORT, infoContent);
}

function showInfoMedium(infoContent) {
    showInfo(INFOTYPE_INFO, DURATION_MEDIUM, infoContent);
}

function showInfoLong(infoContent) {
    showInfo(INFOTYPE_INFO, DURATION_LONG, infoContent);
}

function showSuccessShort(infoContent) {
    showInfo(INFOTYPE_SUCCESS, DURATION_SHORT, infoContent);
}

function showSuccessMedium(infoContent) {
    showInfo(INFOTYPE_SUCCESS, DURATION_MEDIUM, infoContent);
}

function showWarningShort(infoContent) {
    showInfo(INFOTYPE_WARNING, DURATION_SHORT, infoContent);
}

function showDangerShort(infoContent) {
    showInfo(INFOTYPE_DANGER, DURATION_SHORT, infoContent);
}


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
