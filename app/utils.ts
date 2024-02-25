import { NextRequest } from 'next/server';

const USER_ID_COOKIES_NAME = 'user_id';

export function getUserIDFromRequest(request: NextRequest) {
  return request.cookies.get(USER_ID_COOKIES_NAME)?.value;
}
