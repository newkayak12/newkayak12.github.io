---
layout: post
categories: [PROGRAMMERS]
---


# 이진 변환 반복하기

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/70129)

> 
> <pre>
>  0과 1로 이루어진 어떤 문자열 x에 대한 이진 변환을 다음과 같이 정의합니다.
>  x의 모든 0을 제거합니다.
>  x의 길이를 c라고 하면, x를 "c를 2진법으로 표현한 문자열"로 바꿉니다.
> 
>  예를 들어,
>  x = "0111010"이라면,
>  x에 이진 변환을 가하면
>  x = "0111010" -> "1111" -> "100" 이 됩니다.
> 
> 
>  0과 1로 이루어진 문자열 s가 매개변수로 주어집니다.
>  s가 "1"이 될 때까지 계속해서 s에 이진 변환을 가했을 때,
>  이진 변환의 횟수와 변환 과정에서 제거된 모든 0의 개수를
>  각각 배열에 담아 return 하도록 solution 함수를 완성해주세요.
> 
>  제한사항
>   - s의 길이는 1 이상 150,000 이하입니다.
>   - s에는 '1'이 최소 하나 이상 포함되어 있습니다.
> </pre>
>

## 알고리즘 
따로 없다. `Integer.toBinaryString` 사용 정도가 특이했다.

## 풀이

```java
class ConvertBinaryString {
    @Nested
    public class TestCases {
        @Test
        public void case1 () {
            String s = "110010101001";
            int[] result = {3, 8};

            Assertions.assertArrayEquals(result, solution(s));
        }

        @Test
        public void case2 () {
            String s = "01110";
            int[] result = {3, 3};

            Assertions.assertArrayEquals(result, solution(s));
        }

        @Test
        public void case3 () {
            String s = "1111111";
            int[] result = {4, 1};

            Assertions.assertArrayEquals(result, solution(s));
        }
    }


    public int[] solution( String s ) {
        int zeroCount = 0;
        int convertCount = 0;
        while( !s.equals("1") ) {
            int stringCount = 0;
            for( int i = 0; i < s.length(); i ++ ) {
                if( s.charAt(i) == '0') zeroCount += 1;
                else stringCount += 1;
            }
            s = Integer.toBinaryString(stringCount);
            convertCount += 1;
        }

        return new int[]{ convertCount, zeroCount};
    }
}
```