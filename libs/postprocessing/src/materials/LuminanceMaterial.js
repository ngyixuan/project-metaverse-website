import { ShaderMaterial, Uniform, Vector2 } from "three";

const fragment = "#include <common>\r\n\r\nuniform sampler2D inputBuffer;\r\nuniform float distinction;\r\nuniform vec2 range;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvec4 texel = texture2D(inputBuffer, vUv);\r\n\tfloat l = linearToRelativeLuminance(texel.rgb);\r\n\r\n\t#ifdef RANGE\r\n\r\n\t\tfloat low = step(range.x, l);\r\n\t\tfloat high = step(l, range.y);\r\n\r\n\t\t// Apply the mask.\r\n\t\tl *= low * high;\r\n\r\n\t#endif\r\n\r\n\tl = pow(abs(l), distinction);\r\n\r\n\t#ifdef COLOR\r\n\r\n\t\tgl_FragColor = vec4(texel.rgb * l, texel.a);\r\n\r\n\t#else\r\n\r\n\t\tgl_FragColor = vec4(l, l, l, texel.a);\r\n\r\n\t#endif\r\n\r\n}\r\n";
const vertex = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

/**
 * A luminance shader material.
 *
 * This shader produces a greyscale luminance map that describes the absolute
 * amount of light emitted by a scene. It can also be configured to output
 * colours that are scaled with their respective luminance value. Additionally,
 * a range may be provided to mask out undesired texels.
 *
 * The alpha channel will remain unaffected in all cases.
 *
 * On luminance coefficients:
 *  http://www.poynton.com/notes/colour_and_gamma/ColorFAQ.html#RTFToC9
 *
 * Coefficients for different colour spaces:
 *  https://hsto.org/getpro/habr/post_images/2ab/69d/084/2ab69d084f9a597e032624bcd74d57a7.png
 *
 * Luminance range reference:
 *  https://cycling74.com/2007/05/23/your-first-shader/#.Vty9FfkrL4Z
 */

export class LuminanceMaterial extends ShaderMaterial {

	/**
	 * Constructs a new luminance material.
	 *
	 * @param {Boolean} [colorOutput=false] - Defines whether the shader should output colours scaled with their luminance value.
	 * @param {Vector2} [luminanceRange] - If provided, the shader will mask out texels that aren't in the specified luminance range.
	 */

	constructor(colorOutput = false, luminanceRange = null) {

		const maskLuminance = (luminanceRange !== null);

		super({

			type: "LuminanceMaterial",

			uniforms: {

				inputBuffer: new Uniform(null),
				distinction: new Uniform(1.0),
				range: new Uniform(maskLuminance ? luminanceRange : new Vector2())

			},

			fragmentShader: fragment,
			vertexShader: vertex

		});

		this.setColorOutputEnabled(colorOutput);
		this.setLuminanceRangeEnabled(maskLuminance);

	}

	/**
	 * Enables or disables color output.
	 *
	 * @param {Boolean} enabled - Whether color output should be enabled.
	 */

	setColorOutputEnabled(enabled) {

		if(enabled) {

			this.defines.COLOR = "1";

		} else {

			delete this.defines.COLOR;

		}

		this.needsUpdate = true;

	}

	/**
	 * Enables or disables the luminance mask.
	 *
	 * @param {Boolean} enabled - Whether the luminance mask should be enabled.
	 */

	setLuminanceRangeEnabled(enabled) {

		if(enabled) {

			this.defines.RANGE = "1";

		} else {

			delete this.defines.RANGE;

		}

		this.needsUpdate = true;

	}

}
