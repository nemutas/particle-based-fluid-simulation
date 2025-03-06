#version 300 es
precision highp float;

uniform sampler2D velMap;
uniform sampler2D densityMap;

in vec2 vUv;
in float vAccentParticle;
out vec4 outColor;

float colormap_red(float x) {
	if (x < 0.75) {
		return 1012.0 * x - 389.0;
	} else {
		return -1.11322769567548E+03 * x + 1.24461193212872E+03;
	}
}

float colormap_green(float x) {
	if (x < 0.5) {
		return 1012.0 * x - 129.0;
	} else {
		return -1012.0 * x + 899.0;
	}
}

float colormap_blue(float x) {
	if (x < 0.25) {
		return 1012.0 * x + 131.0;
	} else {
		return -1012.0 * x + 643.0;
	}
}

vec3 colormap(float x) {
	float r = clamp(colormap_red(x) / 255.0, 0.0, 1.0);
	float g = clamp(colormap_green(x) / 255.0, 0.0, 1.0);
	float b = clamp(colormap_blue(x) / 255.0, 0.0, 1.0);
	return vec3(r, g, b);
}

void main() {
  vec2 normCoord = gl_PointCoord * 2.0 - 1.0;
  float sqCoord = dot(normCoord, normCoord);
  float a = smoothstep(1.0, 0.9, sqCoord);

  vec2 vel = texture(velMap, vUv).xy;
  float speed = length(vel);

  vec3 col = colormap(speed * 0.003) + 0.1;
  // col = mix(col, vec3(1), vAccentParticle);

  float density = texture(densityMap, vUv).x;
  a *= clamp(density * 150.0, 0.1, 1.0);

  outColor = vec4(col, a);
}