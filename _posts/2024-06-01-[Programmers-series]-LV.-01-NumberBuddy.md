---
layout: post
categories: [PROGRAMMERS]
---


# 숫자 짝꿍

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/131128)


> <pre>
> 두 정수 X, Y의 임의의 자리에서 공통으로 나타나는 정수 k(0 ≤ k ≤ 9)들을 이용하여 만들 수 있는 가장 큰 정수를 두 수의 짝꿍이라 합니다(단, 공통으로 나타나는 정수 중 서로 짝지을 수 있는 숫자만 사용합니다).
> X, Y의 짝꿍이 존재하지 않으면, 짝꿍은 -1입니다. 
> X, Y의 짝꿍이 0으로만 구성되어 있다면, 짝꿍은 0입니다.
> 예를 들어, X = 3403이고 Y = 13203이라면, X와 Y의 짝꿍은 X와 Y에서 공통으로 나타나는 3, 0, 3으로 만들 수 있는 가장 큰 정수인 330입니다.
> 다른 예시로 X = 5525이고 Y = 1255이면 X와 Y의 짝꿍은 X와 Y에서 공통으로 나타나는 2, 5, 5로 만들 수 있는 가장 큰 정수인 552입니다(X에는 5가 3개, Y에는 5가 2개 나타나므로 남는 5 한 개는 짝 지을 수 없습니다.)
> 두 정수 X, Y가 주어졌을 때, X, Y의 짝꿍을 return하는 solution 함수를 완성해주세요.
> 제한사항
> 3 ≤ X, Y의 길이(자릿수) ≤ 3,000,000입니다.
> X, Y는 0으로 시작하지 않습니다.
> X, Y의 짝꿍은 상당히 큰 정수일 수 있으므로, 문자열로 반환합니다.
>
> </pre>


## 알고리즘

자료구조 PriorityQueue? Map?


##  풀이

```java
  @Nested
    class TestCases {

        @Test
        public void case1 () {
            String x = "100";
            String y = "2345";
            String expected = "-1";


            Assertions.assertEquals(expected, solution(x, y));
        }
        @Test
        public void case2 () {
            String x = "100";
            String y = "203045";
            String expected = "0";

            Assertions.assertEquals(expected, solution(x, y));
        }
        @Test
        public void case3 () {
            String x = "100";
            String y = "123450";
            String expected = "10";

            Assertions.assertEquals(expected, solution(x, y));
        }
        @Test
        public void case4 () {
            String x = "12321";
            String y = "42531";
            String expected = "321";

            Assertions.assertEquals(expected, solution(x, y));
        }
        @Test
        public void case5 () {
            String x = "5525";
            String y = "1255";
            String expected = "552";

            Assertions.assertEquals(expected, solution(x, y));
        }
    }

    //PriorityQueue에 넣어서 하나를 기준으로 숫자가 맞으면 빼내는 방식
    public static String solution(String x, String y) {
        PriorityQueue<Character> xQueue = new PriorityQueue<>(Collections.reverseOrder());
        PriorityQueue<Character> yQueue = new PriorityQueue<>(Collections.reverseOrder());


        for(Character xChar: x.toCharArray() ) xQueue.add(xChar);
        for(Character yChar: y.toCharArray() ) yQueue.add(yChar);

        PriorityQueue<Character> shortQueue = xQueue;
        PriorityQueue<Character> longQueue = yQueue;

        if(shortQueue.size() > longQueue.size()) {
            shortQueue = yQueue;
            longQueue =  xQueue;
        }

        List<Character> result = new ArrayList<>();

        while( !shortQueue.isEmpty() ) {
            char element = shortQueue.poll();
            if( longQueue.contains(element) ){
                while(!longQueue.isEmpty()) {
                    char longelem = longQueue.poll();
                    if(longelem == element) {
                        result.add(element);
                        break;
                    }
                }
            }
        }


        if( result.isEmpty() ) return "-1";
        else if ( result.stream().filter(e -> e == '0').count() == result.size()) {
            return  "0";
        }
        else {
           StringBuilder builder = new StringBuilder();
           for( char ch : result ) builder.append(ch);
           return builder.toString();
        }
    }

    // 미리 정리해서 Map으로 원소 개수를 파악해서 정렬하는 방식
    public static String solution2(String x, String y) {
        Map<Integer, Long> xMap = Arrays.stream(x.split("")).collect(Collectors.groupingBy(str -> Integer.parseInt(str), Collectors.counting()));
        Map<Integer, Long> yMap = Arrays.stream(y.split("")).collect(Collectors.groupingBy(str -> Integer.parseInt(str), Collectors.counting()));
        List<Integer> result = new ArrayList<>();
    
        IntStream.rangeClosed(0, 9)
                .forEach(refValue -> {
                    long xValue = xMap.getOrDefault(refValue, 0L);
                    long yValue = yMap.getOrDefault(refValue, 0L);
    
                    Integer[] tmpArray;
                    int count = 0;
    
                    if (xValue > yValue) count = (int) yValue;
                    else if (xValue < yValue) count = (int) xValue;
                    else count = (int) xValue;
    
                    tmpArray = new Integer[count];
                    Arrays.fill(tmpArray, refValue);
    
                    result.addAll(Arrays.stream(tmpArray).collect(Collectors.toList()));
                });
    
        result.sort((p, n) -> n - p);
    
        if (result.isEmpty()) return "-1";
        String answer = result.stream().map(String::valueOf).collect(Collectors.joining());
    
        if (answer.startsWith("0")) return "0";
        else return answer;
    }
```