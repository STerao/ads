///<reference path='../../DefinitelyTyped/jquery/jquery.d.ts'/>
///<reference path='./ads.ts'/>

class MarkdownEditor {
	$editor: JQuery;

	constructor ($body: JQuery, viewer: DCaseViewer, isLogin: bool) {
		this.$editor = $("<textarea>type something</textarea>")
			.attr("data-widearea", "enable")
			.addClass("markdowneditor")
			.css("position", "absolute")
			.css("top", "200px")
			.css("left", "200px")
			.css("display", "none")
			.appendTo($body);
		wideArea();
	}
}
