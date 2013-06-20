var MarkdownEditor = (function () {
    function MarkdownEditor($body, viewer, isLogin) {
        this.$editor = $("<textarea>type something</textarea>").attr("data-widearea", "enable").addClass("markdowneditor").css("position", "absolute").css("top", "200px").css("left", "200px").css("display", "none").appendTo($body);
        wideArea();
    }
    return MarkdownEditor;
})();
