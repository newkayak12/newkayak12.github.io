---
layout: post
title: "[미니 프로젝트] 04.User 진행 중 고민한 것들"
tags:
  - MINI_PROJECT
categories:
  - MINI_PROJECT
---
> - [일전의 공부한 내용](./rollup-2025-01.firstHalf.html)을 실제로 구현해보면서 공부해보고자 시작한 프로젝트다.
> - [이전 글](./2025-05-17-［mini-project］-02.eventStorming)
> - 아직 공부 중인 개념입니다. 조금 틀려도 너른 이해 부탁드립니다!


## 04. User에 대한 구현과 이 과정에서 고민한 것들


### 1. module 구조
- 이 프로젝트를 진행하면서 지향하고 있는 바는 아래와 같다.
	1. `Port and Adapter` 패턴 채용
	2. `Domain Driven Design` 채택을 통한 도메인에 대한 이해와 상세를 정하지 않고 개발 및 테스트를 진행할 수 있는 구조
	3. 역할과 책임을 명시하고 객체간 메시지로 통신하는 객체 지향적 사고
- 이러한 목표 아래서 **의미 있는** 이름, **의미 있는** 단위의 module 구조 구성
- multi-module 채택을 통한 엄격한 의존성 구성 등을 고민했다.
- 아래는 결과적으로 채택한 모듈 구조이다.

```
root
  ￂ adapter-module
  ￂ application-module
  ￂ core-module
  ￂ shared-module
  ᄂ test-module
  
```

### 1. core-module
- 해당 모듈에 **core**라는 이름을 붙여준 이유는 다른 어떤 흔들릴 수 있는 세부 사항 속에서 가장 적은 의존성을 가지며, 세부 사항 없이도 도메인에 대한 표현, 로직에 대한 구성을 진행하고 테스트할 수 있음을 표현하기 위해서다.
	- 추가로 처음에는 domain-module이라는 표현을 고민했으나 domain이라는 너무 직접적이고 지엽적일 수 있는 표현보다는 너 포괄적이고 프로젝트 내에서 위치하는 바를 표현하기 위해서 **core**를 채택했다.
- 이 프로젝트에서 가장 핵심이 되는 모듈이다.
- 실제로 의존성도 `shared-module`, `test-module` 이외에는 없다.
- 도메인 모델이 거주하고 있으며, 내부에는 표현력을 위한 값 객체도 거주하고 있다.
- 도메인 모델 스스로 해결할 수 없는 문제를 **협력**을 통해서 해결하는 도메인 서비스도 위치한다.
- 컨텍스트 간 이벤트는 현재 고려하지 않아서 도메인 이벤트는 위치하고 있지 않다.
- 결과적으로 아래와 같은 트리를 작성할 수 있었다.
```
com.reservation
  ￂ {domain}
	  ￂ {domainEnity}
	  ￂ {domainService}
	  ￂ vo
	  ￂ exception
```

### 2. application-module
- 애플리케이션에서 비즈니스 로직이 위치하는 곳이다.
- port and adapter 패턴에서 in/out port와 useCase를 구현한 곳이다.
- domain을 사용하는 곳이다.
- 이러한 이유로 **'응용 계층'** 이라는 의미를 가진다고 생각했고 주저 없이 **application**이라는 단어를 선택했다.
- 결과적으로 아래와 같은 트리를 작성할 수 있었다.
```
com.reservation
  ￂ {domain}
	  ￂ config
	  ￂ port
	  ￨   ￂ input
	  ￨      ￂ output
	  ￨      ￂ usecase
	  ￂ exception
```

### 3. adapter-module
- 모듈 구성의 최외곽부이다. 
- 기술적으로 변경가능성이 높은 상세 부분을 담고 있다.
- 가장 많은 의존성을 가지고 있다.
- adapter라는 명칭을 고른 이유는 in/out port를 구현한 adapter의 개념이 강하기 때문이다.
	- 실질적으로 바깥에서 안으로 들어오는 handler에 대한 구현
	- 외부 저장소, 외부 요청을 진행하는 상세 명세와 애플리케이션 간의 adapter라는 개념이 강했다고 생각한다.
- 결과적으로 아래와 같은 트리를 작성할 수 있었다.
```
com.reservation
  ￂ infrastructure
	  ￂ send
		  ￂ email
  ￂ persistence
	  ￂ entity
	  ￂ adapter
	  ￂ jpa
	  ￂ queryDsl
  ￂ rest
	  ￂ {target}
		  ￂ controller
		  ￂ request
		  ￂ response
```
### 4. shared-module
- 여러 모듈 공통으로 사용하는 내용을 담고 있다.
	- Enumeration, Exception 등을 담고 있다.
- 처음 명칭을 정할 때 **common**이라는 단어를 고민했으나, 너무 포괄적이며 너무 많은 것이 들어갈 수 있는 인상을 줄 것이라고 판단하여 제외했다.
	- 실제로 내용물을 채우면서 **무엇이든 들어가는 만능 상자**로 만들지 않기 위해서 고민했다.
- support라는 명칭도 좋다는 생각이 들었으나, 특정 부분에 의존적인 단어라는 생각이 들어 제외했다.
- 결과적으로 **shared**라는 명칭이 도메인 간에 공유되는 개념이라는 의미로 적합하다고 느꼈다.

### 5. test-module
- 이 모듈이 필요할까? 에 대해서 굉장히 많은 고민을 했다.
- 이 모듈을 만들 때 목적은 **테스트에 도움이 되는 유틸리티를 작성하는 곳**, **테스트에 필요한 Fixture**를 작성하는 곳이었다. 
- 실제로 이곳은 여러 포맷을 갖춘 Arbitrary, FixtureMonkey에 대한 Factory Object를 가지고 있다.
- 공통적인 유형을 가지는 Random한 Arbitrary가 필요하다고 생각했다.
- 고정적인 Fixture보다는 Edge case를 cover할 수 있는 Fixture가 필요하다고 생각했다.
- 실제로 `testImplements()` 로 여러 모듈에서 참조하고 있다.


## 2. Entity

```kotlin
//JPA의 Entity
class UserEntity(  
    loginId: String,  
    password: String,  
    email: String,  
    nickname: String,  
    mobile: String,  
    role: Role,  
) {  
    @Id  
    @TimeBasedUuidStrategy    @Column(name = "id", columnDefinition = "VARCHAR(128)", nullable = false, updatable = false)  
    @Comment("식별키")  
    val id: String? = null  
  
    @Column(  
        name = "login_id",  
        columnDefinition = "VARCHAR(32)",  
        nullable = false,  
        updatable = false,  
    )  
    @Comment("식별키")  
    val loginId: String = loginId  
  
    @Column(name = "password", columnDefinition = "VARCHAR(256)")  
    @Comment("사용자 아이디")  
    var password: String = password  
        protected set  
  
    @Column(name = "old_password", columnDefinition = "VARCHAR(256)")  
    @Comment("이메일")  
    var oldPassword: String? = null  
        protected set  
    @Column(name = "password_changed_datetime", columnDefinition = "DATETIME")  
    @Comment("닉네임")  
    var passwordChangeDateTime: LocalDateTime? = null  
        protected set  
    @Column(name = "is_need_to_change_password", columnDefinition = "TINYINT(1)")  
    @Comment("비밀번호 변경 필요 여부")  
    var isNeedToChangePassword: Boolean = false  
        protected set  
    @Column(name = "email", columnDefinition = "VARCHAR(32)")  
    @Comment("휴대폰 번호")  
    var email: String = email  
        protected set  
  
    @Column(name = "nickname", columnDefinition = "VARCHAR(16)")  
    @Comment("역할 (ROOT, SELLER, USER)")  
    var nickname: String = nickname  
        protected set  
  
    @Column(name = "mobile", columnDefinition = "VARCHAR(13)")  
    @Comment("로그인 실패 카운트")  
    var mobile: String = mobile  
        protected set  
  
    @Column(name = "role", columnDefinition = "ENUM ('ROOT', 'RESTAURANT_OWNER', 'USER')")  
    @Comment("접근 잠긴 날짜-시간")  
    @Enumerated(value = EnumType.STRING)  
    val role: Role = role  
  
    @Column(name = "fail_count", columnDefinition = "TINYINT")  
    @Comment("생성 날짜-시간")  
    var failCount: Int = 0  
        protected set  
  
    @Column(name = "locked_datetime", columnDefinition = "DATETIME")  
    @Comment("수정 날짜-시간")  
    var lockedDatetime: LocalDateTime? = null  
  
    @Column(name = "user_status", columnDefinition = "ENUM ('ACTIVATED', 'DEACTIVATED')")  
    @Comment("역할 (ROOT, SELLER, USER)")  
    var userStatus: UserStatus = UserStatus.ACTIVATED  
        protected set  
  
    @Embedded  
    var auditDateTime: AuditDateTime = AuditDateTime()  
        protected set
}


//DomainEntity
class User(  
    private val id: String? = null,  
    private val loginId: LoginId,  
    private var password: Password,  
    private var personalAttributes: PersonalAttributes,  
    nickname: String,  
) : ServiceUser {
	private var userAttributes: UserAttribute = UserAttribute(nickname, Role.USER)
}


class RestaurantOwner(  
    private val id: String? = null,  
    private val loginId: LoginId,  
    private var password: Password,  
    private var personalAttributes: PersonalAttributes,  
    nickname: String,  
) : ServiceUser {  
    private var userAttributes: UserAttribute = UserAttribute(nickname, Role.RESTAURANT_OWNER)
}
```

- 프로젝트를 시작하면 가장 많은 고민을 했던 부분이다.
- JPA에서 Entity, DDD에서의 Entity가 같지만 다르다는 개념을 알고 특히나 더 그랬다.
- 주변에 조언을 구했을 때 아래와 같은 답변을 받았다.
	1. 구분하지 않고 사용한다.
	2. 구분하지 않고 사용하되 필요한 곳은 구분한다.
	3. 철저하게 구분하여 사용한다.
- 특히나 지배적인 의견은 "**1. 구분하지 않고 사용한다.**" 였다.
	- 경제적인 측면에서 효율적이다.
	- 의미적으로 JPA Entity와  DDD Entity를 동일시 해도 무방하다.
	- 구분하기 시작하면 너무 많은 **보일러플레이트**가 생긴다. 
- 위와 같은 여러 좋은 근거들이 있고 동의한다. 추가로 JPA자체가 DDD의 개념들을 차용하여 설계됐음을 확인했었다.
- 그러나 프로젝트를 진행하면서 "**3. 철저하게 구분하여 사용한다."는 방법으로 하기로 결정했다.
	1. 의도적으로 다르게 설계하고 둘 간의 차이점을 느끼기 위해서
	2. 확장할 수 있는 방향성이 얼마나 다른가 확인하기 위해서
	3. JPA, DDD Entity를 혼용해도 된다고 생각했기에 이에 대한 반례를 찾기 위해서
- <font color="#548dd4">결과적으로 느낀다는 "**꽤 다른 것 같다.**" 였다. </font>
	1. 같은 사용자지만 여러 케이스로 분리할 수 있다. 같은 클래스, 내부 다른 enum으로 표현하기에는 너무 큰 개념이다. 이를 전혀 다른 이름을 가진 클래스로 분리할 수 있었다.
	2. 표현할 수 있는 것들이 다르다. 공통적으로 내부에 필드/프로퍼티를 두고 사용자 유형에 따라 값을 채우고 비울 수도 있지만 여러 가지 관점에서 보면 부적절하다. 근본적으로 분리해서 이런 점에서 벗어날 수 있었다. 
	3. 행동을 분리할 수 있었다. 직접적으로 구현을 하지는 않았지만 각 유형이 가지는 동작이 미세하게 달랐다. 이러한 부분을 내부에서 분기처리하든 정책을 세우든 하는 부분을 아예 분리해서 목적과 역할에 충실할 수 있도록 했다.
- 물론 이런 정당성이 세워졌어도 불편한 부분이 꽤 있었다.

## 3. 매핑
- 이미 꽤 많은 매핑 작업이 필요했다. **port and adapter**를 사용하면서 `input  -> usecase -> output` 마다 매핑을 했다.
- 2회의 매핑과 더불어 `useCase -> domainService`의 이용을 위한 1번의 매핑이 더 추가되어 3번의 매핑이 최소 필요해졌다.
```kotlin
//com.reservation.user.self.port.input.AuthenticateGeneralUserQuery
@FunctionalInterface  
interface AuthenticateGeneralUserQuery {  
    fun execute(request: GeneralUserQueryDto): AuthenticateGeneralUserQueryResult  
  
    data class GeneralUserQueryDto(  
        val loginId: String,  
        val password: String,  
    ) {  
        fun toInquiry(): AuthenticateGeneralUserInquiry {  
            return AuthenticateGeneralUserInquiry(  
                loginId,  
                password,  
            )  
        }  
    }  
  
    data class AuthenticateGeneralUserQueryResult(  
        val accessToken: String,  
        val refreshToken: String,  
    )  
}

//com.reservation.user.self.port.output.AuthenticateGeneralUser
@FunctionalInterface  
interface AuthenticateGeneralUser {  
    fun query(request: AuthenticateGeneralUserInquiry): AuthenticateGeneralUserResult?  
  
    data class AuthenticateGeneralUserInquiry(  
        val loginId: String,  
        val password: String,  
    ) {  
        val role = Role.USER  
    }  
  
    data class AuthenticateGeneralUserResult(  
        private val id: String,  
        private val loginId: String,  
        private val password: String,  
        private val failCount: Int,  
        private val userStatus: UserStatus,  
        private val lockedDatetime: LocalDateTime?,  
    ) {  
        private val role = Role.USER  
  
        fun toDomain(): Authenticate {  
            return Authenticate(  
                id,  
                LoginId(loginId),  
                Password(password, null, null),  
                LockState(failCount, lockedDatetime, userStatus),  
                role,  
            )  
        }  
    }  
}
```

## 4. JPA 사용
- 이미 찾아보면 여러 가지 문제 의식이 보이는 글들이 보이고 반응은 아래와 같다.
	- JPA와 맞지 않는다. 추가로 이는 JPA Entity와 DDD Entity를 동일 시 해야 하는 논거로도 사용된다.
	- `EntityManager`를 직접 사용해서 `save()` 처리를 한다. 이와 더불어 `save()`내 merge 하는 원리를 적어놓기도 한다.
- 이에 대해서 여러 가지 고민을 하긴은 했으나 결과적으로 택한 전략은 아래와 같다.
	- JPA로 `find~()` 한다. 
	- 이를 domain service에서 사용할 수 있도록 변경하고 도메인 로직을 호출한다.
	- 도메인 로직의 결과를 outport를 위한 dto로 변경한다.
	- Update 등을 위한 Adapter에서 JPA로 `find~()` 한다.
	- 기존과 같이 더티 체킹(dirtyChecking)을 사용한다.
- 이 방법이 문제가 있을 수도 있다는 고민을 했지만 아래와 같은 이유로 위 방법으로 진행하기로 했다.
	- Optimistic Lock을 사용해서 버전 관리를 한다. (고민 중)
	- 1차 캐시로 기존 더티 체킹과 같은 횟수의 쿼리를 호출한다.
- 더 나아가 `~adapter`라는 곳에서 "**`load`, jpa entity의 변경을 하는 것이 맞는가?** "라는 고민이 있었다.
- 그러나 **Adapter**가 '호환되지 않는 것을 호환하게 해주는', '인터페이스로 감싸서 사용할 수 있게 해주는' 개념이기에 문제가 없지 않을 것 같다는 생각을 했다.
```kotlin
  
@Component  
class ChangeGeneralUserPasswordAdapter(  
    val jpaRepository: UserJpaRepository,  
) : ChangeGeneralUserPassword {  
    override fun changeGeneralUserPassword(inquiry: ChangeGeneralUserPasswordInquiry): Boolean {  
        val userEntity = jpaRepository.findById(inquiry.id)  
        var result = false  
  
        userEntity.ifPresent {   //dirtyChecking
            it.changePassword(  
                inquiry.encodedPassword,  
                inquiry.oldEncodedPassword,  
                inquiry.changedDateTime,  
            )  
  
            result = true  
        }  
  
        return result  
    }  
}
```


## 5. DomainService의 사용
- core-module은 의존성으로부터 자유로워야 한다.
- Spring을 운용하면서 고민할 점인 "**DomainService를 어떻게 관리할 것인가?**"라는 것이다.
- DomainService의 사용을 위해서 아래와 같은 안을 고민했다.
	1.  매 번 생성한다.
	2.  싱글톤으로 구현한다.
	3.  Spring 의존성을 core-module에 추가하고 `@Component`로 등록한다.
	4.  Factory를 만들고 `@Bean` 으로 설정해서 Component로 등록한다.
- 결과적으로 4번을 선택했다. 이유는 아래와 같다.
	1. 아무래도 Spring을 사용하면서 Spring의 Context에서 벗어나는 방법으로 운용하는 것이 최선일까?라는 물음
	2. 그렇지만 core-module을 Spring으로 오염시켜서는 안된다.
	3. 명시적으로 선언하고 의존성을 주입하고 이를 Spring 내에서 DI를 통해서 주입 받을 수 있는 남은 방법은?
```kotlin
@Configuration  
class GeneralUserServiceFactory {  
    @Bean  
    fun createGeneralUserService(): CreateGeneralUserService = CreateGeneralUserService()  
  
    @Bean  
    fun changeGeneralUserPasswordService(): ChangeGeneralUserPasswordService =  
        ChangeGeneralUserPasswordService()  
  
    @Bean  
    fun changeUserNicknameService(): ChangeUserNicknameService = ChangeUserNicknameService()  
}
```