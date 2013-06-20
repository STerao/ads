var MarkdownEditor = (function () {
    function MarkdownEditor($body, viewer, isLogin) {
        this.$editor = $("<textarea>type something</textarea>").attr("data-widearea", "enable").addClass("markdowneditor").css("position", "absolute").css("display", "none").appendTo($body);
        wideArea();
        this.enableButton();
    }
    MarkdownEditor.prototype.closeMarkdowonEditor = function () {
        console.log("bye");
    };
    MarkdownEditor.prototype.showMarkdownEditor = function () {
        console.log("hi");
        $(".widearea-controlPanel > :first").click(this.closeMarkdowonEditor);
    };
    MarkdownEditor.prototype.enableButton = function () {
        $(".widearea-wrapper").css("position", "relative").css("top", "40px").css("left", "60px").click(this.showMarkdownEditor);
    };
    return MarkdownEditor;
})();
