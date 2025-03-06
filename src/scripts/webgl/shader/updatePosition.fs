#version 300 es
precision highp float;

uniform sampler2D posMap;
uniform sampler2D velMap;
uniform float dt;

in vec2 vUv;
out vec4 outColor;

void main() {
  vec2 pos = texture(posMap, vUv).xy;
  vec2 vel = texture(velMap, vUv).xy;
  vec2 posNext = pos + vel * dt;

  outColor.xy = posNext;
}