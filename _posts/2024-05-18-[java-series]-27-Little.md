from [Dictionary - 자잘한 기록물](https://github.com/newkayak12/Dictionary/blob/master/java/27.Little.md)

# charType -> integer number

```java
class Example {
    public static void main(String[] args) {
         char charNine = '9';
         int nine = charNine - '0';
         // -> nine;
    }
}
```

# String -> splice?

```java
class Example {
    public static void main(String[] args) {
         String exam = "adcd";
         StringBuilder builder = new StringBuilder(exam);
         builder.deleteCharAt(1); //like Splice
    }
}
```