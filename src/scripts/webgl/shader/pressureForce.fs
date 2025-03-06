#version 300 es
precision highp float;

uniform sampler2D posMap;
uniform sampler2D velMap;
uniform sampler2D densityMap;
uniform float dt;
uniform float mass;
uniform float re;
uniform vec2 count;
uniform float targetDensity;
uniform float pressureMultiplier;
uniform float nearPressureMultiplier;

in vec2 vUv;
out vec4 outColor;

#include './module/kernel.glsl'

float PressureFromDensity(float density) {
  return pressureMultiplier * (density - targetDensity);
}

float NearPressureFromDensity(float nearDensity) {
  return nearPressureMultiplier * nearDensity;
}

void main() {
  vec2 px = 1.0 / count;
  vec2 uv = vUv;
  float sqRe = re * re;
  vec2 ri = texture(posMap, uv).xy;
  vec2 densInfo = texture(densityMap, uv).xy;
  float density = densInfo[0];
  float nearDensity = densInfo[1];
	float pressure = PressureFromDensity(density);
	float nearPressure = NearPressureFromDensity(nearDensity);
  vec2 pressureForce;

  for (float ix; ix < 1.0; ix += px.x) {
    for (float iy; iy < 1.0; iy += px.y) {
      vec2 neighbourUv = vec2(ix, iy) + px * 0.5;
      vec2 rj = texture(posMap, neighbourUv).xy;
      vec2 rij = rj - ri;
      float sqDist = dot(rij, rij);

      if (sqRe < sqDist) continue;

      float dist = sqrt(sqDist);
      // vec2 dirToNeighbour = dist > 0.0 ? rij / dist : vec2(0, 0.005);
      vec2 dirToNeighbour = dist > 0.0 ? rij / dist : vec2(0);

      vec2 neighbourDensInfo = texture(densityMap, neighbourUv).xy;
      float neighbourDensity = neighbourDensInfo[0];
      float neighbourNearDensity = neighbourDensInfo[1];
			float neighbourPressure = PressureFromDensity(neighbourDensity);
			float neighbourNearPressure = NearPressureFromDensity(neighbourNearDensity);

      float sharedPressure = (pressure + neighbourPressure) * 0.5;
			float sharedNearPressure = (nearPressure + neighbourNearPressure) * 0.5;

      pressureForce += - dirToNeighbour * mass * (sharedPressure / neighbourDensity)         * DensityDerivative(dist, re);
			pressureForce += - dirToNeighbour * mass * (sharedNearPressure / neighbourNearDensity) * NearDensityDerivative(dist, re);
    }
  }

  vec2 acc = pressureForce / density;
  vec2 vel = texture(velMap, vUv).xy;
  outColor.xy = vel + acc * dt;
}