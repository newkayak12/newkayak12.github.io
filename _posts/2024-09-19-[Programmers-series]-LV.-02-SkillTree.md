---
layout: post
categories: [PROGRAMMERS]
---


# 스킬트리
[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/49993)

> 
>  <pre>
>  선행 스킬이란 어떤 스킬을 배우기 전에 먼저 배워야 하는 스킬을 뜻합니다.
>  예를 들어 선행 스킬 순서가
> 
>           스파크 → 라이트닝 볼트 → 썬더일때,
> 
>  썬더를 배우려면 먼저 라이트닝 볼트를 배워야 하고,
>  라이트닝 볼트를 배우려면 먼저 스파크를 배워야 합니다.
> 
>  위 순서에 없는 다른 스킬(힐링 등)은 순서에 상관없이 배울 수 있습니다.
> 
>  따라서 스파크 → 힐링 → 라이트닝 볼트 → 썬더와 같은 스킬트리는 가능하지만,
>  썬더 → 스파크나 라이트닝 볼트 → 스파크 → 힐링 → 썬더와 같은 스킬트리는 불가능합니다.
> 
>  선행 스킬 순서 skill과
>  유저들이 만든 스킬트리1를 담은 배열 skill_trees가 매개변수로 주어질 때,
>  가능한 스킬트리 개수를 return 하는 solution 함수를 작성해주세요.
> 
>  제한 조건
>  - 스킬은 알파벳 대문자로 표기하며, 모든 문자열은 알파벳 대문자로만 이루어져 있습니다.
>  - 스킬 순서와 스킬트리는 문자열로 표기합니다.
>       - 예를 들어, C → B → D 라면 "CBD"로 표기합니다
>  - 선행 스킬 순서 skill의 길이는 1 이상 26 이하이며, 스킬은 중복해 주어지지 않습니다.
>  - skill_trees는 길이 1 이상 20 이하인 배열입니다.
>  - skill_trees의 원소는 스킬을 나타내는 문자열입니다.
>       - skill_trees의 원소는 길이가 2 이상 26 이하인 문자열이며, 스킬이 중복해 주어지지 않습니다.
>  </pre>
> 
> skill 순서는 1 ~ 26개, 중복 X
> 대조군 1 ~ 20
> 원소 당 2 ~ 26, 중복 X
> 

## 아이디어

Queue를 이용해서 순서가 뒤집히면 실패처리를 하면 되지 않을까?

## 풀이

```java
class SkillTree {
    @Nested
    public class TestCases {
        //Stack?
        @Test
        public void case1 () {
            String skill = "CBD";
            String[] skillTrees = {"BACDE", "CBADF", "AECB", "BDA"};
            int result = 2;

            Assertions.assertEquals(result, solution(skill, skillTrees));
        }

        @Test
        public void case2 () {
            String skill = "CBD";
            String[] skillTrees = {"BACDE", "DBACF", "AECB", "BDA"};
            int result = 1;

            Assertions.assertEquals(result, solution(skill, skillTrees));
        }

        @Test
        public void case3 () {
            String skill = "CAD";
            String[] skillTrees = {"EFGHI", "JIKL", "ED", "FGIH"};
            int result = 3;

            Assertions.assertEquals(result, solution(skill, skillTrees));
        }
        @Test
        public void case4 () {
            String skill = "CBD";
            String[] skillTrees = {"CED"};
            int result = 0;

            Assertions.assertEquals(result, solution(skill, skillTrees));
        }

        @Test
        public void case5 () {
            String skill = "CBD";
            String[] skillTrees = {"BACDE", "CBADF", "AECB", "BDA", "CAD"};
            int result = 2;

            Assertions.assertEquals(result, solution(skill, skillTrees));
        }

        @Test
        public void case6 () {
            String skill = "CBD";
            String[] skillTrees = { "CXF", "ASF", "BDF", "CEFD" };
            int result = 2;

            Assertions.assertEquals(result, solution(skill, skillTrees));
        }

        @Test
        public void case7 () {
            String skill = "C";
            String[] skillTrees = {"BC","AA"};
            int result = 2;

            Assertions.assertEquals(result, solution(skill, skillTrees));
        }

        @Test
        public void case8 () {
            String skill = "CBD";
            String[] skillTrees = {"BACDE", "CBADF", "AECB", "BDA", "CAD"};
            int result = 2;

            Assertions.assertEquals(result, solution(skill, skillTrees));
        }

        @Test
        public void case9() {
            String skill = "AB";
            String[] skillTrees = {"CDE", "DEF", "FGH", "HIJ", "KLMN"};
            int result = 5;

            Assertions.assertEquals(result, solution(skill, skillTrees));
        }

        @Test
        public void case10() {
            String skill = "CBD";
            String[] skillTrees = {"BACDE", "CBADF", "AECB", "BDA"};
            int result = 2;

            Assertions.assertEquals(result, solution(skill, skillTrees));
        }

        @Test
        public void case11() {
            String skill = "ABC";
            String[] skillTrees = {"X", "OP", "STU"};
            int result = 3;

            Assertions.assertEquals(result, solution(skill, skillTrees));
        }
        @Test
        public void case12() {
            String skill = "CBDK";
            //2
            String[] skillTrees = {"CB", "CXYB", "BD", "AECD", "ABC", "AEX", "CDB", "CBKD", "IJCB", "LMDK"};
            int result = 4;

            Assertions.assertEquals(result, solution(skill, skillTrees));
        }
    }

    //1,3,5,8,12,13
    //3,6,7,9,10,11,12,14
    //3,7    ,10,11,12,14


    public int solution(String skill, String[] skill_trees) {
        int answer = 0;
        List<Character> list = new LinkedList<>();
        for ( Character element : skill.toCharArray() ) list.add(element);


        for( String element : skill_trees) {
            Queue<Character> queue = new LinkedList<>(list);
            boolean isPass = true;
            int i = 0;

            while(i < element.length() && !queue.isEmpty()) {
                if(queue.contains(element.charAt(i)) && queue.peek() == element.charAt(i) ) {
                    queue.poll();
                }
                else if(queue.contains(element.charAt(i)) && queue.peek() != element.charAt(i)) {
                    isPass = false;
                    break;
                }
                i ++;
            }

            if( isPass ) answer += 1;
        }


        return answer;
    }


}
```