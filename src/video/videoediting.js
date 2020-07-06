import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import { isWidget, toWidget } from "@ckeditor/ckeditor5-widget/src/utils";

import VideoCommand from "./videocommand";

export default class VideoEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return "VideoEditing";
	}

	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const t = editor.t;
		const conversion = editor.conversion;

		editor.model.schema.register("video", {
			isObject: true,
			allowWhere: "$block",
			allowAttributes: ["id", "controls", "width", "height", "src"],
			isBlock: true,
		});
		editor.model.schema.register("source", {
			allowIn: "video",
			isInline: true,
			allowAttributes: ["src", "type", "id"],
		});

		conversion.elementToElement({
			model: "source",
			view: {
				name: "source",
				attributes: {
					src: "",
					type: "video/mp4",
				},
			},
		});

		conversion
			.for("downcast")
			.add(modelToViewAttributeConverter("id"))
			.add(modelToViewAttributeConverter("width"))
			.add(modelToViewAttributeConverter("height"))
			.add(modelToViewAttributeConverter("src"));

		conversion.for("dataDowncast").elementToElement({
			model: "video",
			view: (modelElement, viewWriter) => {
				return createVideoViewElement(viewWriter, modelElement);
			},
		});

		conversion
			.for("upcast")
			.elementToElement({
				view: {
					name: "video",
					attributes: {
						id: true,
						width: true,
						height: true,
					},
				},
				model: (viewElement, modelWriter) => {
					return modelWriter.createElement("video", {
						src: viewElement.getAttribute("src"),
						width: viewElement.getAttribute("width"),
						height: viewElement.getAttribute("height"),
						id: viewElement.getAttribute("id"),
					});
				},
			})
			.attributeToAttribute({
				view: {
					name: "video",
					key: "id",
				},
				model: "id",
			})
			.attributeToAttribute({
				view: {
					name: "video",
					key: "height",
				},
				model: "height",
			})
			.attributeToAttribute({
				view: {
					name: "video",
					key: "width",
				},
				model: "width",
			})
			.attributeToAttribute({
				view: {
					name: "source",
					key: "src",
				},
				model: "src",
			})
			.add(viewVideoToModel());

		conversion.for("editingDowncast").elementToElement({
			model: "video",
			// view: (modelElement, viewWriter) => toVideoWidget( createVideoViewElement(viewWriter, modelElement))
			view: ( modelElement, viewWriter ) => toVideoWidget( createVideoViewElement( viewWriter, modelElement ), viewWriter, t( 'video widget' ) )
		});

		editor.commands.add("video", new VideoCommand(editor));
	}
}

// Mathem8tic
export function createVideoViewElement(writer, model) {


	// const figure = writer.createContainerElement( 'figure', { class: 'image' } );

	const source = writer.createEmptyElement("source", {
		src: model.getAttribute("src"),
		type: "video/mp4",
	});
	const video = writer.createContainerElement("video", {
		controls: true,
		id: model.getAttribute("id"),
		width: model.getAttribute("width"),
		height: model.getAttribute("height"),
	});

	writer.insert(writer.createPositionAt(video, 0), source);

	return video;
}

// export function toVideoWidget(viewElement, writer, label) {
// 	writer.setCustomProperty("video", true, viewElement);

// 	return toWidget(viewElement, writer);
// }

export function getViewVideoFromWidget(figureView) {
	return Array.from(figureView.getChildren()).find((viewChild) =>
		viewChild.is("video")
	);
}

export function toVideoWidget( viewElement, writer, label ) {
	// writer.setCustomProperty( 'video', true, viewElement );

	return toWidget( viewElement, writer );
}

export function modelToViewAttributeConverter(attributeKey) {
	return (dispatcher) => {
		dispatcher.on(`attribute:${attributeKey}:video`, converter);
	};

	function converter(evt, data, conversionApi) {
		if (!conversionApi.consumable.consume(data.item, evt.name)) {
			return;
		}

		const viewWriter = conversionApi.writer;
		const video = conversionApi.mapper.toViewElement(data.item);
		const source = getViewVideoFromWidget(video);

		if (data.attributeNewValue !== null) {
			viewWriter.setAttribute(
				data.attributeKey,
				data.attributeNewValue,
				video
			);
		} else {
			viewWriter.removeAttribute(data.attributeKey, video);
		}
	}
}

export function viewVideoToModel() {
	return (dispatcher) => {
		dispatcher.on("element:video", converter);
	};

	function converter(evt, data, conversionApi) {
		// Do not convert if this is not an "image figure".
		if (
			!conversionApi.consumable.test(data.viewItem, {
				name: true,
				classes: "video",
			})
		) {
			return;
		}

		// Find an image element inside the figure element.
		const viewVideo = getViewVideoFromWidget(data.viewItem);

		// Do not convert if image element is absent, is missing src attribute or was already converted.
		if (
			!viewVideo ||
			!viewVideo.hasAttribute("src") ||
			!conversionApi.consumable.test(viewVideo, { name: true })
		) {
			return;
		}

		// Convert view image to model image.
		const conversionResult = conversionApi.convertItem(
			viewVideo,
			data.modelCursor
		);

		// Get image element from conversion result.
		const modelVideo = first(conversionResult.modelRange.getItems());

		// When image wasn't successfully converted then finish conversion.
		if (!modelVideo) {
			return;
		}

		// Convert rest of the figure element's children as an image children.
		conversionApi.convertChildren(
			data.viewItem,
			conversionApi.writer.createPositionAt(modelVideo, 0)
		);

		// Set image range as conversion result.
		data.modelRange = conversionResult.modelRange;

		// Continue conversion where image conversion ends.
		data.modelCursor = conversionResult.modelCursor;
	}
}
