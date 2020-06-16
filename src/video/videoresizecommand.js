import Command from '@ckeditor/ckeditor5-core/src/command';
// import { isVideo } from '../video/utils';

export default class VideoResizeCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const element = this.editor.model.document.selection.getSelectedElement();

		this.isEnabled = true;
		// this.isEnabled = isVideo( element );

		if ( !element || !element.hasAttribute( 'width' ) ) {
			this.value = null;
		} else {
			this.value = {
				width: element.getAttribute( 'width' ),
				height: null
			};
		}
	}

	execute( options ) {
		const model = this.editor.model;
		const videoElement = model.document.selection.getSelectedElement();

		model.change( writer => {
			writer.setAttribute( 'width', options.width, videoElement );
		} );
	}
}
