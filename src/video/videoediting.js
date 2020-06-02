import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import { isWidget, toWidget } from '@ckeditor/ckeditor5-widget/src/utils';

import VideoCommand from "./videocommand";

export default class VideoEditing extends Plugin {
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const t = editor.t;
		const conversion = editor.conversion;

		editor.model.schema.register("video", {
			isObject: true,
			allowWhere: "$block",
			allowAttributes: ["id", "controls", "width", "height"],
			isBlock: true,
		});
		editor.model.schema.register("source", {
			allowIn: "video",
			isInline: true,
			allowAttributes: ["src", "type"],
		});

		conversion.elementToElement({
			model: "video",
			view: {
				name: "source",
			},
		});

		conversion.for( 'upcast' ).elementToElement( {
            view: {
                name: 'video',
            },
            model: ( viewElement, modelWriter ) => {
                // Read the "data-id" attribute from the view and set it as the "id" in the model.
                return modelWriter.createElement( 'video', {
                    width: parseInt( 200 ),
                    height: parseInt( 200 )
                } );
            }
        } );

		conversion.for("dataDowncast").elementToElement({
			model: "video",
			view: (modelElement, viewWriter) =>
				this.createVideoViewElement(viewWriter),
		});


		conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'video',
            view: ( modelElement, viewWriter ) => {
                // In the editing view, the model <productPreview> corresponds to:
                //
                // <section class="product" data-id="...">
                //     <div class="product__react-wrapper">
                //         <ProductPreview /> (React component)
                //     </div>
                // </section>
                const width = modelElement.getAttribute( 'width' );

                // The outermost <section class="product" data-id="..."></section> element.
                const section = viewWriter.createContainerElement( 'video', {
                    'data-width': width
                } );

                // The inner <div class="product__react-wrapper"></div> element.
                // This element will host a React <ProductPreview /> component.
                const reactWrapper = viewWriter.createUIElement( 'div', {
                }, function( domDocument ) {
                    const domElement = this.toDomElement( domDocument );

                    // This the place where React renders the actual product preview hosted
                    // by a UIElement in the view. You are using a function (renderer) passed as
                    // editor.config.products#productRenderer.
                    renderProduct( id, domElement );

                    return domElement;
                } );

                viewWriter.insert( viewWriter.createPositionAt( section, 0 ), reactWrapper );

                return toWidget( section, viewWriter, { label: 'video widget' } );
            }
        } );

		editor.commands.add("video", new VideoCommand(editor));
	}


	createVideoViewElement(writer) {
		const sourceElement = writer.createElement("source", {
			src: "http://media.thebrick.local/sample-video-1589086414.mp4",
			type: "video/mp4",
		});
	
		const videoElement = writer.createElement("video", {
			controls: true,
			width: 400,
			height: 400,
		});
	
		videoElement._children._nodes.push(sourceElement);
	
		// editor.model.insertContent(videoElement, writer.model.document.selection);
	
		console.log('video element: ', videoElement);
	
		return videoElement;
	}

}
