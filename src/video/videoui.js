import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import quoteIcon from '@ckeditor/ckeditor5-core/theme/icons/quote.svg';

export default class VideoUI extends Plugin {
	init() {
		const editor = this.editor;
		const t = editor.t;

		editor.ui.componentFactory.add( 'video', locale => {
			const command = editor.commands.get( 'video' );
			const buttonView = new ButtonView( locale );

			buttonView.set( {
				label: t( 'Add Video' ),
				icon: quoteIcon,
				tooltip: true,
				isToggleable: true
			} );

			buttonView.bind( 'video' ).to( command, 'video' );

			this.listenTo( buttonView, 'execute', () => {
				editor.execute( 'video' );
				editor.editing.view.focus();
			} );

			return buttonView;
		} );
	}
}
