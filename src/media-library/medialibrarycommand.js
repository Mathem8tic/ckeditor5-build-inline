/* eslint-disable no-undef */
import Command from '@ckeditor/ckeditor5-core/src/command';

export default class MediaLibraryCommand extends Command {
	execute( ) {
		const model = this.editor.model;
		// console.log( 'model: ', model );
		// const schema = model.schema;
		model.document.fire( 'mediaLibrary', { testeroo: 'testest fired' } );
	}
}
