const dateStringMatcher =
  /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{1,3}Z?$/;

export const matchers = {
  id: expect.any(String),
  createdAt: expect.stringMatching(dateStringMatcher),
  updatedAt: expect.stringMatching(dateStringMatcher),
  meta: expect.any(Object),
};

export function expectPermissionError(): (
  request: Promise<unknown>
) => Promise<void> {
  return expectError(/Must have permission/);
}

export function expectUnauthorizedError(): (
  request: Promise<unknown>
) => Promise<void> {
  return expectError(/Unauthorization/);
}

export function expectError(
  error?: string | RegExp | Error
): (request: Promise<unknown>) => Promise<void> {
  return (req) => expect(req).rejects.toThrow(error);
}
