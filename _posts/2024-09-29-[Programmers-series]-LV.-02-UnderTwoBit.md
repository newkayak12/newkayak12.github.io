---
layout: post
categories: [PROGRAMMERS]
---


# 2개 이하로 다른 비트

[Programmers] ( https://school.programmers.co.kr/learn/courses/30/lessons/77885 )


## 아이디어
1. 짝수면 1을 더하고, 홀수면 숫자를 1씩 올리면서 XOR 연산으로 다른 점이 2개 이하인 수를 찾자! -> 타임아웃
2. 짝수는 그대로 두고 홀수에서 숫자를 1을 올리면서 타임아웃이 나니, bit가 달라지는 패턴을 찾자
    - 다 1이면 1을 붙이고 최상위 비트를 0으로 변경
    - 그게 아니면 뒤에서 0을 찾아서 1로 바꾸고 한 자리 다음 숫자를 0으로 변경


## 풀이


```java
class UnderTwoBit {
    @Nested
    public class TestCases {
        @Test
        public void case1 () {
            long[] numbers = new long[]{2, 7};
            long[] result  = new long[]{3, 11};

            Assertions.assertArrayEquals(result, solution(numbers));
        }

        @Test
        public void case2 () {
            long[] numbers = new long[]{13};
            long[] result  = new long[]{14};

            Assertions.assertArrayEquals(result, solution(numbers));
        }

        @Test
        @Disabled
        public void bit () {
            for ( int i = 2; i < 10; i ++) {
                System.out.println(Integer.toBinaryString(i));
            }
        }
        @Test
        @Disabled
        public void pow () {
            System.out.println(Math.pow(2, 0));
        }

    }


    public long[] solution(long[] numbers) {
        //짝수면  최상단 비트를 1개 이동
        //홀수면  + 1
        long[] answer = new long[numbers.length];

        for ( int i = 0; i < numbers.length; i ++ ) {
            long number = numbers[i];
            if( number % 2 == 0) answer[i] = number + 1;
            else {
                /**
                 * 여기서 1씩 늘리면 타임아웃
                 * 규칙? -> 결국 비트 연산이 필요
                 *  1      1
                 *  3     11
                 *  5    101
                 *  7    111 -> 1011 (1)
                 *  9   1001 -> 1010 (1)
                 *  11  1010 -> 1011 (1)
                 *  13  1101 -> 1110 (1)
                 *  15  1111 -> 10111 (1)
                 *  17 10001 -> 10010 (1)
                 *  19 10011 -> 10101
                 *  21 10101 -> 10110
                 *  23 10111 -> 11011
                 *  25 11001 -> 11010
                 *  27 11010 -> 11011
                 *
                 *  모든 비트가 1이면 앞 자리를 0으로 만들고 1을 붙임
                 **/

                String binary = Long.toBinaryString(number);
                int bitLength = binary.length();
                int bitCount = Long.bitCount(number);

                if( bitCount == bitLength) {
                    String bit = "1" + binary.replaceFirst("1", "0");
                    answer[i] = Long.parseLong(bit, 2);
                }
                else  {
                    int index = binary.lastIndexOf('0');
                    char[] str = binary.toCharArray();
                    str[index] = '1';
                    str[index + 1] = '0';
                    answer[i] = Long.parseLong(new String(str), 2);
                }

//              1씩 증가, Timeout!
//                long ref = number + 1;
//                    while (true) {
//                        if( Long.bitCount((ref ^ number)) <= 2) {
//                            answer[i] = ref;
//                            break;
//                        }
//                        ref += 1;
//                    }


            }
        }


        return answer;
    }
}


```