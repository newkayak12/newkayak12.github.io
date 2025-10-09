---
layout: post
categories: [PROGRAMMERS]
---


# 124 나라의 숫자

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/12899)

>
> <pre>
> 124 나라가 있습니다. 124 나라에서는 10진법이 아닌 다음과 같은 자신들만의 규칙으로 수를 표현합니다.
> 
>     - 124 나라에는 자연수만 존재합니다.
>     - 124 나라에는 모든 수를 표현할 때 1, 2, 4만 사용합니다.
> 
> 예를 들어서 124 나라에서 사용하는 숫자는 다음과 같이 변환됩니다.
> </pre>
> 
>  <table>
>      <tr>
>          <th>10진법</th>
>          <th>124나라</th>
>          <th>10진법</th>
>          <th>124나라</th>
>      </tr>
>      <tr>
>          <td>1</td>
>          <td>1</td>
>          <td>6</td>
>          <td>14</td>
>      </tr>
>      <tr>
>          <td>2</td>
>          <td>2</td>
>          <td>7</td>
>          <td>21</td>
>      </tr>
>      <tr>
>          <td>3</td>
>          <td>4</td>
>          <td>8</td>
>          <td>22</td>
>      </tr>
>      <tr>
>          <td>4</td>
>          <td>11</td>
>          <td>9</td>
>          <td>24</td>
>      </tr>
>      <tr>
>          <td>5</td>
>          <td>12</td>
>          <td>10</td>
>          <td>41</td>
>      </tr>
>  </table>
> 
> <pre>
>  자연수 n이 매개변수로 주어질 때, n을 124 나라에서 사용하는 숫자로 바꾼 값을
>  return 하도록 solution 함수를 완성해 주세요.
> 
>  제한사항
>     - n은 50,000,000이하의 자연수 입니다.
> </pre>


## 아이디어
3진법이되, 나머지가 0인 경우는 4를 추가하면 되지 않을까?

모듈로 연산과 나누기를 이용해서 진법 게산을 하면 될 것으로 보인다. 

```java
class OddDecimalSystem {
    @Nested
    class TestCases {
        @Test
        public void case1 () {
            int n = 1;
            String result = "1";

            Assertions.assertEquals(result, solution(n));
        }

        @Test
        public void case2 () {
            int n = 2;
            String result = "2";

            Assertions.assertEquals(result, solution(n));
        }

        @Test
        public void case3 () {
            int n = 3;
            String result = "4";

            Assertions.assertEquals(result, solution(n));
        }

        @Test
        public void case4 () {
            int n = 4;
            String result = "11";

            Assertions.assertEquals(result, solution(n));
        }

        @Test
        public void case5 () {
            int n = 10;
            String result = "41";

            Assertions.assertEquals(result, solution(n));
        }

        @Test
        public void case6 () {
            int n = 13;
            String result = "111";

            Assertions.assertEquals(result, solution(n));
        }

        @Test
        public void case7 () {
            int n = 16;
            String result = "121";

            Assertions.assertEquals(result, solution(n));
        }

        @Test
        public void case8 () {
            int n = 19;
            String result = "141";

            Assertions.assertEquals(result, solution(n));
        }
        @Test
        public void case9 () {
            int n = 20;
            String result = "142";

            Assertions.assertEquals(result, solution(n));
        }
        @Test
        public void case10 () {
            int n = 21;
            String result = "144";

            Assertions.assertEquals(result, solution(n));
        }
    }

    public String solution(int n) {

        /**
         * 1  : 1  (3*0 + 1)
         * 2  : 2  (3*0 + 2)
         * 3  : 4  (3*1 + 0)
         *
         * 4  : 11  (3*1 + 1)
         * 5  : 12  (3*1 + 2)
         * 6  : 14  (3*2 + 0)
         *
         * 7  : 21  (3*2 + 1)
         * 8  : 22  (3*2 + 2)
         * 9  : 24  (3*3 + 0)
         *
         * 10 : 41  (3*3 + 1)
         * 11 : 42  (3*3 + 2)
         * 12 : 44  (3*4 + 0)
         *
         *
         * 13 : 111  (3*4 + 1)
         * 14 : 112  (3*4 + 2)
         * 15 : 114  (3*5 + 0)
         *
         * 16 : 121  (3*5 + 1)
         * 17 : 122  (3*5 + 2)
         * 18 : 124  (3*6 + 0)
         *
         * 19 : 141  (3*6 + 1)
         * 20 : 142  (3*6 + 2)
         * 21 : 144  (3*7 + 0)
         */

        int number = n;
        StringBuffer buffer = new StringBuffer();
        while ( true ) {
            if ( number == 0 ) break;
            int div = number / 3;
            int modulo = number % 3;

            if (modulo ==  0 ) {
                buffer.append(4);
                number = div - 1;
            }
            else {
                buffer.append(modulo);
                number = div;
            }

        }

        return  buffer.reverse().toString();
    }
}
```