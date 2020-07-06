/* eslint-disable no-undef */
import Command from "@ckeditor/ckeditor5-core/src/command";

export default class VideoCommand extends Command {
	execute(options = {}) {
		const model = this.editor.model;
		// model.document.fire("video", { message: "video fired" });

		model.change((writer) => {
			insertVideo(writer, model, {
				src: "http://media.thebrick.local/sample-30s-1586229221.mp4",
			});
		});
	}
}

/**
 * Handles inserting single file. This method unifies image insertion using {@link module:widget/utils~findOptimalInsertionPosition} method.
 *
 *		model.change( writer => {
 *			insertImage( writer, model, { src: 'path/to/image.jpg' } );
 *		} );
 *
 * @param {module:engine/model/writer~Writer} writer
 * @param {module:engine/model/model~Model} model
 * @param {Object} [attributes={}] Attributes of inserted image
 */
export function insertVideo(writer, model, attributes = {}) {
	const videoElement = writer.createElement("video", attributes);

	const insertAtSelection = findOptimalInsertionPosition(
		model.document.selection,
		model
	);

	model.insertContent(videoElement, model.document.selection);

	// Inserting an image might've failed due to schema regulations.
	if (videoElement.parent) {
		writer.setSelection(videoElement, "on");
	}
}
