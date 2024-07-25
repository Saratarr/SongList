$(document).ready(function () {
    $('body').bind('copy cut drag', function (e) {
        var isEdit = false;
        if (containsCodeBlock(e) || $(e.target).is(".code-block-nc-dvu") || $(e.target).parents(".code-block-nc-dvu").length > 0) {
            alert("The copy command has been disabled for this page.");
            e.preventDefault();
        }
    });

    function containsCodeBlock(e) {
        var exists = false;
        var text = String(getSelectionText());
        console.log(getSelectionText())
        if (text) {
            console.log(text)
            text = text.replace(/\s/g, "");
            $("body").find(".code-block-nc-dvu").each(function (i, v) {
                var begin = $(this).text();
                var end = begin.replace(/\s/g, "").slice(-30);
                var begin = begin.replace(/\s/g, "").slice(0, 30);
                console.log(begin);
                console.log(end)
                if (text.indexOf(begin) >= 0 || text.indexOf(end) >= 0) {
                    exists = true;
                }
            })
        }
        return exists;
    }

    function getSelectionText() {
        var txt = '';
        if (window.getSelection) {
            txt = window.getSelection();
        } else if (document.getSelection) {
            txt = document.getSelection();
        } else if (document.selection) {
            txt = document.selection.createRange().text;
        } else
            return false;
        return txt;
    }
});