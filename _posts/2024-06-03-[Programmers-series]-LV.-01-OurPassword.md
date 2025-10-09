---
layout: post
categories: [PROGRAMMERS]
---

# 둘만의 암호

> <pre>
> 문제 설명
> 
> 두 문자열 s와 skip, 그리고 자연수 index가 주어질 때, 다음 규칙에 따라 문자열을 만들려 합니다. 암호의 규칙은 다음과 같습니다.
> - 문자열 s의 각 알파벳을 index만큼 뒤의 알파벳으로 바꿔줍니다.
> - index만큼의 뒤의 알파벳이 z를 넘어갈 경우 다시 a로 돌아갑니다.
> - skip에 있는 알파벳은 제외하고 건너뜁니다.
> 예를 들어 s = "aukks", skip = "wbqd", index = 5일 때, a에서 5만큼 뒤에 있는 알파벳은 f지만 [b, c, d, e, f]에서 'b'와 'd'는 skip에 포함되므로 세지 않습니다. 따라서 'b', 'd'를 제외하고 'a'에서 5만큼 뒤에 있는 알파벳은 [c, e, f, g, h] 순서에 의해 'h'가 됩니다. 나머지 "ukks" 또한 위 규칙대로 바꾸면 "appy"가 되며 결과는 "happy"가 됩니다.
> 두 문자열 s와 skip, 그리고 자연수 index가 매개변수로 주어질 때 위 규칙대로 s를 변환한 결과를 return하도록 solution 함수를 완성해주세요.
> 
> 제한사항
> - 5 ≤ s의 길이 ≤ 50
> - 1 ≤ skip의 길이 ≤ 10
> - s와 skip은 알파벳 소문자로만 이루어져 있습니다.
>     -  skip에 포함되는 알파벳은 s에 포함되지 않습니다.
> - 1 ≤ index ≤ 20
> </pre>

## 알고리즘
- `char`로 처리


## 풀이

```java
class OurPassword {
    @Nested
    class TestCases {
        @Test
        public void case1 () {
            String s = "aukks";
            String skip = "wbqd";
            int index = 5;

            String result = "happy";

//            Assertions.assertEquals(result, solutionBack(s, skip, index));
            Assertions.assertEquals(result, solution(s, skip, index));
        }

        @Test
        public void case2 () {
            String s = "abcde";
            String skip = "";
            int index = 0;

            String result = "abcde";

//            Assertions.assertEquals(result, solutionBack(s, skip, index));
            Assertions.assertEquals(result, solution(s, skip, index));
        }

        @Test
        public void case3 () {
            String s = "abcde";
            String skip = "";
            int index = 1;

            String result = "bcdef";

//            Assertions.assertEquals(result, solutionBack(s, skip, index));
            Assertions.assertEquals(result, solution(s, skip, index));
        }

        @Test
        public void case4 () {
            String s = "abcde";
            String skip = "fghij";
            int index = 5;

            String result = "klmno";

//            Assertions.assertEquals(result, solutionBack(s, skip, index));
            Assertions.assertEquals(result, solution(s, skip, index));
        }

        @Test
        public void case5 () {
            String s = "ybc";
            String skip = "az";
            int index = 1;

            String result = "bcd";

//            Assertions.assertEquals(result, solutionBack(s, skip, index));
            Assertions.assertEquals(result, solution(s, skip, index));
        }

        @Test
        public void case6 () {
            String s = "abd";
            String skip = "";
            int index = 2;

            String result = "cdf";

//            Assertions.assertEquals(result, solutionBack(s, skip, index));
            Assertions.assertEquals(result, solution(s, skip, index));
        }

        @Test
        public void case7 () {
            String s = "xyz";
            String skip = "";
            int index = 2;

            String result = "zab";

//            Assertions.assertEquals(result, solutionBack(s, skip, index));
            Assertions.assertEquals(result, solution(s, skip, index));
        }

        @Test
        public void case8 () {
            String s = "ace";
            String skip = "d";
            int index = 4;

            String result = "fhi";

            Assertions.assertEquals(result, solutionBack(s, skip, index));
//            Assertions.assertEquals(result, solution(s, skip, index));
        }
    }

    public String solution( String s, String skip, int index ){
        StringBuilder builder = new StringBuilder();

        for( int i = 0; i < s.length(); i ++) {
            int charAt = s.charAt(i);

            for (int j = 0; j < index; j ++) {
                charAt ++;
                if( charAt  > 'z' )  charAt -= ('z'-'a'+1);
                if( skip.contains(String.valueOf((char) charAt)) ) j --;
            }

            builder.append((char) charAt);
        }

        return builder.toString();
    }
}
```