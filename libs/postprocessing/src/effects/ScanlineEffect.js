import { Uniform, Vector2 } from "three";
import { BlendFunction } from "./blending/BlendFunction.js";
import { Effect } from "./Effect.js";

const fragment = "uniform float count;\r\n\r\nvoid mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {\r\n\r\n\tvec2 sl = vec2(sin(uv.y * count), cos(uv.y * count));\r\n\tvec3 scanlines = vec3(sl.x, sl.y, sl.x);\r\n\r\n\toutputColor = vec4(scanlines, inputColor.a);\r\n\r\n}\r\n";

/**
 * A scanline effect.
 */

export class ScanlineEffect extends Effect {

	/**
	 * Constructs a new scanline effect.
	 *
	 * @param {Object} [options] - The options.
	 * @param {BlendFunction} [options.blendFunction=BlendFunction.OVERLAY] - The blend function of this effect.
	 * @param {Number} [options.density=1.25] - The scanline density.
	 */

	constructor(options = {}) {

		const settings = Object.assign({
			blendFunction: BlendFunction.OVERLAY,
			density: 1.25
		}, options);

		super("ScanlineEffect", fragment, {

			blendFunction: settings.blendFunction,

			uniforms: new Map([
				["count", new Uniform(0.0)]
			])

		});

		/**
		 * The original resolution.
		 *
		 * @type {Vector2}
		 * @private
		 */

		this.resolution = new Vector2();

		/**
		 * The amount of scanlines, relative to the screen height.
		 *
		 * @type {Number}
		 * @private
		 */

		this.density = settings.density;

	}

	/**
	 * Returns the current scanline density.
	 *
	 * @return {Number} The scanline density.
	 */

	getDensity() {

		return this.density;

	}

	/**
	 * Sets the scanline density.
	 *
	 * @param {Number} density - The new scanline density.
	 */

	setDensity(density) {

		this.density = density;
		this.setSize(this.resolution.x, this.resolution.y);

	}

	/**
	 * Updates the size of this pass.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 */

	setSize(width, height) {

		this.resolution.set(width, height);
		this.uniforms.get("count").value = Math.round(height * this.density);

	}

}
