/* eslint-disable no-undef */
import Command from "@ckeditor/ckeditor5-core/src/command";

export default class VideoCommand extends Command {
	execute(options = {}) {
		const model = this.editor.model;
		model.document.fire("video", { message: "video fired" });
	}
}
