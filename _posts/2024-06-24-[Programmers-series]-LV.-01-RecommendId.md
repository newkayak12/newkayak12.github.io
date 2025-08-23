---
layout: post
categories: [PROGRAMMERS]
---


# 카카오 - 신규 아이디 추천
[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/72410)

>
> <pre>
> 
> 카카오에 입사한 신입 개발자 네오는 "카카오계정개발팀"에 배치되어, 카카오 서비스에 가입하는 유저들의 아이디를 생성하는 업무를 담당하게 되었습니다. "네오"에게 주어진 첫 업무는 새로 가입하는 유저들이 카카오 아이디 규칙에 맞지 않는 아이디를 입력했을 때, 입력된 아이디와 유사하면서 규칙에 맞는 아이디를 추천해주는 프로그램을 개발하는 것입니다.
> 다음은 카카오 아이디의 규칙입니다.
> 아이디의 길이는 3자 이상 15자 이하여야 합니다.
> 아이디는 알파벳 소문자, 숫자, 빼기(-), 밑줄(_), 마침표(.) 문자만 사용할 수 있습니다.
> 단, 마침표(.)는 처음과 끝에 사용할 수 없으며 또한 연속으로 사용할 수 없습니다.
> "네오"는 다음과 같이 7단계의 순차적인 처리 과정을 통해 신규 유저가 입력한 아이디가 카카오 아이디 규칙에 맞는 지 검사하고 규칙에 맞지 않은 경우 규칙에 맞는 새로운 아이디를 추천해 주려고 합니다.
> 신규 유저가 입력한 아이디가 new_id 라고 한다면,
> 
> 
> >  1단계 new_id의 모든 대문자를 대응되는 소문자로 치환합니다.
> >  2단계 new_id에서 알파벳 소문자, 숫자, 빼기(-), 밑줄(_), 마침표(.)를 제외한 모든 문자를 제거합니다.
> >  3단계 new_id에서 마침표(.)가 2번 이상 연속된 부분을 하나의 마침표(.)로 치환합니다.
> >  4단계 new_id에서 마침표(.)가 처음이나 끝에 위치한다면 제거합니다.
> >  5단계 new_id가 빈 문자열이라면, new_id에 "a"를 대입합니다.
> >  6단계 new_id의 길이가 16자 이상이면, new_id의 첫 15개의 문자를 제외한 나머지 문자들을 모두 제거합니다.
> >       만약 제거 후 마침표(.)가 new_id의 끝에 위치한다면 끝에 위치한 마침표(.) 문자를 제거합니다.
> >  7단계 new_id의 길이가 2자 이하라면, new_id의 마지막 문자를 new_id의 길이가 3이 될 때까지 반복해서 끝에 붙입니다.
> 
> 
> 예를 들어, new_id 값이 "...!@BaT#*..y.abcdefghijklm" 라면, 위 7단계를 거치고 나면 new_id는 아래와 같이 변경됩니다.
> 1단계 대문자 'B'와 'T'가 소문자 'b'와 't'로 바뀌었습니다.
> "...!@BaT#*..y.abcdefghijklm" → "...!@bat#*..y.abcdefghijklm"
> 2단계 '!', '@', '#', '*' 문자가 제거되었습니다.
> "...!@bat#*..y.abcdefghijklm" → "...bat..y.abcdefghijklm"
> 3단계 '...'와 '..' 가 '.'로 바뀌었습니다.
> "...bat..y.abcdefghijklm" → ".bat.y.abcdefghijklm"
> 4단계 아이디의 처음에 위치한 '.'가 제거되었습니다.
> ".bat.y.abcdefghijklm" → "bat.y.abcdefghijklm"
> 5단계 아이디가 빈 문자열이 아니므로 변화가 없습니다.
> "bat.y.abcdefghijklm" → "bat.y.abcdefghijklm"
> 6단계 아이디의 길이가 16자 이상이므로, 처음 15자를 제외한 나머지 문자들이 제거되었습니다.
> "bat.y.abcdefghijklm" → "bat.y.abcdefghi"
> 7단계 아이디의 길이가 2자 이하가 아니므로 변화가 없습니다.
> "bat.y.abcdefghi" → "bat.y.abcdefghi"
> 따라서 신규 유저가 입력한 new_id가 "...!@BaT#*..y.abcdefghijklm"일 때, 네오의 프로그램이 추천하는 새로운 아이디는 "bat.y.abcdefghi" 입니다.
> </pre>

## 알고리즘

## 풀이

```java
class RecommendId {
    @Nested
    class TestCases {
        @Test
        public void case1() {
            String input = "...!@BaT#*..y.abcdefghijklm";
            String expect = "bat.y.abcdefghi";
            Assertions.assertEquals(solution(input), expect);
        }

        @Test
        public void case2() {
            String input = "z-+.^.";
            String expect = "z--";
            Assertions.assertEquals(solution(input), expect);
        }

        @Test
        public void case3() {
            String input = "=.=";
            String expect = "aaa";
            Assertions.assertEquals(solution(input), expect);
        }

        @Test
        public void case4() {
            String input = "123_.def";
            String expect = "123_.def";
            Assertions.assertEquals(solution(input), expect);
        }

        @Test
        public void case5() {
            String input = "abcdefghijklmn.p";
            String expect = "abcdefghijklmn";
            Assertions.assertEquals(solution(input), expect);

        }
    }


    public static String solution (String newId) {
        //toLowercase
        String lower = newId.toLowerCase();

        String notMatch = lower.replaceAll("([^a-z\\-\\_\\.\\d])", "");

        String continuousDot = notMatch.replaceAll("[\\.]+", "\\.");

        String firstEnd = continuousDot;
        if(firstEnd.startsWith(".")) firstEnd = firstEnd.substring(1, firstEnd.length());
        if(firstEnd.endsWith(".")) firstEnd = firstEnd.substring(0, firstEnd.length()-1);

        String ifEmpty = firstEnd;
        if("".equals(firstEnd)) ifEmpty = "a";

        String fifteen = ifEmpty;
        if( fifteen.length() > 15 ) {
            fifteen = fifteen.substring(0, 15);
            if (fifteen.endsWith(".")) fifteen = fifteen.substring(0, 14);
        }

        String lengthLowerThanTwo = fifteen;
        while( lengthLowerThanTwo.length() <= 2 ) {
            String last = (lengthLowerThanTwo.charAt(lengthLowerThanTwo.length() - 1)+"");
            lengthLowerThanTwo+=last;
        }

        return lengthLowerThanTwo;
    }


}
```