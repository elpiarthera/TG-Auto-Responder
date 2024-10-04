type EnvVar = string | undefined;

export function validateEnv(...requiredEnvVars: string[]): void {
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
}

export function getEnvVar(name: string): string {
  const value = process.env[name] as EnvVar;
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}