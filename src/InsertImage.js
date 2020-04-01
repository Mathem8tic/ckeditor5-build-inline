import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class InsertImage extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'insertImage', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'Insert image',
				icon: imageIcon,
				tooltip: true
			} );

			// Callback executed once the image is clicked.
			view.on( 'execute', () => {
				editor.execute( 'mediaGallery', { test: 'this is a test' } );
			} );
			return view;
		} );
	}
}
