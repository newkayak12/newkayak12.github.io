---
layout: post
categories: [PROGRAMMERS]
---

# 올바른 괄호

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/12909)

<pre>
  괄호가 바르게 짝지어졌다는 것은 '(' 문자로 열렸으면 반드시 짝지어서 ')'
  문자로 닫혀야 한다는 뜻입니다.

예를 들어
  "()()" 또는 "(())()" 는 올바른 괄호입니다.
  ")()(" 또는 "(()(" 는 올바르지 않은 괄호입니다.
  '(' 또는 ')' 로만 이루어진 문자열 s가 주어졌을 때,

문자열 s가 올바른 괄호이면 true를 return 하고,
올바르지 않은 괄호이면 false를 return 하는 solution 함수를 완성해 주세요.

제한사항
 - 문자열 s의 길이 : 100,000 이하의 자연수
 - 문자열 s는 '(' 또는 ')' 로만 이루어져 있습니다.
</pre>

## 알고리즘
스택 사용

## 풀이

```java
class Bracket {
    @Nested
    class TestCases {
        @Test
        public void case1 () {
            String s = "()()";
            Boolean answer = Boolean.TRUE;
            Assertions.assertEquals(answer, solution(s));
        }
        @Test
        public void case2 () {
            String s = "(())()";
            Boolean answer = Boolean.TRUE;
            Assertions.assertEquals(answer, solution(s));
        }
        @Test
        public void case3 () {
            String s = ")()(";
            Boolean answer = Boolean.FALSE;
            Assertions.assertEquals(answer, solution(s));
        }
        @Test
        public void case4 () {
            String s = "(()(";
            Boolean answer = Boolean.FALSE;
            Assertions.assertEquals(answer, solution(s));
        }
        @Test
        public void case5 () {
            String s = "()())()";
            Boolean answer = Boolean.FALSE;
            Assertions.assertEquals(answer, solution(s));
        }
        @Test
        public void case6 () {
            String s = "( )((( )";
            Boolean answer = Boolean.FALSE;
            Assertions.assertEquals(answer, solution(s));
        }

    }

    public boolean solution( String s ) {
        Stack<Character> characters = new Stack<>();
        boolean result = true;
        char open = '(';
        char close = ')';

        for(int i = 0; i < s.length(); i ++ ) {
            char here = s.charAt(i);
            if( here == open ) {
                characters.add(here);
            }
            else {
                if( !characters.empty() ) characters.pop();
                else {
                    result = false;
                    break;
                }
            }
        }


        if( !characters.isEmpty() ) return false;
        else return result;
    }
}
```