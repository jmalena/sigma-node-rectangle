// language=GLSL
const SHADER_SOURCE = /*glsl*/ `
attribute vec4 a_id;
attribute vec4 a_color;
attribute vec2 a_position;
attribute float a_width;
attribute float a_height;
attribute float a_angle;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_cameraAngle;
uniform float u_correctionRatio;

varying vec4 v_color;

const float bias = 255.0 / 254.0;
const float sqrt_8 = sqrt(8.0);

void main() {
  float width = a_width * u_correctionRatio / u_sizeRatio * sqrt_8;
  float height = a_height * u_correctionRatio / u_sizeRatio * sqrt_8;
  float angle = a_angle + u_cameraAngle;
  vec2 angleDirection = vec2(cos(angle), sin(angle));
  vec2 position = a_position + angleDirection * vec2(width, height);

  gl_Position = vec4(
    (u_matrix * vec3(position, 1)).x,
    (u_matrix * vec3(position, 1)).y,
    0,
    1
  );

  #ifdef PICKING_MODE
  v_color = a_id;
  #else
  v_color = a_color;
  #endif

  v_color.a *= bias;
}
`;

export default SHADER_SOURCE;
