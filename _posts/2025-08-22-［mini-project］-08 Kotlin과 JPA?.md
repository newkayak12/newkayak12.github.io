---
layout: post
title: "[미니 프로젝트] 08 Kotlin과 JPA?"
tags:
  - MINI_PROJECT
  - BOOK
categories:
  - MINI_PROJECT
  - BOOK
---
> - [일전의 공부한 내용](./rollup-2025-01.firstHalf.html)을 실제로 구현해보면서 공부해보고자 시작한 프로젝트다.
> - [이전 글](https://newkayak12.github.io/mini_project/book/2025/08/21/mini-project-07-디미터-법칙-적용-중-생긴-고민.html)
> - 아직 공부 중인 개념입니다. 조금 틀려도 너른 이해 부탁드립니다!
> - 이 글은 개인적인 의견을 다룹니다.

# 다루는 내용
- Kotlin과 JPA?

---
# Java Persistence API  
  
## 🧩 1. Kotlin + JPA의 Custom ID 전략  
### 0.  🔑 UUID 사용 이유  
#### 장점  
- 전역적으로 유일한 값을 보장할 수 있다.  
- 분산 환경에서 안전한 ID를 생성할 수 있다.  
- 보안적으로 예측이 불가하기 때문에 보안성을 향상시켜준다.  
- TimeBase-UUID: 사용 시 정렬성까지 갖출 수 있다.  
#### 단점  
- 너무 길다 따라서 인덱스 단편화를 발생시킬 수도 있다.  
- 스토리지 낭비가 있다.  
- 비즈니스적으로 의미가 없는 값이다.  
  
#### UUID 선택 이유  
- 운영 유연성: MicroService 환경 등에서 충돌 걱정이 없음  
- 보안: 난독화된 식별자로 예측 방지  
- 정렬성: Timebased로 일부 성능 이슈 해소가 가능하다.  
  
### 1. Kt에서 @IdGeneratorType  
  
#### 1. kt val 정책  
```kotlin  
////////// annotation  
import org.hibernate.annotations.IdGeneratorType  
  
@IdGeneratorType(TimeBasedIdGenerator::class)  
@Retention(AnnotationRetention.RUNTIME)  
@Target(AnnotationTarget.FIELD)  
annotation class TimeBasedUuidStrategy  
  
////////// 실제 생성  
        class TimeBasedIdGenerator : IdentifierGenerator {  
    override fun generate(        p0: SharedSessionContractImplementor?,        p1: Any?,    ): String {        return UuidGenerator.generate()    }}  
  
/////// 사용처  
  
@Id  
@TimeBasedUuidStrategy  
@Column(name = "id", columnDefinition = "VARCHAR(128)", nullable = false, updatable = false)  
@Comment("식별키")  
val id: String? = null  
```  
  
- 기본적으로 불변 필드를 주 생성자에 정의하는 것이 일반적이다.  
- Hibernate는 Java에서 Setter, Reflection을 사용해서 ID를 주입하려고 한다.  
- 하지만 id로 잡은 주 생성자에 넣은 필드는 setter가 없고 reflection 제한이 있다. -> Runtime Error를 발생시킨다.  
  
#### 2. kt에 맞는 상속 기반 id 전략  
```kotlin  
@MappedSuperclass  
abstract class TimeBasedPrimaryKey : Persistable<String> {  
    @Id    @Column(name = "id", columnDefinition = "VARCHAR(128)", nullable = false, updatable = false)    @Comment("식별키")  
    val id: String = UuidGenerator.generate()  
    @Transient    private var isNewEntity: Boolean = true  
    override fun getId(): String? = id  
    override fun isNew(): Boolean = isNewEntity  
    override fun hashCode(): Int = Objects.hashCode(id)  
    override fun equals(other: Any?): Boolean {        if (other == null) {            return false        }  
        if (other !is HibernateProxy && this::class != other::class) {            return false        }  
        return id == getIdentifier(other)    }  
    private fun getIdentifier(obj: Any): Serializable {        return if (obj is HibernateProxy) {            obj.hibernateLazyInitializer.identifier as Serializable        } else {            (obj as TimeBasedPrimaryKey).id        }    }  
    @PostPersist    @PostLoad    protected fun load() {        isNewEntity = false    }}  
```  
- 직접 equals/hashcode 구현, isNew 판별을 진행합니다.  
- UUID를 곧바로 생성하므로 JPA save가 merge할 가능성이 있다.  
- 즉, hibernate 버그, reflection을 명시적으로 회피하고 직접 생성 방식으로 처리한다.  
  
## 💥 2. TroubleShooting  
### 1. Open  
#### 1. 문제점  
1. JPA Entity는 런타임에 Proxy로 생성해서 사용한다.  
2. Kotlin은 클래스, 메소드 기본이 final이다.  
3. 이 둘은 상충하는 문제다.  
#### 2. 해결  
```kotlin  
kotlin("plugin.spring") version "2.0.10" apply false  
kotlin("plugin.jpa") version "2.0.10" apply false  
```  
- 위 플러그인으로 `@Entity`의 경우 open 시켜서 처리를 했다.  
### 2. val? var?  
#### 1. 문제점  
1. JPA는 지연로딩, 더티체킹을 사용하기 위해서 `mutable`해야 한다.  
2. Kotlin은 기본적으로 `immutable`함을 지향한다.  
3. 이 둘은 상충되는 개념이다.  
#### 2. 해결  
1. JPAEntity는 var로 둔다.  
2. 대신 실질적으로 도메인 로직, 비즈니스 로직을 다루는 DomainEntity를 val로 두고 사용한다.  
#### 3. 빈 생성자  
##### 1. 문제점  
1. JPA는 리플렉션을 바탕으로 동작한다.  
2. 리플렉션을 통해서 주입하기 위해서는 빈 생성자가 필요하다.  
3. kotlin은 PrimaryConstructor를 통해서 프로퍼티를 표현하는 경우가 있다.  
  
#### 2. 해결  
```kotlin  
kotlin("plugin.jpa") version "2.0.10" apply false  
```  
1. 위와 같은 플러그인으로 빈 생성자를 암묵적으로 제공받는다.  
2. primaryConstructor를 두고 보조 생성자로 정의한다.  
  
----------  
### +⍺ JPA와 Kotlin 어울리는건가요?  
- 솔직히 위 두 문제만으로 JPA와 Kotlin은 궁합이 안맞는게 아닌가? 라는 생각이 들었다.  
- 이런 상황에서 `Exposed`나 이전에 사용하던 `jooq`를 사용하는 게 어떤가 하는 의문이 들었다.