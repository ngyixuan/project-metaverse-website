import { Uniform } from "three";
import { BlendFunction } from "./blending/BlendFunction.js";
import { Effect } from "./Effect.js";

const fragment = "uniform float offset;\r\nuniform float darkness;\r\n\r\nvoid mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {\r\n\r\n\tconst vec2 center = vec2(0.5);\r\n\tvec3 color = inputColor.rgb;\r\n\r\n\t#ifdef ESKIL\r\n\r\n\t\tvec2 coord = (uv - center) * vec2(offset);\r\n\t\tcolor = mix(color, vec3(1.0 - darkness), dot(coord, coord));\r\n\r\n\t#else\r\n\r\n\t\tfloat d = distance(uv, center);\r\n\t\tcolor *= smoothstep(0.8, offset * 0.799, d * (darkness + offset));\r\n\r\n\t#endif\r\n\r\n\toutputColor = vec4(color, inputColor.a);\r\n\r\n}\r\n";

/**
 * A vignette effect.
 */

export class VignetteEffect extends Effect {

	/**
	 * Constructs a new vignette effect.
	 *
	 * @param {Object} [options] - The options.
	 * @param {BlendFunction} [options.blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
	 * @param {Boolean} [options.eskil=false] - Enables Eskil's vignette technique.
	 * @param {Number} [options.offset=0.5] - The vignette offset.
	 * @param {Number} [options.darkness=0.5] - The vignette darkness.
	 */

	constructor(options = {}) {

		const settings = Object.assign({
			blendFunction: BlendFunction.NORMAL,
			eskil: false,
			offset: 0.5,
			darkness: 0.5
		}, options);

		super("VignetteEffect", fragment, {

			blendFunction: settings.blendFunction,

			uniforms: new Map([
				["offset", new Uniform(settings.offset)],
				["darkness", new Uniform(settings.darkness)]
			])

		});

		this.eskil = settings.eskil;

	}

	/**
	 * Indicates whether Eskil's vignette technique is enabled.
	 *
	 * @type {Boolean}
	 */

	get eskil() {

		return this.defines.has("ESKIL");

	}

	/**
	 * Enables or disables Eskil's vignette technique.
	 *
	 * You'll need to call {@link EffectPass#recompile} after changing this value.
	 *
	 * @type {Boolean}
	 */

	set eskil(value) {

		value ? this.defines.set("ESKIL", "1") : this.defines.delete("ESKIL");

	}

}
