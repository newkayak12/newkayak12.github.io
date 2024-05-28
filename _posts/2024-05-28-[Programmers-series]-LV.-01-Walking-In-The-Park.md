---
layout: post
categories: [PROGRAMMERS]
---



# 공원 산책

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/172928)
> 지나다니는 길을 'O', 장애물을 'X'로 나타낸 직사각형 격자 모양의 공원에서
> 로봇 강아지가 산책을 하려합니다.
> 
> 산책은 로봇 강아지에 미리 입력된 명령에 따라 진행하며,
> 명령은 다음과 같은 형식으로 주어집니다.
> 
>     - ["방향 거리", "방향 거리" … ]
> 
> 예를 들어 "E 5"는 로봇 강아지가 현재 위치에서 동쪽으로 5칸 이동했다는 의미입니다.
> 로봇 강아지는 명령을 수행하기 전에 다음 두 가지를 먼저 확인합니다.
> 
>     - 주어진 방향으로 이동할 때 공원을 벗어나는지 확인합니다.
>     - 주어진 방향으로 이동 중 장애물을 만나는지 확인합니다.
> 
> 위 두 가지중 어느 하나라도 해당된다면,
> 로봇 강아지는 해당 명령을 무시하고 다음 명령을 수행합니다.
> 
> 공원의 가로 길이가 W, 세로 길이가 H라고 할 때,
> 
> 공원의 좌측 상단의 좌표는 (0, 0),
> 우측 하단의 좌표는 (H - 1, W - 1) 입니다.
> 
>  <table>
>      <tr>
>          <td>(0, 0)</td>
>          <td> ... </td>
>          <td></td>
>      </tr>
>      <tr>
>           <td></td>
>           <td></td>
>           <td></td>
>       </tr>
>       <tr>
>           <td></td>
>           <td></td>
>           <td>(H -1, W - 1)</td>
>       </tr>
>  </table>
> 
> 
> 공원을 나타내는 문자열 배열 park,
> 로봇 강아지가 수행할 명령이 담긴 문자열 배열 routes가 매개변수로 주어질 때,
> 로봇 강아지가 모든 명령을 수행 후 놓인 위치를 [세로 방향 좌표, 가로 방향 좌표] 순으로
> 배열에 담아 return 하도록 solution 함수를 완성해주세요.
> 

## 알고리즘
크게 알고리즘이라고 할 부분은 없는 것으로 보이며, 단지 이차원 배열에서 이동 정도가 있을 것으로 보인다.
맵 형태의 그래프 탐색 문제의 초석 정도로 보인다.

## 풀이

```java
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
class Solution {

    public int[] solution(String[] park, String[] routes) {
        int[] coordinate = {0, 0};


        String[][] parkMap = new String[park.length][park[0].length()];


        Map<Character, Integer> moveMap = Map.of(
                'E', 1,
                'W', -1,
                'S', 1,
                'N', -1
        );

        for (int y = 0; y < park.length; y++) {
            String[] row = park[y].split("");
            for (int x = 0; x < row.length; x++) {
                parkMap[y][x] = row[x];

                if (row[x].equalsIgnoreCase("s")) {
                    coordinate[0] = y;
                    coordinate[1] = x;
                }
            }
        }


        for (String route : routes) {


            if (this.canIWalk(parkMap, coordinate, route)) {
                Integer walk = Integer.parseInt(String.valueOf(route.charAt(2)));
                Character direction = route.charAt(0);
                switch (direction) {
                    case 'E', 'W':
                        coordinate[1] += (walk * moveMap.get(direction));
                        break;
                    case 'S', 'N':
                        coordinate[0] += (walk * moveMap.get(direction));
                        ;
                        break;
                }
            }
        }


        return coordinate;
    }

    private boolean canIWalk(String[][] parkMap, int[] coordinate, String route) {

        String obstacles = "X";
        Character direction = route.charAt(0);
        Integer walk = Integer.parseInt(String.valueOf(route.charAt(2)));
        int x = coordinate[1];
        int y = coordinate[0];

        boolean result = Boolean.TRUE;


        switch (direction) {
            case 'E': {
                walk *= 1;
                if (parkMap[0].length <= (walk + x)) {
                    result = Boolean.FALSE;
                    break;
                }


                for (int i = x; i <= walk + x; i++) {
                    if (parkMap[y][i].equalsIgnoreCase(obstacles)) {
                        result = Boolean.FALSE;
                        break;
                    }
                }
                break;
            }
            case 'S': {
                walk *= 1;


                if (parkMap.length <= (walk + y)) {
                    result = Boolean.FALSE;
                    break;
                }
                for (int i = y; i <= walk + y; i++) {
                    if (parkMap[i][x].equalsIgnoreCase(obstacles)) {
                        result = Boolean.FALSE;
                        break;
                    }
                }
                break;
            }
            case 'W': {
                walk *= -1;

                if ((walk + x) < 0) {
                    result = Boolean.FALSE;
                    break;
                }

                for (int i = x; i >= walk + x; i--) {

                    if (parkMap[y][i].equalsIgnoreCase(obstacles)) {
                        result = Boolean.FALSE;
                        break;
                    }
                }
                break;
            }
            case 'N': {
                walk *= -1;
                if ((walk + y) < 0) {
                    result = Boolean.FALSE;
                    break;
                }
                for (int i = y; i >= walk + y; i--) {
                    if (parkMap[i][x].equalsIgnoreCase(obstacles)) {
                        result = Boolean.FALSE;
                        break;
                    }
                }
                break;
            }
        }
        return result;
    }
}
```