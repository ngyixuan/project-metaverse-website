import { ShaderMaterial, Uniform, Vector2 } from "three";

const fragment = "#include <common>\r\n#include <dithering_pars_fragment>\r\n\r\nuniform sampler2D inputBuffer;\r\n\r\nvarying vec2 vUv0;\r\nvarying vec2 vUv1;\r\nvarying vec2 vUv2;\r\nvarying vec2 vUv3;\r\n\r\nvoid main() {\r\n\r\n\t// Sample top left texel.\r\n\tvec4 sum = texture2D(inputBuffer, vUv0);\r\n\r\n\t// Sample top right texel.\r\n\tsum += texture2D(inputBuffer, vUv1);\r\n\r\n\t// Sample bottom right texel.\r\n\tsum += texture2D(inputBuffer, vUv2);\r\n\r\n\t// Sample bottom left texel.\r\n\tsum += texture2D(inputBuffer, vUv3);\r\n\r\n\t// Compute the average.\r\n\tgl_FragColor = sum * 0.25;\r\n\r\n\t#include <dithering_fragment>\r\n\r\n}\r\n";
const vertex = "uniform vec2 texelSize;\r\nuniform vec2 halfTexelSize;\r\nuniform float kernel;\r\n\r\n/* Packing multiple texture coordinates into one varying and using a swizzle to\r\nextract them in the fragment shader still causes a dependent texture read. */\r\nvarying vec2 vUv0;\r\nvarying vec2 vUv1;\r\nvarying vec2 vUv2;\r\nvarying vec2 vUv3;\r\n\r\nvoid main() {\r\n\r\n\tvec2 dUv = (texelSize * vec2(kernel)) + halfTexelSize;\r\n\r\n\tvUv0 = vec2(uv.x - dUv.x, uv.y + dUv.y);\r\n\tvUv1 = vec2(uv.x + dUv.x, uv.y + dUv.y);\r\n\tvUv2 = vec2(uv.x + dUv.x, uv.y - dUv.y);\r\n\tvUv3 = vec2(uv.x - dUv.x, uv.y - dUv.y);\r\n\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

/**
 * An optimised convolution shader material.
 *
 * This material supports dithering.
 *
 * Based on the GDC2003 Presentation by Masaki Kawase, Bunkasha Games:
 *  Frame Buffer Postprocessing Effects in DOUBLE-S.T.E.A.L (Wreckless)
 * and an article by Filip Strugar, Intel:
 *  An investigation of fast real-time GPU-based image blur algorithms
 *
 * Further modified according to Apple's
 * [Best Practices for Shaders](https://goo.gl/lmRoM5).
 */

export class ConvolutionMaterial extends ShaderMaterial {

	/**
	 * Constructs a new convolution material.
	 *
	 * @param {Vector2} [texelSize] - The absolute screen texel size.
	 */

	constructor(texelSize = new Vector2()) {

		super({

			type: "ConvolutionMaterial",

			uniforms: {

				inputBuffer: new Uniform(null),
				texelSize: new Uniform(new Vector2()),
				halfTexelSize: new Uniform(new Vector2()),
				kernel: new Uniform(0.0)

			},

			fragmentShader: fragment,
			vertexShader: vertex,

			depthWrite: false,
			depthTest: false

		});

		this.setTexelSize(texelSize.x, texelSize.y);

		/**
		 * The current kernel size.
		 *
		 * @type {KernelSize}
		 */

		this.kernelSize = KernelSize.LARGE;

	}

	/**
	 * Returns the kernel.
	 *
	 * @return {Float32Array} The kernel.
	 */

	getKernel() {

		return kernelPresets[this.kernelSize];

	}

	/**
	 * Sets the texel size.
	 *
	 * @param {Number} x - The texel width.
	 * @param {Number} y - The texel height.
	 */

	setTexelSize(x, y) {

		this.uniforms.texelSize.value.set(x, y);
		this.uniforms.halfTexelSize.value.set(x, y).multiplyScalar(0.5);

	}

}

/**
 * The Kawase blur kernel presets.
 *
 * @type {Float32Array[]}
 * @private
 */

const kernelPresets = [
	new Float32Array([0.0, 0.0]),
	new Float32Array([0.0, 1.0, 1.0]),
	new Float32Array([0.0, 1.0, 1.0, 2.0]),
	new Float32Array([0.0, 1.0, 2.0, 2.0, 3.0]),
	new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0, 4.0, 5.0]),
	new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 7.0, 8.0, 9.0, 10.0])
];

/**
 * A kernel size enumeration.
 *
 * @type {Object}
 * @property {Number} VERY_SMALL - A very small kernel that matches a 7x7 Gauss blur kernel.
 * @property {Number} SMALL - A small kernel that matches a 15x15 Gauss blur kernel.
 * @property {Number} MEDIUM - A medium sized kernel that matches a 23x23 Gauss blur kernel.
 * @property {Number} LARGE - A large kernel that matches a 35x35 Gauss blur kernel.
 * @property {Number} VERY_LARGE - A very large kernel that matches a 63x63 Gauss blur kernel.
 * @property {Number} HUGE - A huge kernel that matches a 127x127 Gauss blur kernel.
 */

export const KernelSize = {

	VERY_SMALL: 0,
	SMALL: 1,
	MEDIUM: 2,
	LARGE: 3,
	VERY_LARGE: 4,
	HUGE: 5

};
