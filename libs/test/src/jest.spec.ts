const dateStringMatcher =
  /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{1,3}Z?$/;

export const matchers = {
  id: expect.any(String),
  createdAt: expect.stringMatching(dateStringMatcher),
  updatedAt: expect.stringMatching(dateStringMatcher),
  meta: expect.any(Object),
};

export function expectForbiddenError(request: Promise<unknown>): Promise<void> {
  return expectError(/FORBIDDEN/)(request);
}

export function expectAuthenticationError(
  request: Promise<unknown>
): Promise<void> {
  return expectError(/AuthenticationError/)(request);
}

export function expectPermissionError(
  request: Promise<unknown>
): Promise<void> {
  return expectError(/You must have permission/)(request);
}

export function expectUnauthorizedError(
  request: Promise<unknown>
): Promise<void> {
  return expectError(/Unauthorization/)(request);
}

export function expectDuplicatedError(
  request: Promise<unknown>
): Promise<void> {
  return expectError(/DUPLICATE_RESOURCE/)(request);
}

export function expectNotFoundError(request: Promise<unknown>): Promise<void> {
  return expectError(/RESOURCE_NOT_FOUND/)(request);
}

export function expectError(
  error?: string | RegExp | Error
): (request: Promise<unknown>) => Promise<void> {
  return (req) => expect(req).rejects.toThrow(error);
}
