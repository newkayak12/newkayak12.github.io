from [Dictionary - Set](https://github.com/newkayak12/Dictionary/blob/master/java/26.Set.md)

## intersect

List의 retainAll은 교집합 구현에 완벽히 사용 불가

```java
import java.util.ArrayList;

class RetainTest {
    @Test
    public void case1() {
        String first = "aaabb";
        String second = "aabbb";

        List<String> firstList = new ArrayList(); // [aa, aa, ab, bb]
        List<String> secondList = new ArrayList(); //[aa, ab, bb, bb]

        char[] firstChar = first.toCharArray();
        for( int i = 1; i < firstChar.length; i ++ )  firstList.add(firstChar[i - 1]+""+firstChar[i]);

        char[] secondChar = second.toCharArray();
        for( int i = 1; i < secondChar.length; i ++ )  secondList.add(secondChar[i - 1]+""+secondChar[i]);
        
        
        
        firstList.retainAll(secondList);
        System.out.println(firstChar); //[aa, aa, ab, bb]
        
        //firstList에 영향이 없다 치고

        secondList.remove(firstList);
        System.out.println(secondList); //[aa, ab, bb, bb]


        /**
         * - 결론
         * 알던 것과 결과가 굉장히 다르다. 
         */

    }
}

```
