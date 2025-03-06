precision highp float;
precision highp int;

uniform sampler2D posMap;
uniform float particleSize;
uniform vec2 fieldSize;
uniform float collisionDamping;

in vec2 vUv;
out vec4 outColor;

void main() {
  vec2 pos = texture(posMap, vUv).xy;

  float halfParticle = particleSize * 0.5;
  vec2 halfField = fieldSize * 0.5;

  if (pos.x < -halfField.x + halfParticle) {
    pos.x = -halfField.x + halfParticle;
  } else if (halfField.x - halfParticle < pos.x) {
    pos.x = halfField.x - halfParticle;
  }

  if (pos.y < -halfField.y + halfParticle) {
    pos.y = -halfField.y + halfParticle;
  } else if (halfField.y - halfParticle < pos.y) {
    pos.y = halfField.y - halfParticle;
  }

  outColor.xy = pos;
}