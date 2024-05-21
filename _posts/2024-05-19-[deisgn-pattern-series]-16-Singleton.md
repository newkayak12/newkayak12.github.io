from [Dictionary - Singleton](https://github.com/newkayak12/Dictionary/blob/master/java/designPattern/16.Singleton.md)


# Singleton
```java
// Basic
public class Singleton {
    private static Singleton instance;
    
    private Singleton() { }
    
    public static Singleton getInstance() {
        if ( Objects.isNull( instance ) ) { // 쓰레드 동시 접근 시 문제가 발생
            instance = new Singleton(); // 쓰레드 동시 접근 시 여러 번 생성
        }
        
        return instance;
    }
}

// Synchronized
public class Singleton {
    private static Singleton instance;

    private Singleton() { }

    public static synchronized Singleton getInstance() {
        if ( Objects.isNull( instance ) ) { 
            instance = new Singleton(); 
        }

        //인스턴스 생성이 된 이후에도 락을 건다. 불필요!
        return instance;
    }
}

//DCL(Double-Checked-Locking) 
public class Singleton {
    private static Singleton instance;

    private Singleton() { }

    public static Singleton getInstance() {
        if ( Objects.isNull( instance ) ) {
            
            synchronized (Singleton.class) {
                if ( Objects.isNull( instance ) ) {
                    instance = new Singleton();
                    /**
                     * 아래와 같은 재배치가 있을 수 있다.
                     * some_space = allocate space for Singleton Obj;
                     * 
                     *   instancce = some_sapce;
                     * 
                     * create finished
                     */
                }
            }
        }

        //락을 거는 부분을 최소한으로 
        //소스코드 상으로 문제가 없지만 컴파일러에 따라 재배치(reordering) 문제가 발생하기도 한다. 
        return instance;
    }
}

//volatile
public class Singleton {
    
    private volatile static Singleton instance;

    private Singleton() { }

    public static Singleton getInstance() {
        if ( Objects.isNull( instance ) ) {

            synchronized (Singleton.class) {
                if ( Objects.isNull( instance ) ) {
                    instance = new Singleton();
                }
            }
        }

        //문제 없음 
        return instance;
    }
}

//static 초기화 이용
public class Singleton {

    private static Singleton instance;
    
    static {
        instance = new Singleton();  //클래스 로드 시점에 생성해서 하나임을 보장한다.
    }
    
    private Singleton() { }

    public static synchronized Singleton getInstance() {
        return instance;
    }
    
    // 해당 instance를 사용 여부와 상관없이 생성한다. 낭비!
}

//LazyHolder static
public class Singleton {

    private static Singleton instance;
    private Singleton() { }

    public static Singleton getInstance() {
        return LazyHolder.INSTANCE;
    }
    
    private static class LazyHolder {
        private static final Singleton INSTANCE = new Singleton();
    }
    //THREAD-SAFE + LAZY
}

```
