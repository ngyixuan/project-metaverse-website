import { BlendFunction } from "./blending/BlendFunction.js";
import { Effect } from "./Effect.js";

const fragment = "void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {\r\n\r\n\tfloat sum = inputColor.r + inputColor.g + inputColor.b;\r\n\r\n\toutputColor = vec4(vec3(sum / 3.0), inputColor.a);\r\n\r\n}\r\n";

/**
 * A color average effect.
 */

export class ColorAverageEffect extends Effect {

	/**
	 * Constructs a new color average effect.
	 *
	 * @param {BlendFunction} [blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
	 */

	constructor(blendFunction = BlendFunction.NORMAL) {

		super("ColorAverageEffect", fragment, { blendFunction });

	}

}
