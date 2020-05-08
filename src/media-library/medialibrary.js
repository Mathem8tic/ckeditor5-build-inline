import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import MediaLibraryCommand from '../media-library/medialibrarycommand';
import MediaLibraryUI from './medialibraryui';
import MediaLibraryEditing from './medialibraryediting';

export default class MediaLibrary extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ MediaLibraryCommand, MediaLibraryUI, MediaLibraryEditing ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'MediaLibrary';
	}
}
