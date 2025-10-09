---
layout: post
categories: [JAVA, ANTI-PATTERN]
---

# Throws exceptions in finally block

- finally는 예외 여부와 상관없이 실행되어야만 하는 경우에 사용한다.
- 예를 들어 리소스를 닫는 등의 경우에서 말이다.
- finally에서 예외를 던지만 예기치 않은 동작이 발생하고 오류 처리가 모호해질 수 있다.


## 이유
1. 원래 예외를 마스킹
2. 의도하지 않은 흐름 제어
3. 리소스 유출 : finally에서 처리되어야 할 리소스 정리가 되지 않아서 메모리 누수, 잠재적 성능 저하가 발생할 수 있다.

## 권장
1. 적절한 오류 처리 사용
2. 정리 로직, 예외 처리 분리
3. fianlly에서는 단순하게! 리소스 정리 정도만
4. try-catch 중첩 : finally에서 여러 작업을 해야 한다면 차라리 try-catch를 여러 번 쓰자