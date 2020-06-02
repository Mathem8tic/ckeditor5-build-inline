import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import VideoCommand from "./videocommand";
import VideoUI from "./videoui";
import VideoEditing from "./videoediting";

export default class Video extends Plugin {

	static get requires() {
		return [VideoCommand, VideoUI, VideoEditing];
	}
	static get pluginName() {
		return "Video";
	}
}


	// CustomElement: {
	// 	items: [
	// 		{
	// 			tag: 'mat-video',
	// 			placeholder: 'Video',
	// 			attributes: {
	// 				src: 'http://media.thebrick.local/sample-video-1589086414.mp4'
	// 			},
	// 			icon: customIcon,
	// 			inline: true,
	// 			editable: true
	// 		}
	// 	]
	// },