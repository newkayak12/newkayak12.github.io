---
layout: post
categories: [PROGRAMMERS]
---


# 의상

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/42578)

> <pre>
> 코니는 매일 다른 옷을 조합하여 입는것을 좋아합니다.
> 예를 들어 코니가 가진 옷이 아래와 같고,
> 오늘 코니가 동그란 안경, 긴 코트, 파란색 티셔츠를 입었다면
> 다음날은 청바지를 추가로 입거나 동그란 안경 대신 검정 선글라스를 착용하거나 해야합니다.
> </pre>
> <table>
>     <tr>
>         <th>종류</th> <th>이름</th>
>     </tr>
> 	    <tr>
> 	        <td>얼굴</td>  <td>동그란 안경, 검정 선글라스</td>
> 	    </tr>
>      <tr>
>          <td>상의</td>  <td>파란색 티셔츠</td>
>      </tr>
>      <tr>
>          <td>하의</td>  <td>청바지</td>
>      </tr>
>      <tr>
>          <td>겉옷</td>  <td>긴 코트</td>
>      </tr>
> </table>
> 
> <pre>
> 코니는 각 종류별로 최대 1가지 의상만 착용할 수 있습니다.
> 예를 들어 위 예시의 경우 동그란 안경과 검정 선글라스를 동시에 착용할 수는 없습니다.
> 착용한 의상의 일부가 겹치더라도, 다른 의상이 겹치지 않거나,
> 혹은 의상을 추가로 더 착용한 경우에는 서로 다른 방법으로 옷을 착용한 것으로 계산합니다.
> 코니는 하루에 최소 한 개의 의상은 입습니다.
> 코니가 가진 의상들이 담긴 2차원 배열 clothes가 주어질 때
> 서로 다른 옷의 조합의 수를 return 하도록 solution 함수를 작성해주세요.
> 
>   제한사항
> - clothes의 각 행은 [의상의 이름, 의상의 종류]로 이루어져 있습니다.
> - 코니가 가진 의상의 수는 1개 이상 30개 이하입니다.
> - 같은 이름을 가진 의상은 존재하지 않습니다.
> - clothes의 모든 원소는 문자열로 이루어져 있습니다.
> - 모든 문자열의 길이는 1 이상 20 이하인 자연수이고 알파벳 소문자 또는 '_' 로만 이루어져 있습니다.
> </pre>


## 알고리즘

알고리즘은 따로 없고 아무 것도 없다는 값을 null로 표현하는 아이디어가 필요해 보인다.

## 풀이 

```java

class Clothes {
    @Nested
    class TestCases {
        @Test
        public void case1 () {
            String[][] clothes = new String[][]{
                    {"yellow_hat", "headgear"},
                    {"blue_sunglasses", "eyewear"},
                    {"green_turban", "headgear"}
            };
            int result = 5;

            Assertions.assertEquals(result, solution(clothes));
        }

        @Test
        public void case2 () {
            String[][] clothes = new String[][]{
                    {"crow_mask", "face"},
                    {"blue_sunglasses", "face"},
                    {"smoky_makeup", "face"}
            };


            int result = 3;

            Assertions.assertEquals(result, solution(clothes));
        }

        @Test
        public void case3 () {
            String[][] clothes = new String[][]{
                    {"yellow_hat", "headgear"},
                    {"green_turban", "headgear"},
                    {"airpod", "ear"},
                    {"crow_mask", "face"},
                    {"blue_sunglasses", "face"},
                    {"smoky_makeup", "face"}
            };
            int result = 23;

            Assertions.assertEquals(result, solution(clothes));
            /**
             * 1 -> 6
             * 2 -> {
             *   yellow_hat ( blue_sunglasses, crow_mask, airpod, smoky_makeup ) => 4
             *   green_turban ( blue_sunglasses, crow_mask, airpod, smoky_makeup ) => 4
             *   blue_sunglasses ( crow_mask, airpod, smoky_makeup )  => 3
             * } => 11
             * 3 -> {
             * yellow_hat (faces) => 3
             * green_turban (faces) => 3
             * } => 6
             */
        }
    }


    public int solution(String[][] clothes) {
        int answer = 1;
        Map< String, List< String > > map = new HashMap<>();

        for( String[] cloth : clothes ) {

            List< String > list;
            if( Objects.isNull(map.get(cloth[1])) ) {
                list = new ArrayList<>();
                list.add(null);
            }
            else list = map.get(cloth[1]);

            list.add(cloth[0]);
            map.put(cloth[1], list);

        }

        for ( String key : map.keySet() ) answer *= map.get(key).size();
        return answer - 1;
    }
}

```