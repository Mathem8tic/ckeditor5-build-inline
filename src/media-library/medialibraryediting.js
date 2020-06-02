import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import MediaLibraryCommand from './medialibrarycommand';

export default class MediaLibraryEditing extends Plugin {
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;

		editor.commands.add( 'mediaLibrary', new MediaLibraryCommand( editor ) );

		schema.register( 'mediaLibrary', {
			allowWhere: '$block',
			allowContentOf: '$root'
		} );
	}
}
