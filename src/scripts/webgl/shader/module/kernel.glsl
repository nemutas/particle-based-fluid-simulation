#define PI acos(-1.0)

#define Poly6ScalingFactor                4.0 / (pow(radius, 8.0) * PI)
#define SpikyPow3ScalingFactor           10.0 / (pow(radius, 5.0) * PI)
#define SpikyPow2ScalingFactor            6.0 / (pow(radius, 4.0) * PI)
#define SpikyPow3DerivativeScalingFactor 30.0 / (pow(radius, 5.0) * PI)
#define SpikyPow2DerivativeScalingFactor 12.0 / (pow(radius, 4.0) * PI)

float SmoothingKernelPoly6(float dst, float radius) {
  if (dst < radius) {
    float v = radius * radius - dst * dst;
    return v * v * v * Poly6ScalingFactor;
  }
  return 0.0;
}

float SpikyKernelPow3(float dst, float radius) {
  if (dst < radius) {
    float v = radius - dst;
    return v * v * v * SpikyPow3ScalingFactor;
  }
  return 0.0;
}

float SpikyKernelPow2(float dst, float radius) {
  if (dst < radius) {
    float v = radius - dst;
    return v * v * SpikyPow2ScalingFactor;
  }
  return 0.0;
}

float DerivativeSpikyPow3(float dst, float radius) {
  if (dst <= radius) {
    float v = radius - dst;
    return -v * v * SpikyPow3DerivativeScalingFactor;
  }
  return 0.0;
}

float DerivativeSpikyPow2(float dst, float radius) {
  if (dst <= radius) {
    float v = radius - dst;
    return -v * SpikyPow2DerivativeScalingFactor;
  }
  return 0.0;
}

float DensityKernel(float dst, float radius) {
  return SpikyKernelPow2(dst, radius);
}

float NearDensityKernel(float dst, float radius) {
  return SpikyKernelPow3(dst, radius);
}

float DensityDerivative(float dst, float radius) {
  return DerivativeSpikyPow2(dst, radius);
}

float NearDensityDerivative(float dst, float radius) {
  return DerivativeSpikyPow3(dst, radius);
}

float ViscosityKernel(float dst, float radius) {
  return SmoothingKernelPoly6(dst, radius);
}