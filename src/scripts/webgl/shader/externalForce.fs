#version 300 es
precision highp float;

uniform sampler2D posMap;
uniform sampler2D velMap;
uniform vec3 gravity;
uniform float dt;
uniform vec2 interactionInputPoint;
uniform float interactionInputStrength;
uniform float interactionInputRadius;

in vec2 vUv;
out vec4 outColor;

void main() {
  vec2 vel = texture(velMap, vUv).xy;
  vec2 acc;
  float gravityWeight = 1.0;

  if (0.0 < interactionInputStrength) {
    vec2 pos = texture(posMap, vUv).xy;
    vec2 inputPointOffset = interactionInputPoint - pos;
    float sqDist = dot(inputPointOffset, inputPointOffset);

    if (sqDist < interactionInputRadius * interactionInputRadius) {
      float dist = sqrt(sqDist);
      float edgeT = dist / interactionInputRadius;
      float centerT = 1.0 - edgeT;
      vec2 dirToCenter = inputPointOffset / dist;

      gravityWeight = 1.0 - (centerT * clamp(interactionInputStrength / 10.0, 0.0, 1.0));
      acc = dirToCenter * centerT * interactionInputStrength - vel * centerT;
    }
  }
  
  acc += gravity.xy * gravityWeight;
  outColor.xy = vel + acc * dt;
}