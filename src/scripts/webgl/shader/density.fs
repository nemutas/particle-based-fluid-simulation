#version 300 es
precision highp float;

uniform sampler2D posMap;
uniform float mass;
uniform float re;
uniform vec2 count;

in vec2 vUv;
out vec4 outColor;

#include './module/kernel.glsl'

void main() {
  vec2 px = 1.0 / count;
  vec2 uv = vUv;
  vec2 ri = texture(posMap, uv).xy;
  float sqRe = re * re;
  float density, nearDensity;

  for (float ix; ix < 1.0; ix += px.x) {
    for (float iy; iy < 1.0; iy += px.y) {
      vec2 neighbourUv = vec2(ix, iy) + px * 0.5;
      vec2 rj = texture(posMap, neighbourUv).xy;
      vec2 rij = rj - ri;
      float sqDist = dot(rij, rij);
      
      if (sqRe < sqDist) continue;

      float dist = sqrt(sqDist);
      density += mass * DensityKernel(dist, re);
      nearDensity += mass * NearDensityKernel(dist, re);
    }  
  }

  outColor.xy = vec2(density, nearDensity);
}