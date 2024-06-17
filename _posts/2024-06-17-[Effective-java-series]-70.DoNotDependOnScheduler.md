# 스케쥴러에 의존하지 말라

보통 OS 스케쥴러에 의존해서 쓰레드를 얼마나 오래 실핼할지 정한다. 그러나 OS 별로 스케쥴링 정책은 달라진다.
따라서 이에 의존하면 정확성, 성능이 스케쥴러에 따라 달라지는 일이 발생한다. 플랫폼에 의존적이게 된다는 의미다.


보통 OS의 평균 쓰레드 수보다 적게 쓰레드 수를 잡으면 스케쥴링에 지장이 생기기 않게 된다. 실행 준비가 됐다면 쓰레드들이 맡은 작업을 끝낼 때까지
굳이 반환할 필요가 없다. 

실행 가능한 쓰레드 수를 적게 유지하는 방법(가용성을 높히는 방법)은 각 쓰레드가 쉬면 대기하고 있는 다른 일을 시키면 된다. 그러면 쉬는 시간이 줄고 가용성이 높아진다.
혹여, CPU 스케쥴링 타임을 제대로 할당받지 못해서 간신히 돌아가는 경우를 보더라도  `Thread.yield`로 쓰레드 권한 이양하는 일은 염두하지 말자.
쓰레드마다 다를 수 있으므로 범용적인 방법은 아닐 수 있다.
