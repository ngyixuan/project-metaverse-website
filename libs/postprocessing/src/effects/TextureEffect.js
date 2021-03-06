import { Uniform } from "three";
import { BlendFunction } from "./blending/BlendFunction.js";
import { Effect } from "./Effect.js";

const fragment = "uniform sampler2D texture;\r\n\r\n#ifdef ASPECT_CORRECTION\r\n\r\n\tvarying vec2 vUv2;\r\n\r\n#endif\r\n\r\nvoid mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {\r\n\r\n\t#ifdef ASPECT_CORRECTION\r\n\r\n\t\toutputColor = texture2D(texture, vUv2);\r\n\r\n\t#else\r\n\r\n\t\toutputColor = texture2D(texture, uv);\r\n\r\n\t#endif\r\n\r\n}\r\n";
const vertex = "uniform float scale;\r\n\r\nvarying vec2 vUv2;\r\n\r\nvoid mainSupport() {\r\n\r\n\tvUv2 = uv * vec2(aspect, 1.0) * scale;\r\n\r\n}\r\n";

/**
 * A texture effect.
 */

export class TextureEffect extends Effect {

	/**
	 * Constructs a new texture effect.
	 *
	 * @param {Object} [options] - The options.
	 * @param {BlendFunction} [options.blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
	 * @param {Texture} [options.texture] - A texture.
	 * @param {Boolean} [options.aspectCorrection=false] - Whether the texture coordinates should be affected by the aspect ratio.
	 */

	constructor(options = {}) {

		const settings = Object.assign({
			blendFunction: BlendFunction.NORMAL,
			texture: null,
			aspectCorrection: false
		}, options);

		super("TextureEffect", fragment, {

			blendFunction: settings.blendFunction,

			uniforms: new Map([
				["texture", new Uniform(settings.texture)]
			])

		});

		this.aspectCorrection = settings.aspectCorrection;

	}

	/**
	 * Indicates whether aspect correction is enabled.
	 *
	 * If enabled, the texture can be scaled using the `scale` uniform.
	 *
	 * @type {Boolean}
	 */

	get aspectCorrection() {

		return this.defines.has("ASPECT_CORRECTION");

	}

	/**
	 * Enables or disables aspect correction.
	 *
	 * You'll need to call {@link EffectPass#recompile} after changing this value.
	 *
	 * @type {Boolean}
	 */

	set aspectCorrection(value) {

		if(value) {

			this.defines.set("ASPECT_CORRECTION", "1");
			this.uniforms.set("scale", new Uniform(1.0));
			this.vertexShader = vertex;

		} else {

			this.defines.delete("ASPECT_CORRECTION");
			this.uniforms.delete("scale");
			this.vertexShader = null;

		}

	}

}
