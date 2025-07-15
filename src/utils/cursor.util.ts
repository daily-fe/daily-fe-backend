export function encodeCursor(cursorObj: object): string {
  return Buffer.from(JSON.stringify(cursorObj)).toString('base64');
}

export function decodeCursor<T = any>(cursor?: string): T | undefined {
  if (!cursor) return undefined;
  try {
    const jsonStr = Buffer.from(cursor, 'base64').toString('utf-8');
    return JSON.parse(jsonStr);
  } catch {
    return undefined;
  }
}

// 제네릭 커서 인코딩: 엔티티와 필드 배열을 받아 해당 필드만 추출해 커서 생성
export function encodeGenericCursor<T extends object>(entity: T, fields: (keyof T)[]): string {
  const cursorObj: Partial<T> = {};
  fields.forEach(field => {
    cursorObj[field] = entity[field];
  });
  return Buffer.from(JSON.stringify(cursorObj)).toString('base64');
}

// 제네릭 커서 디코딩: base64 → JSON → 타입 반환
export function decodeGenericCursor<T = any>(cursor?: string): T | undefined {
  if (!cursor) return undefined;
  try {
    const jsonStr = Buffer.from(cursor, 'base64').toString('utf-8');
    return JSON.parse(jsonStr);
  } catch {
    return undefined;
  }
}
