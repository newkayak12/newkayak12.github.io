# 카카오 - 숫자 문자열과 영단어

>
>  네오와 프로도가 숫자놀이를 하고 있습니다. 네오가 프로도에게 숫자를 건넬 때 일부 자릿수를 영단어로 바꾼 카드를 건네주면 프로도는 원래 숫자를 찾는 게임입니다.
> 
> 다음은 숫자의 일부 자릿수를 영단어로 바꾸는 예시입니다.
> 1478 → "one4seveneight"
> 234567 → "23four5six7"
> 10203 → "1zerotwozero3"
> 
> 
> 숫자	영단어
> 0 	zero
> 1 	one
> 2 	two
> 3 	three
> 4 	four
> 5 	five
> 6 	six
> 7 	seven
> 8 	eight
> 9 	nine
> 
> -  1 ≤ s의 길이 ≤ 50
> -  s가 "zero" 또는 "0"으로 시작하는 경우는 주어지지 않습니다.
> -  return 값이 1 이상 2,000,000,000 이하의 정수가 되는 올바른 입력만 s로 주어집니다.
>  </pre>



# 풀이

```java
class NumberAndWord {
    @Nested
    class TestCases {
        @Test
        public void case1 () {
            String input = "one4seveneight";
            int expected = 1478;
            Assertions.assertEquals(solution(input), expected);


        }
        @Test
        public void case2 () {
            String input = "23four5six7";
            int expected = 234567;
            Assertions.assertEquals(solution(input), expected);
        }
        @Test
        public void case3 () {
            String input = "2three45sixseven";
            int expected = 234567;
            Assertions.assertEquals(solution(input), expected);
        }
        @Test
        public void case4 () {
            String input = "123";
            int expected = 123;
            Assertions.assertEquals(solution(input), expected);
        }
    }


    public  int solution( String s ) {
        Map<String, String> map = Map.of(
                "zero","0",
                "one","1",
                "two","2",
                "three","3",
                "four","4",
                "five","5",
                "six","6",
                "seven","7",
                "eight","8",
                "nine","9"
        );

        for( String key : map.keySet() ) {
            s = s.replaceAll(key, map.get(key));
        }

        return Integer.parseInt(s);
    }
}
```