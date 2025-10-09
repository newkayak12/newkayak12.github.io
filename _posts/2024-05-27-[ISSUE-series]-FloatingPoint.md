---
layout: post
categories: [ISSUE]
---


from [Dictionary - FloatingPointIssue](https://github.com/newkayak12/Dictionary/blob/master/issue/FloatingPoint.md)



## 부동 소수점 관련 문제

```java
class FloatingPoint {
    @Test
    public void fpFailure() {
        Assertions.assertEquals(1.2 , 1.1 + 0.1);
        //결과는? false
        //부동소수점 문제 때문에 그렇다. (특히 이 주변은 다 괜찮은데 얘만 그렇다.)
        /**
         * Expected :1.2
         * Actual   :1.2000000000000002
         */
        //위와 같은 결과로 나온다.
    }
    
    @Test
    public void fpSuccess() {
        Assertions.assertEquals(BigDecimal.valueOf(1.2), BigDecimal.valueOf(1.1).add(BigDecimal.valueOf(0.1)));
        //이러면 성공한다.
    }
}
```


## Java _ BigDecimal 관련 사용 시 유의점
### 연산

1. '+' : `BigDecimal.valueOf(x).add(BigDecimal.valueOf(y));`
2. '-' : `BigDecimal.valueOf(x).substract(BigDecimal.valueOf(y));`
3. '*' : `BigDecimal.valueOf(x).multiply(BigDecimal.valueOf(y));`
4. '/' : `BigDecimal.valueOf(x).divide(BigDecimal.valueOf(y));`
5. '%' : `BigDecimal.valueOf(x).remainder(BigDecimal.valueOf(y));`
6. 절대값 : `BigDecimal.valueOf(x).abs();`

### 소수점
#### RoundingMode

1. `UP(BigDecimal.ROUND_UP),` : 양수일 때 올림, 음수일 때 내림
2. `DOWN(BigDecimal.ROUND_DOWN),` : ROUND_UP과 반대
3. `CEILING(BigDecimal.ROUND_CEILING),` : 올림
4. `FLOOR(BigDecimal.ROUND_FLOOR),` : 내림
5. `HALF_UP(BigDecimal.ROUND_HALF_UP),` : 반올림 (5이상 올림 5미만 버림)
6. `HALF_DOWN(BigDecimal.ROUND_HALF_DOWN),` : 반올림 ( 6이상 올림, 6미만 버림)
7. `HALF_EVEN(BigDecimal.ROUND_HALF_EVEN),` : 반올림 값이 짝수면 HALF_DOWN, 홀수면 HALF_UP
8. `UNNECESSARY(BigDecimal.ROUND_UNNECESSARY);`: 딱 떨어지는 값이 아니면 ArithmeticException

#### 사용법
`BigDecimal("0.9999").setScale(0, RoundingMode.CEILING);`



#### MathContext
1. `UNLIMITED = new MathContext(0, RoundingMode.HALF_UP);` : unlimit (무제한 정밀 산술)
2. `DECIMAL32 = new MathContext(7, RoundingMode.HALF_EVEN);` : matching the precision of the IEEE 754-2019 decimal32 format, 7 digits ( 7자리 정밀도 및 HALF_EVENT의 반올림 모드)
3. `DECIMAL64 = new MathContext(16, RoundingMode.HALF_EVEN);` : matching the precision of the IEEE 754-2019 decimal64 format, 16 digits  ( 16자리 정밀도 및 HALF_EVENT의 반올림 모드)
4. `DECIMAL128 = new MathContext(34, RoundingMode.HALF_EVEN);`: matching the precision of the IEEE 754-2019 decimal128 format, 34 digits ( 32자리 정밀도 및 HALF_EVENT의 반올림 모드)

### Methods
#### BigInteger 
```java
class IntroduceBigInteger {
    public void bit () {
        BigInteger i = new BigInteger("1018"); // 2진수로 표현하면 : 1111111010(2)
        int bitCount = i.bitCount(); // 1의 갯수 : 8
        int bitLength = i.bitLength(); // 비트 수 : 10
        int getLowestSetBit = i.getLowestSetBit(); // 1
        boolean testBit3 = i.testBit(3); // true
        BigInteger setBit12 = i.setBit(12); // 우측에서 13번째 비트를 1로 변경 → 1001111111010(2) → 5114
        BigInteger flipBit0 = i.flipBit(0); // 1111111011(2) → 1019
        BigInteger clearBit3 = i.clearBit(3); // 1111110010(2) → 1010    
    }
       

    public void bitOperate () {
        BigInteger i = new BigInteger("17"); // 2진수 : 10001(2)
        BigInteger j = new BigInteger("7"); // 2진수 : 111(2)
        BigInteger and = i.and(j); // 10001(2) & 111(2) = 00001(2) → 1(10)
        BigInteger or = i.or(j); // 23
        BigInteger not = j.not(); // -8
        BigInteger xor = i.xor(j); // 22
        BigInteger andNot = i.andNot(j); // 16
        BigInteger shiftLeft = i.shiftLeft(1); // 34
        BigInteger shiftRight = i.shiftRight(1); // 8
    }
}

```


### JsonSerializer<BigDecimal>

BigDecimal to JsonValue
```java

class BigDecimalScale6WithBankersRoundingSerializer  implements JsonSerializer<BigDecimal> {

    public static Integer SCALE_SIX = 6;
    public static RoundingMode BANKERS_ROUNDING_MODE = RoundingMode.HALF_EVEN;
    
    @Override
    public Object serialize( BigDecimal value, JsonGenerator gen,   SerializerProvider serializers ) {
        return gen.writeString(value.setScale(SCALE_SIX, BANKERS_ROUNDING_MODE).toString());
    }
}

```