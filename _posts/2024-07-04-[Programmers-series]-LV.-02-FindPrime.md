---
layout: post
categories: [PROGRAMMERS]
---


# 소수 찾기

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/42839)

> <pre>
>    한자리 숫자가 적힌 종이 조각이 흩어져있습니다.
>    흩어진 종이 조각을 붙여 소수를 몇 개 만들 수 있는지 알아내려 합니다.
>
>     각 종이 조각에 적힌 숫자가 적힌 문자열 numbers가 주어졌을 때,
>     종이 조각으로 만들 수 있는 소수가 몇 개인지 return 하도록 solution 함수를 완성해주세요.
>
> 제한사항
>  - numbers는 길이 1 이상 7 이하인 문자열입니다.
>  - numbers는 0~9까지 숫자만으로 이루어져 있습니다.
>  - "013"은 0, 1, 3 숫자가 적힌 종이 조각이 흩어져있다는 의미입니다.
> </pre>


## 알고리즘

### 애라토네스의 체

1. 소수
소수란 1과 자기 자신만을 약수로 가지는 수

2. 에라토네스의 체 아이디어
소수라면 1과 자신만을 약수로 갖을 거다. 따라서 1 ~ 자신 사이의 수로 본인을 나눈 나머지가 0이 되는 경우가 없는 경우가 소수이다.

3. 방법
> #1. 2부터 본인 전까지 순회하면서 나머지가 0이 나온다면 소수가 아니라고 결론짓는다. 그렇지 않으면 소수로 판별한다.
> 그러나 이 아이디어는 자기 자신이 크면 순회할 사이의 수가 증가한다는 단점이 있다.
>  
> 이를 개선하기 위해서 본인의 제곱근 만큼 순회하도록 한다. 약수는 짝이 있으므로 하나를 정하면 다른 하나도 자동으로 정해진다.
> ex) 6의 약수는 (1, 6), (2, 3) 있다. 이런 케이스가 아니라면 9의 경우 (1, 9), (3)이 있다. 어쨋든 제곱근까지 순회하면서 약수로 판별이 되면
> 나머지 하나도 확정이기 때문에 굳이 끝까지 순회할 필요가 없다.

4. 코드

```java
boolean eratosthenes(long number) {
        if (number < 2) return Boolean.FALSE; //1은 소수가 아니다.
        
        for (int i = 2; i <= Math.sqrt(number); i++) {
            if (number % i == 0) return Boolean.FALSE;
        }

        return Boolean.TRUE;
}
```

### DFS

1. 설명
경우의 수의 끝을 본 후 다음을 보는 식의 순회이다. 보통 그래프에서 깊이를 우선적으로 탐색하는 알고리즘이라고 한다. 
주로 탐색한 경로를 모두 탐색하고 그 바로 전 상황으로 넘어가서(일종의 백트래킹) 다른 경우의 수를 탐색하는 식이다.

그렇기 때문에 찾은 경우의 수가 최선이라고는 할 수 없다. 

2. 방법
스택, 재귀함수로 구현한다.

3. 구현
재귀도 결국 콜스택을 사용하므로 핵심은 스택이다. 재귀와 스택 차이는 당시 상황을 캡쳐링하는 하냐 아니냐의 차이일거다. 콜스택을 사용하면 마지막으로 닿으면
리턴되면서 케이스가 종료되고 이전 상태에서 방문 상태로 전으로 바꿔서 그 전 상태에서 다른 방향으로 탐색한다. 
스택으로는 이전 상태를 기억하는 과정이 필요해보인다.

```java
class DFS {
    String numbers = "12345";

    public static void main(String[] args) {
        
        recursive(null, "", 0, new boolean[numbers.length()]);
        stack(numbers);
    }

    private static Set<Long> recursive(String numbers, String prev, int depth, boolean[] visit) {


        Set<Long> result = new HashSet<>();
        if (numbers.length() < depth) return result;

        String[] arr = numbers.split("");

        for (int i = 0; i < arr.length; i++) {
            if (visit[i]) continue;

            visit[i] = true;  //탐색했다고 마킹하고
            result.add(Long.parseLong(prev + arr[i]));
            result.addAll(permutation(numbers, prev + arr[i], depth + 1, visit));
            //마킹된 상태가 캡쳐된 상태로 탐색을 진행한다.
            visit[i] = false; //재귀가 끝난뒤 해제한다.
        }

        return result;
    }
    
    //상태 보존을 위해 간단하게 튜플을 사용
    public static class Tuple <T1, T2>{
        public T1 t1;
        public T2 t2;

        public Tuple(T1 t1, T2 t2) {
            this.t1 = t1;
            this.t2 = t2;
        }

        public static  <T1, T2> Tuple of(T1 t1, T2 t2) {
            return new Tuple<>(t1, t2);
        }
    }
    
    private static List<Long> stack( String n ) {
        String[] strings = n.split("");
        Set<String> set = new HashSet<>();

        for( int i = 0; i < strings.length; i ++ ) {
            Stack<Tuple<String, boolean[]>> charSet = new Stack<>();
            boolean[] visit = new boolean[strings.length];
            String charac = strings[i];
            set.add(charac);
            visit[i] = true;

            charSet.add(Tuple.of(charac, Arrays.copyOf(visit, visit.length)));
//처음 상태를 스택에 넣고
            
            while( !charSet.isEmpty() ){
                Tuple<String, boolean[]> pop = charSet.pop();
                //팝하면서 순회
                //스택이 비면 종료

                for(int j = 0; j < strings.length; j ++ ) {
                    if(!pop.t2[j]) {

                        boolean[] cloneMap = Arrays.copyOf(pop.t2, pop.t2.length);
                        //상태를 clone해서 기억하고
                        cloneMap[j] = true;
                        charSet.add(Tuple.of(pop.t1+strings[j], cloneMap));
                        //스택에 추가
                        
                        set.add(pop.t1+strings[j]);
                    }
                }
            }
        }

        List<Long> result = set.stream().map(Long::parseLong).distinct().collect(Collectors.toList());
        Collections.sort(result);
        return result;
    }
    
}
```

## 풀이

따록 속도적인 측면 보다 DFS 구현 방법에 초점을 맞춰봤다.

### 1번 DFS(재귀)
```java
class FindPrime {
   
    @Nested
    public class TestCases {
        @Test
        public void case1() {
            String numbers = "17";
            int result = 3;
            Assertions.assertEquals(result, solution(numbers));
        }

        @Test
        public void case2() {
            String numbers = "011";
            int result = 2;
            Assertions.assertEquals(result, solution(numbers));
        }

        @Test
        public void case3() {
            String numbers = "232";
            int result = 4;
            Assertions.assertEquals(result, solution(numbers));
        }

        @Test
        public void case4() {
            String numbers = "1234";
            int result = 14;
            Assertions.assertEquals(result, solution(numbers));
        }

    }
    
    public int solution(String numbers) {
        int answer = 0;
        Set<Long> numberSet = this.permutation(numbers, "", 0, new boolean[numbers.length()]).stream().collect(Collectors.toSet());
        for (Long isPrime : numberSet) {  if (eratosthenes(isPrime)) answer += 1; }

        return answer;
    }

    private boolean eratosthenes(long number) {
        if (number < 2) return Boolean.FALSE;
        for (int i = 2; i <= Math.sqrt(number); i++) {
            if (number % i == 0) return Boolean.FALSE;
        }

        return Boolean.TRUE;
    }

    private Set<Long> permutation(String numbers, String prev, int depth, boolean[] visit) {


        Set<Long> result = new HashSet<>();
        if (numbers.length() < depth) return result;

        String[] arr = numbers.split("");

        for (int i = 0; i < arr.length; i++) {
            if (visit[i]) continue;

            visit[i] = true;
            result.add(Long.parseLong(prev + arr[i]));
            result.addAll(permutation(numbers, prev + arr[i], depth + 1, visit));
            visit[i] = false;
        }

        return result;
    }


}
```

### 2번 DFS(스택 + 튜플)
```java
class FindPrime {
    @Nested
    public class TestCases {
        @Test
        public void case1() {
            String numbers = "17";
            int result = 3;
            Assertions.assertEquals(result, solution(numbers));
        }

        @Test
        public void case2() {
            String numbers = "011";
            int result = 2;
            Assertions.assertEquals(result, solution(numbers));
        }

        @Test
        public void case3() {
            String numbers = "232";
            int result = 4;
            Assertions.assertEquals(result, solution(numbers));
        }

        @Test
        public void case4() {
            String numbers = "1234";
            int result = 14;
            Assertions.assertEquals(result, solution(numbers));
        }

    }

    public int solution(String numbers) {
        int answer = 0;
        List<Long> numberSet = this.permutation(numbers);

        for (Long isPrime : numberSet) {  if (eratosthenes(isPrime)) answer += 1; }

        return answer;
    }



    private boolean eratosthenes(long number) {
        if (number < 2) return Boolean.FALSE;
        for (int i = 2; i <= Math.sqrt(number); i++) {
            if (number % i == 0) return Boolean.FALSE;
        }

        return Boolean.TRUE;
    }

    public static class Tuple <T1, T2>{
        public T1 t1;
        public T2 t2;

        public Tuple(T1 t1, T2 t2) {
            this.t1 = t1;
            this.t2 = t2;
        }

        public static  <T1, T2> Tuple of(T1 t1, T2 t2) {
            return new Tuple<>(t1, t2);
        }
    }

    private List<Long> permutation( String n ) {
        String[] strings = n.split("");
        Set<String> set = new HashSet<>();

        for( int i = 0; i < strings.length; i ++ ) {
            Stack<Tuple<String, boolean[]>> charSet = new Stack<>();
            boolean[] visit = new boolean[strings.length];
            String charac = strings[i];
            set.add(charac);
            visit[i] = true;

            charSet.add(Tuple.of(charac, Arrays.copyOf(visit, visit.length)));

            while( !charSet.isEmpty() ){
                Tuple<String, boolean[]> pop = charSet.pop();



                for(int j = 0; j < strings.length; j ++ ) {
                    if(!pop.t2[j]) {

                        boolean[] cloneMap = Arrays.copyOf(pop.t2, pop.t2.length);
                        cloneMap[j] = true;
                        charSet.add(Tuple.of(pop.t1+strings[j], cloneMap));
                        set.add(pop.t1+strings[j]);
                    }
                }
            }
        }

        List<Long> result = set.stream().map(Long::parseLong).distinct().collect(Collectors.toList());
        Collections.sort(result);
        return result;
    }
}
```