import { Attributes } from "graphology-types";
import { NodeProgram, ProgramInfo } from "sigma/rendering";
import { RenderParams } from "sigma/types";
import { floatColor } from "sigma/utils";
import FRAGMENT_SHADER_SOURCE from "./shader-frag";
import VERTEX_SHADER_SOURCE from "./shader-vert";
import { drawRectangleNodeHover, drawRectangleNodeLabel } from "./utils"
import type { NodeDisplayDataExt } from "./types";

const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext;

const UNIFORMS = ["u_sizeRatio", "u_correctionRatio", "u_cameraAngle", "u_matrix"] as const;

const PI = Math.PI;

export class NodeRectangleProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes
  > extends NodeProgram<(typeof UNIFORMS)[number], N, E, G> {
    // @ts-expect-error
    drawHover = drawRectangleNodeHover;
    // @ts-expect-error
    drawLabel = drawRectangleNodeLabel;

  getDefinition() {
    return {
      VERTICES: 6,
      VERTEX_SHADER_SOURCE: VERTEX_SHADER_SOURCE,
      FRAGMENT_SHADER_SOURCE: FRAGMENT_SHADER_SOURCE,
      METHOD: WebGLRenderingContext.TRIANGLES,
      UNIFORMS,
      ATTRIBUTES: [
	{ name: "a_position", size: 2, type: FLOAT },
	{ name: "a_width", size: 1, type: FLOAT },
	{ name: "a_height", size: 1, type: FLOAT },
	{ name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
	{ name: "a_id", size: 4, type: UNSIGNED_BYTE, normalized: true },
      ],
      CONSTANT_ATTRIBUTES: [{ name: "a_angle", size: 1, type: FLOAT }],
      CONSTANT_DATA: [[PI / 4], [(3 * PI) / 4], [-PI / 4], [(3 * PI) / 4], [-PI / 4], [(-3 * PI) / 4]],
    };
  }

    processVisibleItem(nodeIndex: number, startIndex: number, data: NodeDisplayDataExt) {
    const array = this.array;
    const color = floatColor(data.color);

    array[startIndex++] = data.x;
    array[startIndex++] = data.y;
    array[startIndex++] = data.size;
    array[startIndex++] = data.size / 4;
    array[startIndex++] = color;
    array[startIndex++] = nodeIndex;
  }

  setUniforms(params: RenderParams, { gl, uniformLocations }: ProgramInfo): void {
    const { u_sizeRatio, u_correctionRatio, u_cameraAngle, u_matrix } = uniformLocations;
    
    gl.uniform1f(u_sizeRatio, params.sizeRatio);
    gl.uniform1f(u_cameraAngle, params.cameraAngle);
    gl.uniform1f(u_correctionRatio, params.correctionRatio);
    gl.uniformMatrix3fv(u_matrix, false, params.matrix);
  }
}
