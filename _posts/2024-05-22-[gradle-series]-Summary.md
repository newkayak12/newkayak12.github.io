---
layout: post
categories: [GRADLE]
---
from [Dictionary - Gradle Summary](https://github.com/newkayak12/Dictionary/blob/master/gradle/Summary.md)




# Gradle 기본 정리

## Gradle?

`Groovy`라는 도메인 언어를 사용하는 빌드 스크립트(태스크로 정의되는)로 정의된 빌드 도구이다. 추가적으로 종속성 관리를 지원한다.


## 특징
1. 유연성: Java, Kotlin, Android 등 다양한 프로그래밍 언어와 플랫폼을 지원한다.
2. 성능 : Maven보다 효율적이며, 증분 빌드를 지원한다.
3. 종속성 관리
4. 빌드 라이프 사이클 관리 : 컴파일, 테스트, 배포를 위한 패키징까지 빌드 라이프사이클의 모든 단계를 지원

## 구성
1. 빌드: 소스컴파일, 테스트 실행, 실행 파일 빌드, 배포를 위한 바이너리 패키징 등 소프트웨어 개발의 다양한 단계를 자동화하는 작업 또는 일련의 작업,
이는 빌드 스크립트에 정의되며, Gradle DSL로 작성되며 보통 `build.gradle`로 명명된다.
2. 태스크: Gradle의 기본 작업 단위, 고유한 이름을 가질 수 있다.
3. 플러그인: 빌드 스크립트에 추가하여 추가 기능을 제공할 수 있게 하는 재사용 가능한 기능
```
plugins {
    id 'java'
}
```
4. 구성: 프로젝트를 위한 종속성이 명명된 집합, `compile`, `testCompile`, `runtime`, `testRuntime` 등 여러 유형을 지원한다.
``` groovy
dependencies {
    compile 'junit:junit:5.0.1' ## 컴파일 단계에서 사용 , deprecated된 구성
    runtime .. ## 애플리케이션 실행에서 사용, 컴파일에는 중요하지 않지만 애플리케이션 실행에는 필요한 경우
    implementation ... ## 소스코드를 구현하는 데 필요한 종속성에 사용, 컴파일, 런타임에 모두 종속성 사요 가능
    testImplementation ... ## 소스코드를 테스트에 사용
    
}
```
5. 레포지토리: 의존성을 다운로드할 수 있는 위치를 명명한다. `mavenCenter()`, `jcenter()`등이 있다.
6. 프로젝트: 소프트웨어 애플리케이션 또는 구성 요소를 나타내는 엔티

## 빌드 스크립트 구조
- 태스크: gradle이 실행해야하는 작업을 정의한다. 
```groovy
task clean(type: Delete) {
    delete rootProject.buildDir
}

task build(type: Jar) {
    from sourceSets.main.output
    archiveBaseName.set(appName)
    archiveVersion.set(version)
}
```
- 소스셋: 소스코드가 포함된 디렉토리를 정의한다.
```groovy
sourceSets {
    main {
        java {
            srcDir'src/main/java'
        }
        resources {
            srcDir'src/main/resources'
        }
    }
    test {
        java {
            srcDir'src/test/java'
        }
        resources {
            srcDir'src/test/resources'
        }
    }
}
```

### 태스크
- javaCompile: 자바 소스 코드를 클래스로 컴파일한다. 소스 및 대상 호환성, 클래스 경로, 종속성 등과 같은 옵션을 지원
```groovy
task compileJava(type: JavaCompile) {
    sourceCompatibility = 1.8
    targetCompatibility = 1.8
    
    sourceSets.main.java.srcDirs.each {
        def file = it.toString()
        options.compilerArgs += ["-classpath", file]
    }
}
```
- test: 테스트를 실행한다.
```groovy
task test(type: Test) {
    testClassesDirs = sourceSets.test.output.classesDirs
    classpath = sourceSets.test.runtimeClasspath
    reports.html.destination file("${buildDir}/test-results")
}
```
- jar: JAR를 생성한다. 
```groovy
task buildJar(type: Jar) {
    baseName = 'myproject'
    version = '1.0'
    from sourceSets.main.output
}
```
- JavaExec: 자파 프로그램 실행
```groovy
task runMain(type: JavaExec) {
    classpath = sourceSets.main.runtimeClasspath
    main = 'com.example.Main'
    args = ['arg1', 'arg2']
}
```
- Copy: 소스 디렉토리에서 대상 디렉토리로 파일 및 디렉토리를 복사한다.
```groovy
task copyFiles(type: Copy) {
    from 'src/main/resources'
    into 'build/resources/main'
    include '**/*.properties'
    filter { line -> line.replaceAll('FOO', 'BAR') }
}
```

## 태스크의 순서
```groovy
task myTask {
    doFirst {
    // runs before any other actions
    }
    doLast {
    // runs after all actions are complete
    }
    finalizedBy anotherTask
    dependsOn someTask
}
```
someTask -> doFirst -> task -> doLast -> anotherTask 순으로 실행된다.

### 태스크 옵션
- `-D` : 작업 구성 또는 종료에서 액세스할 수 있는 시스템 속성을 정의
- `-P` : 프로젝트 객체 또는 작업의 클로저에서 액세스할 수 있는 프로젝트 속성을 정의
- `-x` : 작업을 제외한다. 


## Gradle Properties
빌드 프로세스의 다양한 측면을 구성하는 데 사용하는 Key:Value 쌍 빌드스크립트 전체에서 액세스할 수 있다. 

gradle.properties
```groovy
appName=my-app
version=1.0.0
java.home=/usr/share/java/bin
```