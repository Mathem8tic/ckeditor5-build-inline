import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import WidgetResize from "@ckeditor/ckeditor5-widget/src/widgetresize";
import VideoResizeCommand from "./videoresizecommand";

import './videoresize.css';

export default class VideoResize extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [WidgetResize];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return "VideoResize";
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const command = new VideoResizeCommand(editor);

		this._registerSchema();
		this._registerConverters();

		editor.commands.add("videoResize", command);

		editor.editing.downcastDispatcher.on(
			"insert:video",
			(evt, data, conversionApi) => {
				const widget = conversionApi.mapper.toViewElement(data.item);

				const resizer = editor.plugins.get(WidgetResize).attachTo({
					unit: editor.config.get("video.resizeUnit") || "%",

					modelElement: data.item,
					viewElement: widget,
					editor,

					getHandleHost(domWidgetElement) {
						return domWidgetElement.querySelector("source");
					},
					getResizeHost(domWidgetElement) {
						return domWidgetElement;
					},
					// TODO consider other positions.
					isCentered() {
						const videoStyle = data.item.getAttribute("videoStyle");

						return (
							!videoStyle ||
							videoStyle == "full" ||
							videoStyle == "alignCenter"
						);
					},

					onCommit(newValue) {
						editor.execute("videoResize", { width: newValue });
					},
				});

				resizer.on("updateSize", () => {
					if (!widget.hasClass("video_resized")) {
						editor.editing.view.change((writer) => {
							writer.addClass("video_resized", widget);
						});
					}
				});

				resizer.bind("isEnabled").to(command);
			},
			{ priority: "low" }
		);
	}

	/**
	 * @private
	 */
	_registerSchema() {
		this.editor.model.schema.extend("video", {
			allowAttributes: "width",
		});
	}

	_registerConverters() {
		const editor = this.editor;

		// Dedicated converter to propagate video's attribute to the img tag.
		editor.conversion.for("downcast").add((dispatcher) =>
			dispatcher.on(
				"attribute:width:video",
				(evt, data, conversionApi) => {
					if (
						!conversionApi.consumable.consume(data.item, evt.name)
					) {
						return;
					}

					const viewWriter = conversionApi.writer;
					const video = conversionApi.mapper.toViewElement(data.item);

					if (data.attributeNewValue !== null) {
						viewWriter.setStyle(
							"width",
							data.attributeNewValue,
							video
						);
						viewWriter.addClass("video_resized", video);
					} else {
						viewWriter.removeStyle("width", video);
						viewWriter.removeClass("video_resized", video);
					}
				}
			)
		);

		editor.conversion.for("upcast").attributeToAttribute({
			view: {
				name: "video",
				styles: {
					width: /.+/,
				},
			},
			model: {
				key: "width",
				value: (viewElement) => viewElement.getStyle("width"),
			},
		});
	}
}
