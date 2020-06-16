import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import mediaIcon from '../photo-video-solid.svg';

export default class MediaLibraryUI extends Plugin {
	init() {
		const editor = this.editor;
		const t = editor.t;

		editor.ui.componentFactory.add( 'mediaLibrary', locale => {
			const command = editor.commands.get( 'mediaLibrary' );
			const buttonView = new ButtonView( locale );

			buttonView.set( {
				label: t( 'Media Library' ),
				icon: mediaIcon,
				tooltip: true,
				isToggleable: true
			} );

			buttonView.bind( 'mediaLibrary' ).to( command, 'mediaLibrary' );

			this.listenTo( buttonView, 'execute', () => {
				editor.execute( 'mediaLibrary' );
				editor.editing.view.focus();
			} );

			return buttonView;
		} );
	}
}
