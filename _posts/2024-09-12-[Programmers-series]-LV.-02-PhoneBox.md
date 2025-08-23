---
layout: post
categories: [PROGRAMMERS]
---


# 전화번호 목록

[programmers](https://school.programmers.co.kr/learn/courses/30/lessons/42577)

><pre>
> 전화번호부에 적힌 전화번호 중, 한 번호가 다른 번호의 접두어인 경우가 있는지 확인하려 합니다.
> 전화번호가 다음과 같을 경우, 구조대 전화번호는 영석이의 전화번호의 접두사입니다.
> - 구조대 : 119
> - 박준영 : 97 674 223
> - 지영석 : 11 9552 4421
>   전화번호부에 적힌 전화번호를 담은 배열 phone_book이 solution 함수의 매개변수로
>   주어질 때,
>   어떤 번호가 다른 번호의 접두어인 경우가 있으면 false를
>   그렇지 않으면 true를 return 하도록 solution 함수를 작성해주세요.
> 
> 제한 사항
> - phone_book의 길이는 1 이상 1,000,000 이하입니다.
>     - 각 전화번호의 길이는 1 이상 20 이하입니다.
>     - 같은 전화번호가 중복해서 들어있지 않습니다.
></pre>
## 아이디어
startWith으로 검사하면 될 것 같다.


## 풀이

```java

    @Nested
    public class TestCases {
        @Test
        public void case1 () {
            String[] phone_book = {"119", "97674223", "1195524421"};
            boolean result = false;

            Assertions.assertEquals(result, solution(phone_book));
        }

        @Test
        public void case2 () {
            String[] phone_book = {"123","456","789"};
            boolean result = true;

            Assertions.assertEquals(result, solution(phone_book));
        }

        @Test
        public void case3 () {
            String[] phone_book = {"12","123","1235","567","88"};
            boolean result = false;

            Assertions.assertEquals(result, solution(phone_book));
        }
    }

    public boolean solution(String[] phone_book){
        boolean answer = true;


        Arrays.sort(phone_book, (o1, o2) -> {
            int compare = o1.compareTo(o2);
            if ( compare == 0 ) return o1.length() - o2.length();
            else return compare;
        });

        for (int i = 1; i < phone_book.length; i ++ ) {
            if(phone_book[i].startsWith(phone_book[i - 1])) {
                answer = false;
                break;
            }
        }

        return answer;
    }
```