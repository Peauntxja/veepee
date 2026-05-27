export const DEMO_USER = {
  email: "demo@veepee.fr",
  password: "demo123",
};

export function isDemoCredentials(email: string, password: string): boolean {
  return email === DEMO_USER.email && password === DEMO_USER.password;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
