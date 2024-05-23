---
layout: post
categories: [OTHERS]
---

from [Dictionary - Compile vs. Transpile vs. Interpreter](https://github.com/newkayak12/Dictionary/blob/master/cs/CompileTranspileInterpreter.md)



# Compile vs. Transpile vs. Interpreter
## Compile
한 언어로 작성된 소스 코드를 다른 언어로 변환하는 것이 컴파일이다
ex) JAVA -> bytecode

- 전체 파일을 스캔하여 한꺼번에 번역
- 초기 스캔시간이 오래 걸리지만, 한번 실행 파일이 만들어지고 나면 빠르다.
- 기계어 번역과정에서 많은 메모리를 사용한다.
- 전체 코드를 스캔하는 과정에서 모든 오류를 한꺼번에 출력해주기 때문에 실행 전에 오류를 알 수 있다

## Interpreter
인터프리터(Interpreter)는 사람이 알아보기 쉬운 프로그래밍 언어로 작성한 코드를 한 줄 씩 즉시 기계어로 번역하는 번역기라고 생각하면 된다.

- 프로그램 실행 시 한 번에 한 문장씩 번역한다.
- 한번에 한문장씩 번역후 실행 시키기 때문에 실행 시간이 느리다.
- 컴파일러와 같은 오브젝트 코드 생성과정이 없기 때문에 메모리 효율이 좋다.
- 프로그램을 실행시키고 나서 오류를 발견하면 바로 실행을 중지 시킨다. 실행 후에 오류를 알 수 있기 때문에 사용성이 문제가 될수 있다


## Transpile
한 언어로 작성된 소스 코드를 비슷한 수준의 추상화를 가진 다른 언어로 변환하는 것이 트랜스파일이다.
ex) typeScript -> javaScript