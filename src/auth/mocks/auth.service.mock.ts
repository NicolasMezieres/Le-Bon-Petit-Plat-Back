export class AuthServiceMocks {
  signin = jest.fn();
  signup = jest.fn().mockResolvedValue({ data: 'Send email' });
}
