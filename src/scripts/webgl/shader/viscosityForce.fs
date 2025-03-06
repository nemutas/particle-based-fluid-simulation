#version 300 es
precision highp float;

uniform sampler2D posMap;
uniform sampler2D velMap;
uniform sampler2D densityMap;
uniform float dt;
uniform float mass;
uniform float re;
uniform vec2 count;
uniform float viscosityStrength;

in vec2 vUv;
out vec4 outColor;

#include './module/kernel.glsl'

void main() {
  vec2 px = 1.0 / count;
  vec2 uv = vUv;
  float sqRe = re * re;
  vec2 ri = texture(posMap, uv).xy;
  vec2 vi = texture(velMap, uv).xy;
  float density = texture(densityMap, uv).x;
  vec2 viscosityForce;

  for (float ix; ix < 1.0; ix += px.x) {
    for (float iy; iy < 1.0; iy += px.y) {
      vec2 neighbourUv = vec2(ix, iy) + px * 0.5;
      vec2 rj = texture(posMap, neighbourUv).xy;
      vec2 rij = rj - ri;
      float sqDist = dot(rij, rij);

      if (sqRe < sqDist) continue;

      float dist = sqrt(sqDist);
      vec2 vj = texture(velMap, neighbourUv).xy;
      float neighbourDensity = texture(densityMap, neighbourUv).x;
      viscosityForce += mass * ((vj - vi) / neighbourDensity) * ViscosityKernel(dist, re);
    }
  }

  vec2 acc = viscosityForce * viscosityStrength / density;
  outColor.xy = vi + acc * dt;
}