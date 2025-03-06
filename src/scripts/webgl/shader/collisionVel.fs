precision highp float;
precision highp int;

uniform sampler2D posMap;
uniform sampler2D velMap;
uniform float particleSize;
uniform vec2 fieldSize;
uniform float collisionDamping;

in vec2 vUv;
out vec4 outColor;

void main() {
  vec2 pos = texture(posMap, vUv).xy;
  vec2 vel = texture(velMap, vUv).xy;

  float halfParticle = particleSize * 0.5;
  vec2 halfField = fieldSize * 0.5;

  if (pos.x < -halfField.x + halfParticle) {
    vel.x *= -1.0 * collisionDamping;
  } else if (halfField.x - halfParticle < pos.x) {
    vel.x *= -1.0 * collisionDamping;
  }

  if (pos.y < -halfField.y + halfParticle) {
    vel.y *= -1.0 * collisionDamping;
  } else if (halfField.y - halfParticle < pos.y) {
    vel.y *= -1.0 * collisionDamping;
  }

  outColor.xy = vel;
}