///<reference path='../../DefinitelyTyped/jquery/jquery.d.ts'/>
///<reference path='./ads.ts'/>

declare function wideArea(): void;
declare function wideArea(string): void;

class MarkdownEditor {
	$editor: JQuery;

	constructor ($body: JQuery, viewer: DCaseViewer, isLogin: bool) {
		this.$editor = $("<textarea>type something</textarea>")
			.attr("data-widearea", "enable")
			.addClass("markdowneditor")
			.css("position", "absolute")
			//.css("top", "200px")
			//.css("left", "200px")
			.css("display", "none")
			.appendTo($body);
		wideArea();
		this.enableButton();
	}

	private closeMarkdowonEditor(): void {
		/* TODO Update D-Case */
		console.log("Editor close");
	}

	private showMarkdownEditor(): void {
		/* TODO Visualize markdown */
		console.log("Editor open");
		$(".widearea-controlPanel > :first")
			.click(this.closeMarkdowonEditor);
	}

	private enableButton(): void {
		/* TODO  Remove magic-parameter */
		/* FIXME Too ugly, need a cool design */
		$(".widearea-wrapper")
			.css("position", "relative")
			.css("top", "40px")
			.css("left", "60px")
			.click(this.showMarkdownEditor);
	}
}
