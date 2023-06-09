import { pipe } from 'fp-ts/lib/function'
import * as R from 'fp-ts/lib/Record'
import { Ord } from 'fp-ts/string'
import { camelCase } from 'lodash'
import { useCallback, useState } from 'react'

type RecordObject = Record<string, any>;

// 이 hook에서 메인이 되는 함수이다.
// 이 함수가 pipe에서 실행되려면?
// object
// 변형된 형식이라서 T타입으로 리턴하게되면 안된다.
// 받아온 타입을 추론해서 리턴하도록 해야한다.
function transformObjectKeys<T extends RecordObject>(
  obj: T,
  transformFn: (key?: string) => string = camelCase
): RecordObject {
  return pipe(
    obj,
    R.reduceWithIndex(Ord)({}, (key, acc, value) => {
      const transformedKey = transformFn(key);
      const transformedValue =
        typeof value === 'object' && value !== null && !Array.isArray(value)
          ? transformObjectKeys(value, transformFn)
          : value;

      return {
        ...acc,
        [transformedKey as string]: transformedValue,
      };
    })
  );
}


export const useRemoveSpaceProgramming = <T extends RecordObject>(initialState: T, fn?: (key?: string) => string): [T, (v: T) => void] => {
  const [value, setValue] = useState(transformObjectKeys(initialState, fn))

  const setRemoveSpaceProgramming = useCallback(
    (tree: T) => setValue(tree),
    [setValue]
  )

  return [value as T, setRemoveSpaceProgramming]
}

export const useRSP = useRemoveSpaceProgramming
export default useRemoveSpaceProgramming
export const useObj2KeyMap = useRemoveSpaceProgramming
export const obj2keyMap = transformObjectKeys