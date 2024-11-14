# DSL

- kotlin에서 사용하던 연산자들은 모두 오버로딩 되어 있는 경우다.

## 연산자
- operator 키워드를 붙여서 만든다.

### 단항
- +e: e.unaryPlus()
- -e: e.unaryMinus()
- !e: e.not()
- e++: e.inc()
- e--: e.dec()


## 이항
- a + b: a.plus(b)
- a - b: a.minus(b)
- a * b: a.times(b)
- a % b: a.rem(b)
- a / b: a.div(b)
- a .. b: a.rangeTo(b)
- a in b: b.contains(a)
- a !in b: !b.contains(a)
- a < b : a.compareTo(b) < 0
- a <= b : a.compareTo(b) <= 0
- a > b : b.compareTo(a) < 0
- a >= b : b.compareTo(a) <= 0


## 중위
- infix 키워드를 사용한다.
- 파라미터가 하나인 멤버나 확장 함수여야 한다.
```kotlin
infix fun <A, B> A.to(that: B): Pair<A, B> = Pair(this, that)

infix fun <T> ( (T) -> Boolean ).and( other: (T) -> Boolean ): (T) -> Boolean {
    return { this(it) && other(it) }
}

infix fun <T> ( (T) -> Boolean ).or( other: (T) -> Boolean ): (T) -> Boolean {
    return { this(it) || other(it) }
}
```


## 대입
- a += b: a = a.plus(b)
- a -= b: a = a.minus(b)
- a *= b: a = a.times(b)
- a /= b: a = a.div(b)
- a %= b: a = a.rem(b)

## 호출과 인덱스로 원소 찾기
- 호출 관습을 사용하면 값을 함수처럼 호출 식에서 사용할 수 있다.
- 필요한 파라미터와 함께 `invoke`를 정의하면 된다.
```kotlin
class TreeNode<T> ( var data: T ) {
    private val _children = arrayListOf<TreeNode<T>>()
    
    var parent: TreeNode<T>? = null
        private set
    
    operator fun plusAssign(data: T) {
        val node = TreeNode(data)
        _children += node
        node.parent = this
        
    } 
    
    operator fun minusAssign(data: T) {
        val index = _children.indexOfFirst { it.data == data }
        if( index < 0 ) return
        val node = _children.removeAt(index)
        node.parent = null
    }
    
    operator fun get(index: Int) = _children[index]
    operator fun set(index: Int, node: TreeNode<T>) {
        node.parent?._children?.remove(node)
        node.parent = this
        _children[index].parent = null
        _children[index] = node
    }
}

```

## 구조 분해

- 데이터 클래스 인스턴스로부터 한 번에 여러 프로퍼티를 읽어서 여러 가지 변수에 대입해주는 방식이다.
- 연산자 오버로딩을 사용하면 임의의 타입에 대해서 구조 분해를 제공할 수 있다.
```kotlin
val (from, to) = r(1, 3) .. r(1,2)
//이런 것도 된다.
```

