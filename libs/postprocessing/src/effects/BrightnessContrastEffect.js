import { Uniform } from "three";
import { BlendFunction } from "./blending/BlendFunction.js";
import { Effect } from "./Effect.js";

const fragment = "uniform float brightness;\r\nuniform float contrast;\r\n\r\nvoid mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {\r\n\r\n\tvec3 color = inputColor.rgb + vec3(brightness - 0.5);\r\n\r\n\tif(contrast > 0.0) {\r\n\r\n\t\tcolor /= vec3(1.0 - contrast);\r\n\r\n\t} else {\r\n\r\n\t\tcolor *= vec3(1.0 + contrast);\r\n\r\n\t}\r\n\r\n\toutputColor = vec4(min(color + vec3(0.5), 1.0), inputColor.a);\r\n\r\n}\r\n";

/**
 * A brightness/contrast effect.
 *
 * Reference: https://github.com/evanw/glfx.js
 */

export class BrightnessContrastEffect extends Effect {

	/**
	 * Constructs a new brightness/contrast effect.
	 *
	 * @param {Object} [options] - The options.
	 * @param {BlendFunction} [options.blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
	 * @param {Number} [options.brightness=0.0] - The brightness factor, ranging from -1 to 1, where 0 means no change.
	 * @param {Number} [options.contrast=0.0] - The contrast factor, ranging from -1 to 1, where 0 means no change.
	 */

	constructor(options = {}) {

		const settings = Object.assign({
			blendFunction: BlendFunction.NORMAL,
			brightness: 0.0,
			contrast: 0.0
		}, options);

		super("BrightnessContrastEffect", fragment, {

			blendFunction: settings.blendFunction,

			uniforms: new Map([
				["brightness", new Uniform(settings.brightness)],
				["contrast", new Uniform(settings.contrast)]
			])

		});

	}

}
