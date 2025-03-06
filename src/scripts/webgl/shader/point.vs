#version 300 es

in vec3 position;
in vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D posMap;
uniform float size;

out vec2 vUv;
out float vAccentParticle;

void main() {
  vUv = uv;
  vAccentParticle = gl_VertexID == 0 ? 1.0 : 0.0;

  vec3 pos = texture(posMap, uv).xyz;

  gl_PointSize = size;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
}